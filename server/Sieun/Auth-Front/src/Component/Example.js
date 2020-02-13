import React from 'react';
import axios from 'axios';
//import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import cookie from 'react-cookies';
const headers = {
    'Authorization': "Bearer " + cookie.load('access-token')
};
const ip="localhost:8080";
//const ip = "20.41.86.4:8080";
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

  addData=()=> {
    axios.post(`http://${ip}/data/add`, {
      test2:this.state.test2,
      test3:this.state.test3
    },{
      headers: {
        "Authorization" : "Bearer " + cookie.load('access-token')
      }
    }).then(res => {
        if (res.data.errorCode == 10) {
          console.log("search zsuccess\n");
        }
    }).catch(e => {
        console.log(e);
    }) 
  }

  handleChange = (e) => {
    this.setState({
        [e.target.name] : e.target.value,
    })
  }

  search = () => {
    this.client.subscribe(`/topic/${this.state.sub}`, message => {
      console.log(message.body);   
      var datas = JSON.parse(message.body);
      this.setState({
        data: datas.concat(this.state.data)
      });

    });

    axios.get(`http://${ip}/data/search/${this.state.sub}`, {
      headers: {
        "Authorization" : "Bearer " + cookie.load('access-token')
      }
    }).then(res => {
        if (res.data.errorCode == 10) {
          console.log("search zsuccess\n");
        }
    }).catch(e => {
        console.log(e);
    }) 
  }
  connectSocket = (e) => {

    this.client = new Client();
    this.client.configure({
        
        brokerURL: `ws://${ip}/wscn/websocket?username=tlatldms&token=${cookie.load('socket-token')}`,
        onConnect: (e) => {
          console.log("connect success! \n" + e);
     
        },

        // Helps during debugging, remove in production
        debug: (str) => {
          console.log(new Date(), str);
        }
      });
  
      this.client.activate();
  }

  getSocketToken = (e) => {
    axios.get(`http://${ip}/data/token/tlatldms`, {
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
        console.log("errrororrr");
    })  
  }

  componentDidMount() {
    this.getSocketToken();
  }

 
  render() {
                
    const ee = this.state.data.map(
      (dat, index) => {
        return <div>{dat.test2} {dat.test3}</div>
      });

        
    return (
      <div>
        
        <input onChange={this.handleChange} name="sub"/>
        <button onClick={this.search}>구독 테스트</button>
        <br/>
        <h5>*USAGE: socket CONNECT는 자동으로 합니다. 이 위의 입력 창에 구독할 keyword를 쓰고 구독 테스트 버튼을 누르면 구독 시작입니다. 새로고침시 사라지며 현재 구독 취소는 없습니다. 
          <br />
          http://20.41.86.4:8080/data/add  로
          access token을 header에 붙이고
          json body에
          "test1": "어쩌구", "test2": **KEYWORD**, "test3":"저쩌구" 붙이고
          POST 요청을 보내주세욤. <br />
          아니면 성공적으로 로그인 한 상태로 KEYWORDINPUT1에 test2에 들어가는 keyword를 쓰고, 아무INPUT에 아무말이나 쓰고 데이터추가 버튼을 눌러주세욤.

          
          </h5>
          <input onChange={this.handleChange} name="test2" placeholder="KEYWORDINPUT"/>
          <input onChange={this.handleChange} name="test3" placeholder="아무INPUT"/>
          <button onClick={this.addData}>데이터 추가</button>
        {ee}
        </div>
    );
  }
}

export default SampleComponent;