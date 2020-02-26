import React, {Component} from 'react';
import '../../../App.css'

import withAuth from '../utils/withAuth';

import { Client } from '@stomp/stompjs';
import Sidebar from '../../nav/sideBar';

import SearchColumn from '../../column/body/SearchColumn';
import TrendColumn from '../../column/body/TrendColumn';
import HomeColumn from '../../column/body/HomeColumn';
import BtsColumn from '../../column/body/BtsColumn';


import axios from 'axios';
import cookie from 'react-cookies';


const ip = "20.41.86.4:5000";


class Main extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        search : [],
    };
}
  handleChange = (e) => {
    this.setState({
        search : [e].concat(this.state.search)
    })
    console.log('main search : ', this.state.search)
  }

  componentDidMount() {
    this.getSocketToken();        
  }

  connectSocket = (e) => {
    
    this.client = new Client();
    this.client.configure({
        // tlatldms 
        brokerURL: `ws://${ip}/wscn/websocket?username=${cookie.load('user-name')}&token=${cookie.load('socket-token')}`,
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
  // console.log('asdfasdf')

  getSocketToken = (e) => {
    axios.get(`http://${ip}/data/token/tlatldms`, {
      headers: {
        "Authorization" : "Bearer " + cookie.load('access-token')
      }
    }).then(res => {
      if (res.data.errorCode == 10) {
        cookie.save('socket-token', res.data.socketToken, { path: '/' })
        console.log('구독과 좋아요 알림설정')
        this.connectSocket();
        // this.search()
        }
    }).catch(e => {
        console.log(e);
        console.log("errrororrr");
    })  
  }

  render(){
    const ex = this.state.search.map(
      x => (<SearchColumn search={x} client={this.client} />)
    );
    return (
      <div className="app">
          <Sidebar handleChange={this.handleChange} />
          <div className="columns-box">
         
            {ex}
            <HomeColumn/>
            <TrendColumn/>
            <BtsColumn/>
          </div>
      </div>
    )
  }
}



// function Main () {
//   return (
//     <>
//       <div className="main-content mt-7">
//           <Row className="justify-content-center">
//             <p>안녕하세요 :)</p>
//           </Row>
//       </div>
//     </>
//   );
// }

export default withAuth(Main);
