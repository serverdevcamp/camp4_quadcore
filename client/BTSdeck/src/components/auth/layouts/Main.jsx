import React, {Component} from 'react';
import '../../../App.css'

import withAuth from '../utils/withAuth';

import { Client } from '@stomp/stompjs';
import Sidebar from '../../nav/sideBar';

import SearchColumn from '../../column/body/SearchColumn';
import TrendColumn from '../../column/body/TrendColumn';
import RankingColumn from '../../column/body/RankingColumn';
import BtsColumn from '../../column/body/BtsColumn';


import axios from 'axios';
import cookie from 'react-cookies';


const ip = "20.41.86.4:5000";


class Main extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        search : [],
        isCompleted : false
    };
}
  handleChange = (e) => {
    this.setState({
        search : this.state.search.concat([e])
    })
    console.log('main search : ', this.state.search)
  }

  componentDidMount() {
    this.getSocketToken();        
  }

  connectSocket = (e) => {
    this.setState( {
      cli : new Client()
    });
    //this.client = new Client();
    this.state.cli.configure({
        // tlatldms 
        brokerURL: `ws://${ip}/wscn/websocket?username=${cookie.load('user-name')}&token=${cookie.load('socket-token')}`,
        onConnect: (e) => {
          console.log("connect success! \n" + e);
          this.setState({
            isCompleted : true
          })
        },
        onDisconnect: (e) => {
          console.log("disconnected");
        },

        // Helps during debugging, remove itlatldmsn production
        debug: (str) => {
          //console.log(new Date(), str);
        }
      });
  
      this.state.cli.activate();
  }
  // console.log('asdfasdf')

  getSocketToken = (e) => {
    // axios.get(`http://${ip}/data/token/tlatldms`, {
      axios.get(`http://${ip}/data/token/${cookie.load('user-name')}`, {
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
    const t = "asdf";
    return (
      <div className="app">
          <Sidebar handleChange={this.handleChange} />
          <div className="columns-box">
         
            {this.state.search.map(
                x => {
                  console.log(x);
                  return <SearchColumn search={x} client={this.state.cli} />
                }
            )}
            <RankingColumn/>
            <TrendColumn/>
            <BtsColumn isLoaded={this.state.isCompleted} client={this.state.cli}/>
          </div>
      </div>
    )
  }
}
export default withAuth(Main);
