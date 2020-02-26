import redis
myRedis = redis.Redis(host='10.240.14.39', port=6379, password= '12341234', db=0)

if __name__ == "__main__":
    result = myRedis.get(1)
    print(result)
    

