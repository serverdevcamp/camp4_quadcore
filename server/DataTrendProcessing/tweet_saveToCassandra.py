import pyspark
from pyspark.streaming import StreamingContext
from itertools import chain
from pyspark.sql.functions import *
from pyspark.sql.types import *
import json, time

spark = pyspark.sql.SparkSession.builder \
    .appName("pysaprk_python") \
    .config('spark.cassandra.connection.host', '10.240.14.37') \
    .config('spark.cassandra.connection.port', '9042') \
    .getOrCreate()

schema = [
    'retweeted as is_retweeted',
    'retweeted_status as tweet_content',
    'timestamp'
]

struct = StructType([StructField("tweet_id", LongType(), False),
                     StructField("tweet_content", StringType(), False),
                     StructField("favorite_count", LongType(), False),
                     StructField("quote_count", LongType(), False),
                     StructField("retweeted_count", LongType(), False),
                     StructField("timestamp", LongType(), False)])

def process_tweet(data):
    # df 생성에 필요한 데이터 추출 (리트윗 된 트윗 id, 트위 내용, 트윗 좋아요 개수, 트윗 인용 개수, 리트윗 개수, 작성시간)
    tweet_content = data.select('tweet_content').rdd.flatMap(lambda value: value).collect()
    tweet_id = data.select('tweet_content').rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['id']).collect()
    favorite_count = data.select('tweet_content').rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['favorite_count']).collect()
    quoted_count = data.select('tweet_content').rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['quote_count']).collect()
    retweeted_count = data.select('tweet_content').rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['retweet_count']).collect()
    timestamp = data.select('timestamp').rdd.flatMap(lambda value: value).collect()

    # 새로운 dataframe 생성
    newDF = spark.createDataFrame(
        zip(tweet_id, tweet_content, favorite_count, quoted_count, retweeted_count, timestamp), struct)
    newDF.show()
    save_tweet(newDF)

def save_tweet(df):
    df.write.format("org.apache.spark.sql.cassandra")\
    .mode('append').options(table="tweet_rank", keyspace="bts").save()


if __name__ == "__main__":
    # 카산드라로부터 data 불러오기 (10초 마다)
    lines = spark.read \
        .format("org.apache.spark.sql.cassandra") \
        .options(table="master_dataset", keyspace="bts") \
        .load()
    # 현재시간 마이크로 세컨즈 까지
    current_time = int(time.time() * 1000000)
    print(current_time)  # 현재시간 출력
    # 현재 시간 부터 10초 전까지 data 불러오기
#     lines = lines.selectExpr(schema) \
#         .where((lines.timestamp >= current_time - 10000000) & (lines.timestamp <= current_time) & (
#                 lines.retweeted == True)).limit(10).cache()
    lines = lines.selectExpr(schema) \
             .where((lines.timestamp >= 1582021648253458 - 300000000) & (lines.timestamp <= 1582021648253458) & (
                lines.retweeted == True)).limit(100).cache()
    #lines.show()
    process_tweet(lines)
#     while True:
#         # 카산드라로부터 data 불러오기 (10초 마다)
#         lines = spark.read \
#             .format("org.apache.spark.sql.cassandra") \
#             .options(table="master_dataset", keyspace="bts") \
#             .load()
#         # 현재시간 마이크로 세컨즈 까지
#         current_time = int(time.time() * 1000000)
#         print(current_time)  # 현재시간 출력
#         # 현재 시간 부터 10초 전까지 data 불러오기
#         lines = lines.selectExpr(schema) \
#             .where((lines.timestamp >= current_time - 10000000) & (lines.timestamp <= current_time) & (
#                     lines.retweeted == True)).limit(10).cache()
#         # lines.show()
#         process_tweet(lines)
#         time.sleep(10)

