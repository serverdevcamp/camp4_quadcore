from __future__ import print_function

import sys
import time, json
from datetime import datetime

from pyspark import SparkConf, SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils

from pyspark.sql import *
from pyspark.sql.functions import *
from pyspark.sql.types import *


# DataFrame으로 변환 후 처리할 때
def process(RDD):
    # full_schema
    schema = StructType([
        StructField("created_at", StringType(), False),
        StructField("id", LongType(), True),
        StructField("truncated", BooleanType(), True),
        StructField("retweeted", BooleanType(), True),
        StructField("reply_status", BooleanType(), True),
        StructField("is_quote_status", BooleanType(), True),
        StructField("media_status", BooleanType(), True),
        StructField("hashtags", ArrayType(), True),
        StructField("text", StringType(), True),
        StructField("quote_count", IntegerType(), True),
        StructField("reply_count", IntegerType(), True),
        StructField("retweet_count", IntegerType(), True),
        StructField("favorite_count", IntegerType(), True),
        StructField("user", StringType(), True),
        StructField("retweeted_status", StringType(), True),
        StructField("quoted_status", StringType(), True),
        StructField("entities", StringType(), True),
        StructField("extended_entities", StringType(), True),
        StructField("extended_tweet", StringType(), True),
        StructField("lang", StringType(), True),
        StructField("date", StringType(), True),
        StructField("timestamp", LongType(), True)
    ])
    
    try:
        spark = SparkSession \
            .builder \
            .appName("Spark SQL basic") \
            .config("spark.cassandra.connection.host", "spark.cassandra.connection.host") \
            .config("spark.cassandra.connection.port", "spark.cassandra.connection.port") \
            .getOrCreate()
        
        df = spark.read.json(RDD)
        
#         오류 발생
#         df.write\
#             .format("org.apache.spark.sql.cassandra")\
#             .mode('append')\
#             .options(table="testing", keyspace="test")\
#             .save()
  
        """ 학습용 코드 설명 """
        # 기본 출력
        df.printSchema()
        df.show(n=20, truncate=True, vertical=False)
        
        # SQL문 활용
        df.createOrReplaceTempView("tweet")
        _df = spark.sql("SELECT id, created_at FROM tweet")
        
        # Column 필터링
        schema_lambda = lambda x : (x in tweet_schema)
        is_existing = list(filter(schema_lambda, df.columns))
        tweet = df.selectExpr(is_existing) # 존재하지 않는 컬럼을 select하면 오류 발생

        # Value가 Json 형태인 것을 하나의 Column인 Dataframe으로 반환
        user = df.selectExpr(user_schema).toJSON().collect()
        user_rdd = sc.parallelize(user)
        user_rows = user_rdd.map(lambda x: Row(x))
        user_df = spark.createDataFrame(user_rows,  ['user'])      
        
        # 기타 유용한 처리
        # https://github.com/apache/spark/tree/86fdb818bf5dfde7744bf2b358876af361ec9a68/examples/src/main/python/sql
        
    except:
        print("**********ERROR OCCUR**********")
        pass


if __name__ == "__main__":
    conf = SparkConf()
    conf.setAppName("Streamer")
    conf.set("spark.cassandra.connection.host", "10.240.14.37")
    conf.set("spark.cassandra.connection.port", "9042")

    # SparkContext represents the connection to a Spark cluster
    # Only one SparkContext may be active per JVM
    sc = SparkContext(conf=conf)

    # Creating a streaming context with batch interval of 10 sec
    # As the main point of entry for streaming, StreamingContext handles the streaming application's actions, 
    # including checkpointing and transformations of the RDD.
    ssc = StreamingContext(sc, 3)

    # DStream 반환 (RDD로 이루어진 객체) (RDD 스파크 데이터 단위)
    kafkaStream = KafkaUtils.createDirectStream(
        ssc, 
        topics = ["tweets"], 
        kafkaParams = {"bootstrap.servers": "localhost:9092"}
            #"group.id" -> "spark-streaming-notes",
            #"auto.offset.reset" -> "earliest"
    )
    
    # OR, process 내에서 read.json을 하므로 한번만 처리
    DStream = kafkaStream.map(lambda tweet: json.loads(tweet[1]))
    DStream.foreachRDD(process)
    
    # 유용한 구조
    # https://github.com/valavanisleonidas/Twitter-Inappropriate-Language-Detection/blob/master/kafka-consumer-cassandra/kafka-consumer-cassandra.py

    #Start Execution of Streams
    ssc.start()
    ssc.awaitTermination()

