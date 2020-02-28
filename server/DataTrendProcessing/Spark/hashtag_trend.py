import pyspark
from pyspark.sql.types import *
from pyspark.sql.functions import *
import json, time, redis
from itertools import chain
from datetime import datetime

myRedis = redis.Redis(host='10.240.14.39', port=6379, password='12341234', db=1)

spark = pyspark.sql.SparkSession.builder \
    .appName("pysaprk_python") \
    .config('spark.cassandra.connection.host', '10.240.14.37') \
    .config('spark.cassandra.connection.port', '9042') \
    .getOrCreate()

# cassandra 에서 받아오는 data schema
schema = StructType([
    StructField("created_at", StringType(), False),
    StructField("id", LongType(), False),
    StructField("truncated", BooleanType(), False),
    StructField("retweeted", BooleanType(), False),
    StructField("reply_status", BooleanType(), False),
    StructField("is_quote_status", BooleanType(), False),
    StructField("media_status", BooleanType(), False),
    StructField("text", StringType(), False),
    StructField("user", StringType(), False),
    StructField("retweeted_status", StringType(), True),
    StructField("quoted_status", StringType(), True),
    #     StructField("hashtags", ArrayType(), False),
    StructField("entities", StringType(), False),
    StructField("extended_entities", StringType(), True),
    StructField("extended_tweet", StringType(), True),
    StructField("lang", StringType(), False),
    StructField("date", StringType(), False),
    StructField("timestamp", LongType(), False)
])

# 분석 대상에서 제외할 단어 명시
mystopwords = [
    'BTS',
    'bts',
    'Bts',
    '방탄소년단'
]

# 유사어 설정
similarwords = [
    ['정국', 'JUNGKOOK'],
    ['지민', 'JIMIN'],
    ['제이홉', 'JHOPE'],
    ['슈가', '윤기'],
    ['김태형', '태형', '뷔', 'KIMTAEHYUNG', 'TAEHYUNG'],
    ['김남준', '남준', '랩몬', 'KIMNAMJOON', 'NAMJOON'],
    ['김석진', '석진', '진', 'KIMSEOKJIN', 'SEOKJIN']
]

SECONDS = 30000000


# get DStream dataframe
def get_streaming(tweet, retweet, schema=None):
    if bool(tweet.take(1)) or bool(retweet.take(1)):
        result = process_df(tweet, retweet)
        return result
    else:
        return False


# 카산드라로 부터 받아온 데이터프레임 가공
def process_df(tweet, retweet):
    tweet_rdd = tweet.rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['hashtags']).collect()
    retweet_rdd = retweet.select('retweeted_status').rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['entities']).map(lambda v: v['hashtags']).collect()
    
    result = []
    for i in tweet_rdd:
        temp = []
        for j in i:
            temp.append(j['text'])
        result.append(temp)
    for i in retweet_rdd:
        temp = []
        for j in i:
            temp.append(j['text'])
        result.append(temp)
        
    processing_result = process_hashtag(result)
    # word count 작업을 위해 결과(list) rdd로 만들어줌
    rdd = spark.sparkContext.parallelize(processing_result, 2)
    count_result = word_count(rdd)
    return count_result


# 해시태그 전처리
def process_hashtag(text):
    del_similar = []
    result = []
    # 각 tweet 별 유사어 제거
    for v in text:
        if not v:
            continue
        words = '-'.join(v)
        words = words.upper()
        temp = []
        for i in similarwords[0]:
            if i in words:
                words = words.replace(i, 'Jungkook')
        for i in similarwords[1]:
            if i in words:
                words = words.replace(i, 'Jimin')
        for i in similarwords[2]:
            if i in words:
                words = words.replace(i, 'JHope')
        for i in similarwords[3]:
            if i in words:
                words = words.replace(i, 'SUGA')
        for i in similarwords[4]:
            if i in words:
                words = words.replace(i, 'V')
        for i in similarwords[5]:
            if i in words:
                words = words.replace(i, 'RM')
        for i in similarwords[6]:
            if i in words:
                words = words.replace(i, 'JIN')
        temp = words.split('-')
        temp = list(set(temp))
        del_similar.append(temp)

    total = list(chain.from_iterable(del_similar))  # 리스트 안에 리스트 하나의 리스트로 합치기
    # 불용어 제거
    for i in total:
        if i not in mystopwords:
            result.append(i)

    print('응 들어옴')
    # print(result)
    return result


# 추출된 단어 word count
def word_count(list):
    print('word count 들어옴')
    pairs = list.map(lambda word: (word, 1))
    # 상위 15개만 가져오기 + 등장빈도 2번 이상
    wordCounts = pairs.reduceByKey(lambda x, y: x + y).filter(lambda args: args[1] > 2)
    ranking = wordCounts.takeOrdered(15, lambda args: -args[1])
    print(ranking)
    if not ranking:  # 순위 없는 경우
        return False
    return ranking


# 해시태그 순위 저장
def save_hashtag(data, time):
    # key : 'hashtag' , value : 순위 결과 json 으로 redis 저장
    rank_to_json = json.dumps(data)
    myRedis.set('hashtag', rank_to_json, ex=60 * 60 * 24 * 7)
    print('저장완료')


if __name__ == "__main__":
    while True:
        # 현재시간 마이크로 세컨즈 까지
        current_time = int(time.time() * 1000000)  # 현재시간 마이크로 세컨즈 까지
        # redis 저장 포맷 시간 형식 ( 년/월/일/시/분) 으로
        current_time_format = datetime.fromtimestamp(int(current_time / 1000000)).strftime('%Y/%m/%d/%H/%M')
        date = datetime.now().date().__str__()
        hour = datetime.now().hour
        # 카산드라로부터 data 불러오기 (30초 마다)
        # 트윗 데이터
        tweet = spark.read \
            .format("org.apache.spark.sql.cassandra") \
            .options(table="tweet_dataset", keyspace="bts") \
            .load().select('entities') \
            .where(col('date') == date) \
            .where(col('hour') == hour) \
            .where(col('timestamp') >= current_time - SECONDS) \
            .where(col('timestamp') <= current_time).cache()
        # 리트윗 데이터 
        retweet = spark.read \
            .format("org.apache.spark.sql.cassandra") \
            .options(table="retweet_dataset", keyspace="bts") \
            .load().select("*") \
            .where(col('date') == date) \
            .where(col('hour') == hour) \
            .where(col('timestamp') >= current_time - SECONDS) \
            .where(col('timestamp') <= current_time).cache()
        print(current_time_format)
        print(current_time)  # 현재시간 출력

        result = get_streaming(tweet, retweet)
        if result is not False:
            save_hashtag(result, current_time_format)
        else:
            print('there is no data')
        time.sleep(20)

