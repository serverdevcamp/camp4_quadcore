### Requirement.txt
- tweepy 설치 시 알아서 설치되는 패키지
    - certifi==2019.11.28
    - chardet==3.0.4
    - idna==2.8
    - oauthlib==3.1.0
    - PySocks==1.7.1
    - requests==2.22.0
    - requests-oauthlib==1.3.0
    - six==1.14.0
    - urllib3==1.25.8


### Reference
- [LINK1](https://github.com/adrianva/twitter-topics)
- [LINK2](https://github.com/sridharswamy/Twitter-Sentiment-Analysis-Using-Spark-Streaming-And-Kafka)


[Unit]
Description=Jupyter Notebook Server

[Service]
Type=simple
PIDFile=/run/jupyter.pid
User=<username>
ExecStart=/home/<username>/.local/bin/jupyter-notebook
WorkingDirectory=/your/working/dir

[Install]
WantedBy=multi-user.target


