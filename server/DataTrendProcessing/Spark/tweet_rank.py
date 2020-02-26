import pyspark
from pyspark.sql.functions import *
from pyspark.sql.types import *
import json, time, redis
import pyspark.sql.functions as f
from datetime import datetime

myRedis = redis.Redis(host='10.240.14.39', port=6379, password= '12341234', db=0)

spark = pyspark.sql.SparkSession.builder \
    .appName("pysaprk_python") \
    .config('spark.cassandra.connection.host', '10.240.14.37') \
    .config('spark.cassandra.connection.port', '9042') \
    .getOrCreate()

schema = [
    'retweeted_status',
    'timestamp'
]

struct = StructType([StructField("tweet_id", LongType(), False),
                     StructField("tweet_content", StringType(), False),
                     StructField("favorite_count", LongType(), False),
                     StructField("quote_count", LongType(), False),
                     StructField("retweeted_count", LongType(), False),
                     StructField("timestamp", LongType(), False)])

SECONDS = 30000000

def process_tweet(data):
    print('process 들어옴')
    if bool(data.take(1)):        
        # df 생성에 필요한 데이터 추출 (리트윗 된 트윗 id, 트위 내용, 트윗 좋아요 개수, 트윗 인용 개수, 리트윗 개수, 작성시간)
        tweet_content = data.select('retweeted_status').rdd.flatMap(lambda value: value).collect()
        tweet_id = data.select('retweeted_status').rdd.map(lambda value: json.loads(value[0])) \
            .map(lambda v: v['id']).collect()
        favorite_count = data.select('retweeted_status').rdd.map(lambda value: json.loads(value[0])) \
            .map(lambda v: v['favorite_count']).collect()
        quoted_count = data.select('retweeted_status').rdd.map(lambda value: json.loads(value[0])) \
            .map(lambda v: v['quote_count']).collect()
        retweeted_count = data.select('retweeted_status').rdd.map(lambda value: json.loads(value[0])) \
            .map(lambda v: v['retweet_count']).collect()
        timestamp = data.select('timestamp').rdd.flatMap(lambda value: value).collect()

        # 새로운 dataframe 생성
        newDF = spark.createDataFrame(
            zip(tweet_id, tweet_content, favorite_count, quoted_count, retweeted_count, timestamp), struct)
        newDF.show()
        result = rank_tweet(newDF)
        return result
    else:
        return False

        
 # 트윗 랭킹 집계
def rank_tweet(df):
    if bool(df.take(1)):
        print('rank 들어옴')
        # (favorite + quote + retweet) count 값 합산한 새로운 column 'total' 생성
        df = df.withColumn('total', df.favorite_count + df.quote_count + df.retweeted_count)
        # 같은 tweet_id 중 최신 것만 집계 (total 순으로)
        rank = df.groupBy(df.tweet_id).agg(
            f.first('tweet_content').alias('tweet_content'),
            f.first('total').alias('total'),
            f.max('timestamp').alias('timestamp')
        ).orderBy('total', ascending=False)
        rank.show()
        # 상위 랭킹 10개의 tweet 내용 리스트로 변환
        tweet_list = rank.select('tweet_content').rdd.flatMap(lambda x: x).take(10)
        return tweet_list
    else:
        print('데이터프레임 비어있음')
        return False

        
# 트윗 저장
def save_tweet(data,time):
    #     df.write.format("org.apache.spark.sql.cassandra")\
    #     .mode('append').options(table="tweet_rank", keyspace="bts").save()
    # key : 현재 시간 , value : 순위 결과 json 으로 redis 저장
    rank_to_json = json.dumps(data)
    myRedis.set(time, rank_to_json, ex=60 * 60 * 24 * 7)  # 일주일 expire
    print('저장완료')


if __name__ == "__main__":
    while True:
        # 현재시간 마이크로 세컨즈 까지
        current_time = int(time.time() * 1000000)  # 현재시간 마이크로 세컨즈 까지
        # redis 저장 포맷 시간 형식 ( 년/월/일/시/분) 으로 
        current_time_format = datetime.fromtimestamp(int(current_time/1000000)).strftime('%Y/%m/%d/%H/%M')
        date = datetime.now().date().__str__()
        hour = datetime.now().hour
        
        # 카산드라로부터 data 불러오기 (30초 마다)
        lines = spark.read \
        .format("org.apache.spark.sql.cassandra") \
        .options(table="retweet_dataset", keyspace="bts") \
        .load().select(schema) \
        .where(col('date') == date) \
        .where(col('hour') == hour) \
        .where(col('timestamp') >= current_time - SECONDS) \
        .where(col('timestamp') <= current_time).cache()
        print(current_time_format)
        print(current_time)  # 현재시간 출력

        result = process_tweet(lines)
        if result is not False:
            #print(result)
            save_tweet(result, current_time_format)
        else:
            print('there is no data')
        time.sleep(20)


