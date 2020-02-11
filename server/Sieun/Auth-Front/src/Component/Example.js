import React from 'react';

//import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import cookie from 'react-cookies';
const headers = {
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
    //alert(JSON.stringify(msg) + " @ " +  JSON.stringify(this.state.messages)+" @ " + JSON.stringify(topic));
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
    //let socket = new SockJS('http://localhost:8089/ws');

    this.client.configure({
        
        brokerURL: 'ws://localhost:8089/wscn/websocket',
        onConnect: () => {
          console.log(new Date());
          this.client.subscribe('/topic/message', message => {
            var datas = JSON.parse(message.body);
              this.setState({
                data: datas.concat(this.state.data)
              });
          });
  
        },

        connectHeaders : headers,
        // Helps during debugging, remove in production
        debug: (str) => {
          //console.log(new Date(), str);
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
              return <div>
              {dat.test1} <br />
              {dat.test2} < br/>
              {dat.test3}
              </div>
      });

        
    return (
      <div>
        {ee}
        </div>
    );
  }
}

export default SampleComponent;