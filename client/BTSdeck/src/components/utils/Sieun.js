import React from 'react';
// https://github.com/stomp-js/stomp-websocket
//import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import cookie from 'react-cookies';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + cookie.load('access-token')
};

class SampleComponent extends React.Component {
  constructor(props) {
    super(props);

    this.randomUserName ="ASdgsdf";
    this.randomUserId = "Sdgsdfdsf";
    this.sendURL = "/message";

    this.state = {
        clientConnected : false,
        messages : [],
        test:'',
        serverTime: null,
        data: []
    };
}

  onMessageReceive = (msg, topic) => {
    this.setState(prevState => ({
      messages: [...prevState.messages, msg]
    }));
  }

  sendMessage = () => {
      try {
        this.clientRef.sendMessage('/topics/message', this.state.test);
      } catch (e) {
          console.log(e);
      }
  }

  handleChange = (e) => {
    this.setState({
        [e.target.name] : e.target.value,
    })
  }
  
  componentDidMount() {
    this.client = new Client();

    this.client.configure({
        brokerURL: 'ws://20.41.86.4:8888/wscn/websocket',
        // end point
        // 중간에서 메세지 관리
        // 내가 Routing 하면될듯
        onConnect: () => {
          // 첫 커넥션 성립 후 

          console.log('onConnect');
          // topic/message => message에 검색어가 위치해야함
          this.client.subscribe('/topic/message', message => {
            // subscribe 후
            var datas = JSON.parse(message.body);
            console.log(datas);
        
              this.setState({
                data: datas.concat(this.state.data)
              });
              console.log("state: ");
              // this.state.data.forEach(x => console.log(x));
          });
  
        },
        beforeConnect: () => {
          // connection 하기 전에 
          // 클라이언트에서 실행되는거
          console.log("beforeConnect");
        },
        // Helps during debugging, remove in production
        debug: (str) => {
          console.log(new Date(), str);
          
        }
      });
      this.client.activate();
      
      /*
          let stompClient = this.client.over(socket);
                stompClient.connect({}, function(frame) {
                    console.log("소켓 연결 성공", frame);
                })
                stompClient.subscribe("/topic/message", function (res) {
                    console.log(res);
                })
      
                */
    }

 
  render() {         
    const ee = this.state.data.map(
      (dat, index) => {
              return <div>{dat.test1} <br/></div>
      });
    return (
      <div>
        {ee}
        </div>
    );
  }
}

export default SampleComponent;