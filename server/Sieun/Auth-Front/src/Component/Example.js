import React from 'react';
import axios from 'axios';
//import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import cookie from 'react-cookies';
const headers = {
    'Authorization': "Bearer " + cookie.load('access-token')
};
const ip="localhost:5000";
//const ip = "20.41.86.4:8888";
class SampleComponent extends React.Component {
  constructor(props) {
    super(props);
    
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
      entities:[this.state.entities, this.state.test2],
      test2:this.state.test2
    },{
      headers: {
        "Authorization" : "Bearer " + cookie.load('access-token')
      }
    }).then(res => {
        if (res.data.errorCode == 10) {
          console.log("search success\n");
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
      console.log(new Date());
      var datas = JSON.parse(message.body);
      console.log(datas);
      this.setState({
        data: datas.concat(this.state.data)
      });
    });
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    var td = yyyy+'-'+mm+'-'+dd;
    console.log(td);
    console.log(encodeURIComponent(this.state.sub));
    axios.get(`http://${ip}/data/search/${encodeURIComponent(this.state.sub)}/${td}/${(today.getTime())*1000}`, {
      headers: {
        "Authorization" : "Bearer " + cookie.load('access-token')
      }
    }).then(res => {
        if (res.data.errorCode == 10) {
          console.log("search zsuccess\n");
          var arr = Array.from(res.data.data);
          console.log("arrr: ", arr);
          console.log(this.state.sub);
          if (arr.length) {
            cookie.save('last-time-'+encodeURIComponent(this.state.sub), arr[arr.length-1].timestamp);
            cookie.save('last-date-'+encodeURIComponent(this.state.sub), arr[arr.length-1].date);
          }
         
        }
    }).catch(e => {
        console.log(e);
    }) 
  }


  get20=(keyword)=> {
    if (cookie.load('last-time-'+encodeURIComponent(this.state.sub))) {
      axios.get(`http://${ip}/data/get20/${encodeURIComponent(keyword)}/${cookie.load('last-date-'+encodeURIComponent(this.state.sub))}/${cookie.load('last-time-'+encodeURIComponent(this.state.sub))}`, {
        headers: {
          "Authorization" : "Bearer " + cookie.load('access-token')
        }
      }).then(res => {
          if (res.data.errorCode == 10) {
            console.log("get20 success\n");
            var arr = res.data.data;
            console.log(arr);
            if (arr.length) {
              cookie.save('last-time-'+encodeURIComponent(this.state.sub), arr[arr.length-1].timestamp);
              cookie.save('last-date-'+encodeURIComponent(this.state.sub), arr[arr.length-1].date);
            } else {
              alert("없음");
            }
           }
      }).catch(e => {
          console.log(e);
      })  
    } else {
      alert("없음");
    }
  }

  

  connectSocket = (e) => {

    this.client = new Client();
    this.client.configure({
        
        brokerURL: `ws://${ip}/wscn/websocket?username=tlatldms&token=${cookie.load('socket-token')}`,
        onConnect: (e) => {
          console.log("connect success! \n" + e);
     
        },
        onDisconnect: (e) => {
          console.log("disconnected");
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
        var user = JSON.parse(dat.user);
        return <div><br/>user: {user.name} <br/> text: {dat.text} <br /> time: {dat.timestamp}<br/></div>
      });

        
    return (
      <div>
        
        <input onChange={this.handleChange} name="sub"/>
        <button onClick={this.search}>구독 테스트</button>
        <button onClick={()=>this.get20(this.state.sub)}>과거20개</button>
        <br/>
        <h5>*USAGE: socket CONNECT는 자동으로 합니다. 이 위의 입력 창에 구독할 keyword를 쓰고 구독 테스트 버튼을 누르면 구독 시작입니다. 새로고침시 사라지며 현재 구독 취소는 없습니다. 
          <br />
          http://20.41.86.4:8080/data/add  로
          access token을 header에 붙이고
          json body에
          "test1": "어쩌구", "entities": **KEYWORD**, "test2":"저쩌구" 붙이고
          POST 요청을 보내주세욤. <br />
          아니면 성공적으로 로그인 한 상태로 KEYWORDINPUT에 entities에 들어가는 keyword를 쓰고, 아무INPUT에 아무말이나 쓰고 데이터추가 버튼을 눌러주세욤.

          
          </h5>
          <input onChange={this.handleChange} name="entities" placeholder="KEYWORDINPUT"/>
          <input onChange={this.handleChange} name="test2" placeholder="아무INPUT"/>
          <button onClick={this.addData}>데이터 추가</button>
        {ee}
        </div>
    );
  }
}

export default SampleComponent;