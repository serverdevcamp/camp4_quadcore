import React from 'react';
import axios from 'axios';
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
      accessToken: cookie.load('access-token'),
      refreshToken: cookie.load('refresh-token'),
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

  connectSocket = (e) => {

    this.client = new Client();
    this.client.configure({
        
        brokerURL: `ws://localhost:8888/wscn/websocket?username=tlatldms&token=${cookie.load('socket-token')}`,
        onConnect: (e) => {
          console.log(e);
          this.client.subscribe('/topic/message', message => {
            var datas = JSON.parse(message.body);
            //console.log(message);
              this.setState({
                data: datas.concat(this.state.data)
              });
          }, {test:" this is t e s t"});
         
        },

        connectHeaders : headers,
        // Helps during debugging, remove in production
        debug: (str) => {
          //console.log(new Date(), str);
        }
      });
  
      this.client.activate();
  }

  getSocketToken = (e) => {
    axios.get("http://localhost:8888/data/token/tlatldms", {
      headers: {
        "Authorization" : "Bearer " + cookie.load('access-token')
      }
    }).then(res => {
        if (res.data.errorCode == 10) {
          cookie.save('socket-token', res.data.socketToken, { path: '/' })
          this.connectSocket();
        }
    }).catch(e => {
        console.log(e);
    })  
  }

  componentDidMount() {
    this.getSocketToken();
  }

 
  render() {
                
    const ee = this.state.data.map(
      (dat, index) => {
        var tt = JSON.parse(dat.test1);      
        return <div key={index}>
          {tt.user.name}
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