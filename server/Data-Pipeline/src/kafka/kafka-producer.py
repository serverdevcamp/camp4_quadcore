# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import threading, logging, time
import configparser
import json

from tweepy import OAuthHandler, Stream, StreamListener
from kafka import KafkaProducer
from kafka.errors import KafkaError

class Producer():
    def __init__(self):
        print('Kafka Producer Object Create')
        
    def stop(self):
        self.producer.close()

    def run(self, bootstrap_servers):
        print('Creating kafka producer')
        try:
            self.producer = KafkaProducer(
                bootstrap_servers = bootstrap_servers,
                max_block_ms = 10000, 
                retries = 0, # default value
                acks = 1, # default value
                value_serializer = lambda v: json.dumps(v).encode('utf-8')
            )
        except KafkaError as exc:
            print('kafka producer - Exception during connecting to broker - {}'.format(exc))
            return False
            
        
    def send_data(self, topic, data):        
        # Asynchronous by default
        future = self.producer.send(topic, data).add_callback(self.on_send_success).add_errback(self.on_send_error)
        
        
        
        # block until all async messages are sent
        self.producer.flush()
    
    def on_send_success(self, record_metadata):
        print('**********Send Success***********')
        print('record_metadata.topic: ', record_metadata.topic)
        print('record_metadata.partition: ', record_metadata.partition)
        print('record_metadata.offset: ', record_metadata.offset)

    def on_send_error(self, excp):
        print('**********Send Error Occur**********')
        log.error('I am an errback', exc_info=excp)

        
class TwitterStreamListener(StreamListener):
    """ A class to read the twitter stream and push it to Kafka"""

    def __init__(self, topic):
        super(StreamListener, self).__init__()
        self.topic = topic
        self.producer = Producer()
        self.producer.run(bootstrap_servers='localhost:9092')

    def on_data(self, data): 
        try:
            self.producer.send_data(self.topic, data)
            
        except KafkaError as e:
            print(e)
            return False
            
        return True


    def on_error(self, status_code):
        print('Error received in kafka producer')
        return True  # Don't kill the stream

    def on_timeout(self):
        return True  # Don't kill the stream

    
if __name__ == '__main__':
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
    )
    
    # Read the credententials from 'twitter-app-credentials.txt' file
    config = configparser.ConfigParser()
    config.read('twitter-app-credentials.txt')
    CONSUMER_KEY = config['DEFAULT']['CONSUMER_KEY']
    CONSUMER_SECRET = config['DEFAULT']['CONSUMER_SECRET']
    ACCESS_TOKEN = config['DEFAULT']['ACCESS_TOKEN']
    ACCESS_TOKEN_SECRET = config['DEFAULT']['ACCESS_TOKEN_SECRET']

    # Create Auth object
    auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    # Create stream and bind the listener to it
    stream = Stream(auth, listener=TwitterStreamListener('Test'))
    stream.filter(track=['korea'], languages = ['en'])
    
