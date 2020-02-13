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

import pyspark_cassandra # saveToCassandra 함수, package 추가 필요

# 처리를 위해 필요한 스키마 1. Tweet 2. User 3. Quoted
tweet_schema = [
    'created_at',
    'id',
    'retweeted',
    'truncated',
    'text',
    'extended_tweet', # 생략 가능 # 내부 정보
    'extended_entities', # 생략 가능 # 내부 정보
    'entities', # 내부 정보
    'is_quote_status',
    'quoted_status', # 생략 가능 # 내부 정보
    'lang',
] # user, quoted_status, retweeted_status, in_reply_to_status_id 은 따로 처리


user_schema = [
    'id', 
    'name',
    'screen_name',
    'location',
    'url',
    'description',
    'followers_count',
    'friends_count',
    'listed_count',
    'favourites_count',
    'statuses_count',
    'created_at',
    'profile_image_url',
]

quote_schema = [
    'created_at',
    'id',
    'in_reply_to_status_id', # reply인지 아닌지 판단 기준. 데이터는 user_mentions로 렌더링
    'truncated',
    'text',
    'extended_tweet', # 생략 가능 # 내부 정보
    'entities', # 내부 정보
] # user는 따로 처리

media_schema = [
    'id',
    'indices',
    'media_url',
    'type'
]

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
        StructField("text", StringType(), True),
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
            .config('spark.cassandra.connection.host', 'localhost') \
            .config('spark.cassandra.connection.port', '9042') \
            .getOrCreate()
        
        df = spark.read.json(RDD, schema)
        
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
        user_df = spark.createDataFrame(user_rows,['user'])      
        
        # 기타 유용한 처리
        # https://github.com/apache/spark/tree/86fdb818bf5dfde7744bf2b358876af361ec9a68/examples/src/main/python/sql
        
    except:
        print("**********ERROR OCCUR**********")
        pass


# JSON 형태의 RDD 필터링 함수
def tweet_filter(RDD):
    filtered = {}

    # Retweet 판단 후 처리
    if RDD['text'][0:2] == "RT":
        filtered['retweeted_status'] = tweet_filter(RDD['retweeted_status'])

    # Reply 판단 후 처리
    if RDD['in_reply_to_status_id']:
        filtered['reply_status'] = True
    else:
        filtered['reply_status'] = False

    # tweet_schema 처리
    tweet_lambda = lambda x : (x in tweet_schema)
    isExisting = list(filter(tweet_lambda, RDD.keys()))
    for key in isExisting:
        filtered[key] = RDD[key]
    
    # user_schema 처리
    filtered['user'] = {}
    for key in user_schema:
        filtered['user'][key] = RDD['user'][key]

    # quote_schema 처리
    if RDD['is_quote_status']:
        filtered['quoted_status'] = {}
        quoted_lambda = lambda x : (x in quote_schema)
        isExisting = list(filter(quoted_lambda, RDD['quoted_status'].keys()))
        for key in isExisting:
            filtered['quoted_status'][key] = RDD['quoted_status'][key]

        filtered['quoted_status']['user'] = {}
        for key in user_schema:
            filtered['quoted_status']['user'][key] = RDD['quoted_status']['user'][key]

    # media_schema 처리
    if 'media' in RDD['entities']:
        filtered['media_status'] = True
        for index, value in enumerate(RDD['entities']['media']):
            new_data = {}
            for key in media_schema:
                new_data[key] = value[key]
            if value['type'] == 'video':
                new_data['video_info'] = value['video_info']
            filtered['entities']['media'][index] = new_data
            filtered['extended_entities']['media'][index] = new_data
    elif RDD['truncated'] and 'media' in RDD['extended_tweet']['entities']:
        filtered['media_status'] = True
        for index, value in enumerate(RDD['extended_tweet']['entities']['media']):
            new_data = {}
            for key in media_schema:
                new_data[key] = value[key]
            if value['type'] == 'video':
                new_data['video_info'] = value['video_info']
            filtered['extended_tweet']['entities']['media'][index] = new_data
            filtered['extended_tweet']['extended_entities']['media'][index] = new_dat
    else:
        filtered['media_status'] = False

    # struct 변환 타입 모두 덤프로
    struct_type = ["user", "retweeted_status", "quoted_status", "entities", "extended_entities", "extended_tweet"]
    for type in struct_type:
        if type in filtered:
            filtered[type] = json.dumps(filtered[type])
        else:
            filtered[type] = None

    # date 추가
    datetime_object = datetime.strptime(filtered['created_at'], '%a %b %d %H:%M:%S %z %Y')
    filtered['date'] = datetime_object.date().__str__()
    filtered['timestamp'] = int(time.time()*1000000)
       
    return filtered
      

if __name__ == "__main__":
    conf = SparkConf()
    conf.setAppName('Streamer')
    conf.set("spark.ui.port", "3000")
    conf.set('spark.cassandra.connection.host', 'localhost')
    conf.set('spark.cassandra.connection.port', '9042')

    # SparkContext represents the connection to a Spark cluster
    # Only one SparkContext may be active per JVM
    sc = SparkContext(conf=conf)


    # Creating a streaming context with batch interval of 10 sec
    # As the main point of entry for streaming, StreamingContext handles the streaming application's actions, 
    # including checkpointing and transformations of the RDD.
    ssc = StreamingContext(sc, 10)

    # DStream 반환 (RDD로 이루어진 객체) (RDD 스파크 데이터 단위)
    kafkaStream = KafkaUtils.createDirectStream(
        ssc, 
        topics = ['Test'], 
        kafkaParams = {"bootstrap.servers": 'localhost:9092'}
            #"group.id" -> "spark-streaming-notes",
            #"auto.offset.reset" -> "earliest"
    )

    #Parse Twitter Data as json
    json_stream = kafkaStream.map(lambda tweet: json.loads(json.loads(tweet[1])))
    parsed = json_DStream.map(lambda tweet: tweet_filter(tweet))
    parsed.foreachRDD(lambda x: x.saveToCassandra("test", "testing"))
    parsed.pprint()
    
    # OR, process 내에서 read.json을 하므로 한번만 처리
    # DStream = kafkaStream.map(lambda tweet: json.loads(tweet[1]))
    # dump_parsed.foreachRDD(process)
    
    # 유용한 구조
    # https://github.com/valavanisleonidas/Twitter-Inappropriate-Language-Detection/blob/master/kafka-consumer-cassandra/kafka-consumer-cassandra.py

    #Start Execution of Streams
    ssc.start()
    ssc.awaitTermination()

