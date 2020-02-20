import pyspark
from pyspark.streaming import StreamingContext
from pyspark import StorageLevel
from pyspark.sql.types import *
import json, time,redis
from itertools import chain
myRedis = redis.Redis(host='10.240.14.39', port=6379, password= '12341234', db=1)

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
    ['슈가', 'SUGA'],
    ['김태형', '태형', '뷔', 'TAEHYUNG'],
    ['김남준', '남준', '랩몬', 'RM'],
    ['김석진', '석진', '진', 'SEOKJIN', 'JIN']
]

SECONDS = 20000000

# get DStream dataframe
def get_streaming(data, schema=None):
    result = process_df(data)
    return result

# 카산드라로 부터 받아온 데이터프레임 가공
def process_df(data):
    rdd = data.rdd.map(lambda value: json.loads(value[0])) \
        .map(lambda v: v['hashtags']).collect()
    result = []
    for i in rdd:
        temp = []
        for j in i:
            temp.append(j['text'])
        result.append(temp)
    # print(result)
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
                words = words.replace(i, 'Suga')
        for i in similarwords[4]:
            if i in words:
                words = words.replace(i, 'Taehyung')
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
    # 상위 10개만 가져오기 + 등장빈도 2번 이상
    wordCounts = pairs.reduceByKey(lambda x, y: x + y).filter(lambda args: args[1] > 2)
    ranking = wordCounts.takeOrdered(20, lambda args: -args[1])
    print(ranking)
    return ranking

    # 해시태그 순위 저장
def save_hashtag(data,time):
    # key : 현재 시간 , value : 순위 결과 json 으로 redis 저장
    rank_to_json = json.dumps(data)
    myRedis.set(current_time, rank_to_json, ex=60*60)
    print('저장완료')

if __name__ == "__main__":
    while True:
        # 카산드라로부터 data 불러오기  (20초마다)
        lines = spark.read \
            .format("org.apache.spark.sql.cassandra") \
            .options(table="master_dataset", keyspace="bts") \
            .load()
        current_time = int(time.time() * 1000000)  # 현재시간 마이크로 세컨즈 까지
        print(current_time)  # 현재시간 출력
        # 현재 시간 부터 20초 전까지 data 불러오기
        lines = lines.select('entities') \
            .where((lines.timestamp >= current_time - SECONDS) & (lines.timestamp <= current_time)).cache()
        result = get_streaming(lines)
        save_hashtag(result, current_time)
        time.sleep(20)

