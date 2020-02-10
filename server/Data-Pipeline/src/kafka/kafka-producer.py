# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

import threading, logging, time
import json

from tweepy import OAuthHandler, Stream, StreamListener, API
from kafka import KafkaProducer
from kafka.errors import KafkaError

ACCESS_TOKEN = "1034988817000759296-FhfFLcBvDtCAohQ3BtOzmvMWjYb4Cp"
ACCESS_TOKEN_SECRET = "hPacykK3XS73NIV1i4zuBtmryvf94xLUp3RJxBBMPddho"
CONSUMER_KEY = "xeAeYhXLSLlqZG9YAbRcI9mAP"
CONSUMER_SECRET = "bQRUB06L70hEHNkU42ws02SHZdmQnlADgIRAENHM82wj7zkeGm"

class Producer():
    def __init__(self):
        print("Kafka Producer Object Create")
        
    def stop(self):
        self.producer.close()

    def run(self, bootstrap_servers):
        print("Creating kafka producer")
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=bootstrap_servers,
                max_block_ms=10000,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
        except KafkaError as exc:
            print("kafka producer - Exception during connecting to broker - {}".format(exc))
            return False
            
        
    def send_data(self, topic, data):
        # Asynchronous by default
        future = self.producer.send(topic, data).add_callback(self.on_send_success).add_errback(self.on_send_error)

        # Block for 'synchronous' sends
        try:
            record_metadata = future.get(timeout=1)
        except KafkaError as e:
            # Decide what to do if produce request failed...
            log.exception()
            return e
        
        # block until all async messages are sent
        self.producer.flush()
    
    def on_send_success(self, record_metadata):
        print("*****Send Success******")
        print(record_metadata.topic)
        print(record_metadata.partition)
        print(record_metadata.offset)

    def on_send_error(self, excp):
        print("*****Send Error Occur******")
        log.error('I am an errback', exc_info=excp)
        # handle exception
        
class TwitterStreamListener(StreamListener):
    """ A class to read the twitter stream and push it to Kafka"""

    def __init__(self):
        super(StreamListener, self).__init__()
        self.producer = Producer()
        self.producer.run(bootstrap_servers='localhost:9092')

    def on_data(self, raw_data):
        try:
            self.producer.send_data('test', raw_data)
            
        except KafkaError as e:
            print(e)
            return False
            
        return True


    def on_error(self, status_code):
        print("Error received in kafka producer")
        return True  # Don't kill the stream

    def on_timeout(self):
        return True  # Don't kill the stream

    
if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
    )

    # Create Auth object
    auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    # Create stream and bind the listener to it
    stream = Stream(auth, listener=TwitterStreamListener())
    stream.filter(track=['python'], languages = ['en'])
    
