import React from 'react';

//import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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
        brokerURL: 'ws://localhost:8089/ws/websocket',
        onConnect: () => {
          console.log('onConnect');
  
          this.client.subscribe('/topic/message', message => {
            console.log(message.body);
            this.setState({serverTime: message.body});
          });
  
          this.client.subscribe('/topic/greetings', message => {
            alert(message.body);
          });
        },
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

        
    return (
      <div>
             {/*
        <SockJsClient url='http://localhost:8089/ws-stomp'
            topics={['/topic/message']}
            onMessage={(msg) => { console.log(msg); }}
            ref={ (client) => { this.clientRef = client }}
            onConnect={console.log("Connection established!")} 
            onDisconnect={console.log("Disconnected!")}
            style={[{width:'100%', height:'100%'}]}
            />
         
        <input name="test" value={this.state.test} onChange={this.handleChange} />
        <button onClick={this.sendMessage}>보내기</button>
            */}
      
        </div>
    );
  }
}

export default SampleComponent;