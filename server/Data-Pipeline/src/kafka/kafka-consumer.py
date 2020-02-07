from __future__ import print_function

import sys
import time, json

from pyspark import SparkConf, SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils

from pyspark.sql import Row, SparkSession

def getSparkSessionInstance(sparkConf):
    if ('sparkSessionSingletonInstance' not in globals()):
        globals()['sparkSessionSingletonInstance'] = SparkSession\
            .builder\
            .config(conf=sparkConf)\
            .getOrCreate()
    return globals()['sparkSessionSingletonInstance']

def process(time, rdd):
    print("========= %s =========" % str(time))

    try:
        # Get the singleton instance of SparkSession
        spark = getSparkSessionInstance(rdd.context.getConf())

        # Convert RDD[String] to RDD[Row] to DataFrame
        rowRdd = rdd.map(lambda w: Row(word=w))
        wordsDataFrame = spark.createDataFrame(rowRdd)
        wordsDataFrame.show()
        # Creates a temporary view using the DataFrame.
        wordsDataFrame.createOrReplaceTempView("words")

        # Do word count on table using SQL and print it
#         wordCountsDataFrame = \
#             spark.sql("select word, count(*) as total from words group by word")
#         wordCountsDataFrame.show()
        
    except:
        pass

def main():
    conf = SparkConf()
    conf.setAppName('Streamer')
    conf.set("spark.ui.port", "3000")
    
    sc = SparkContext(conf=conf)

    # Creating a streaming context with batch interval of 10 sec
    ssc = StreamingContext(sc, 10)
    ssc.checkpoint("checkpoint")
    Stream = stream(ssc, 100)


   
    
def stream(ssc, duration):
    kafkaStream = KafkaUtils.createDirectStream(
    ssc, topics = ['test'], kafkaParams = {"metadata.broker.list": 'localhost:9092'})
    
    #Parse Twitter Data as json
    parsed = kafkaStream.map(lambda tweet: json.loads(json.loads(tweet[1])))

    dstream = parsed .map(lambda tweet: tweet['id'])
    dstream.pprint()
    
    #parsed.foreachRDD(process)

    #Count the number of tweets per User
    #user_counts = parsed.map(lambda tweet: tweet['id'])

    #Print the User tweet counts
    #user_counts.pprint()

    #Start Execution of Streams
    ssc.start()
    ssc.awaitTermination()

    return True

if __name__ == "__main__":
    main()


