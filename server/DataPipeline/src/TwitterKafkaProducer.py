# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import threading, logging, time
from datetime import datetime
import configparser
import json

from tweepy import OAuthHandler, Stream, StreamListener
from kafka import KafkaProducer
from kafka.errors import KafkaError

class Producer():
    def __init__(self, bootstrap_servers):
        print("Kafka Producer Object Create")
        try:
            self.producer = KafkaProducer(
                bootstrap_servers = bootstrap_servers,
                max_block_ms = 10000, 
                retries = 0, # default value
                acks = 1, # default value
                value_serializer = lambda v: json.dumps(v).encode("utf-8")
            )
        except KafkaError as exc:
            print("kafka producer - Exception during connecting to broker - {}".format(exc))
            return False
        
    def stop(self):
        self.producer.close()

    def send_data(self, topic, data):        
        # Asynchronous by default
        future = self.producer.send(topic, data).add_callback(self.on_send_success).add_errback(self.on_send_error)
        
        # block until all async messages are sent
        self.producer.flush()
    
    def on_send_success(self, record_metadata):
        print("**********Send Success***********")
        print("record_metadata.topic: ", record_metadata.topic)
        print("record_metadata.partition: ", record_metadata.partition)
        print("record_metadata.offset: ", record_metadata.offset)
        pass

    def on_send_error(self, excp):
        print("**********Send Error Occur**********")
        log.error("I am an errback", exc_info=excp)

        
class TwitterStreamListener(StreamListener):
    """ A class to read the twitter stream and push it to Kafka"""

    def __init__(self):
        super(StreamListener, self).__init__()
        self.producer = Producer(bootstrap_servers="localhost:9092")

    def on_data(self, raw_data):
        data = json.loads(raw_data)

        if 'retweeted_status' in data:
            try:
                self.producer.send_data("retweets", data)
            except KafkaError as e:
                print(e)
                return False
            
        elif 'in_reply_to_status_id' in data:
            try:
                self.producer.send_data("tweets", data)
            except KafkaError as e:
                print(e)
                return False
            
        elif 'delete' in data:
            print(data)
            pass
        elif 'event' in data:
            print(data)
            pass
        elif 'direct_message' in data:
            print(data)
            pass
        elif 'friends' in data:
            print(data)
            pass
        elif 'limit' in data:
            print(data)
            pass
        elif 'disconnect' in data:
            print(data)
            pass
        elif 'warning' in data:
            print(data)
            pass
        elif 'scrub_geo' in data:
            print(data)
            pass
        elif 'status_withheld' in data:
            print(data)
            pass
        elif 'user_withheld' in data:
            print(data)
            pass
        else:
            log.error("Unknown message type: %s", raw_data)


    def on_error(self, status_code):
        print("Error received in kafka producer")
        return True  # Don't kill the stream

    def on_timeout(self):
        return True  # Don't kill the stream

    
if __name__ == "__main__":
    logging.basicConfig(
        format="%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s",
        level=logging.INFO
    )
    
    # Read the credententials from 'twitter-app-credentials.txt' file
    config = configparser.ConfigParser()
    config.read("twitter-app-credentials.txt")
    CONSUMER_KEY = config["DEFAULT"]["CONSUMER_KEY"]
    CONSUMER_SECRET = config["DEFAULT"]["CONSUMER_SECRET"]
    ACCESS_TOKEN = config["DEFAULT"]["ACCESS_TOKEN"]
    ACCESS_TOKEN_SECRET = config["DEFAULT"]["ACCESS_TOKEN_SECRET"]

    # Create Auth object
    auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    # Create stream and bind the listener to it
    stream = Stream(auth, listener=TwitterStreamListener())
    stream.filter(track=["BTS,bts,#BTS,#bts"], languages = ["en"], filter_level = "low")
    
