import React, { Component } from 'react'
import '../../../App.css';

import {IoIosRocket} from "react-icons/io"
import Header from '../header/Header'

import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'

import { Client } from '@stomp/stompjs';
import cookie from 'react-cookies';

import Tweet from '../../tweets/Tweet'


const keyword = "BTS";

//LOGOUT구현

const ip = "20.41.86.4:5000";
class BTSColumn extends Component {
    state = {
        data: [],
        pageNumber: 1,
        items: 40,
        hasMore: true
      };
      
      componentDidMount(){
        console.log("component Did mount!")
        this.getSocketToken();
        this.initCall()
        this.get20()
      }

      initCall(){
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
        axios.get(`http://${ip}/data/search/${encodeURIComponent(keyword)}/${td}/${(today.getTime())*1000}`, {
          headers: {
            "Authorization" : "Bearer " + cookie.load('access-token')
          }
        }).then(res => {
            if (res.data.errorCode === 10) {
              console.log("search zsuccess\n");
              var arr = Array.from(res.data.data);
              // console.log("arrr: ", arr);
              // console.log('#BTS');
              if (arr.length) {
                cookie.save('last-time-'+encodeURIComponent(keyword), arr[arr.length-1].timestamp);
                cookie.save('last-date-'+encodeURIComponent(keyword), arr[arr.length-1].date);
              }
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
        this.client.subscribe(`/topic/${keyword}`, message => {
          // console.log(new Date());
          var datas = JSON.parse(message.body);
          // console.log(datas);
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
        axios.get(`http://${ip}/data/search/${encodeURIComponent(keyword)}/${td}/${(today.getTime())*1000}`, {
          headers: {
            "Authorization" : "Bearer " + cookie.load('access-token')
          }
        }).then(res => {
            if (res.data.errorCode === 10) {
              console.log("search zsuccess\n");
              var arr = Array.from(res.data.data);
              // console.log("arrr: ", arr);
              // console.log('#BTS');
              if (arr.length) {
                cookie.save('last-time-'+encodeURIComponent(keyword), arr[arr.length-1].timestamp);
                cookie.save('last-date-'+encodeURIComponent(keyword), arr[arr.length-1].date);
              }
            }
        }).catch(e => {
            console.log(e);
        }) 
      }
      
      get20 = () => {
        // '#BTS' <-> this.state.sub
        if (cookie.load('last-time-'+encodeURIComponent(keyword))) {
          axios.get(`http://${ip}/data/get20/${encodeURIComponent(keyword)}/${cookie.load('last-date-'+encodeURIComponent(keyword))}/${cookie.load('last-time-'+encodeURIComponent(keyword))}`, {
            headers: {
              "Authorization" : "Bearer " + cookie.load('access-token')
            }
          }).then(res => {
              if (res.data.errorCode === 10) {
                console.log("get20 success\n");
                var arr = res.data.data;
                // console.log("arr type : \n ", arr)

                arr.map((dat, index) => {
                  this.setState({
                    data: this.state.data.concat(dat)
                  })
                })
                console.log('setstate 완료');
                if (arr.length) {
                  cookie.save('last-time-'+encodeURIComponent(keyword), arr[arr.length-1].timestamp);
                  cookie.save('last-date-'+encodeURIComponent(keyword), arr[arr.length-1].date);
                } else {
                  // alert("없음 2");
                }
               }
          }).catch(e => {
              console.log(e);
          })  
        } else {
          // alert("없음 1");
        }
      }
      // ${yunlee}
      connectSocket = (e) => {
    
        this.client = new Client();
        this.client.configure({
            // tlatldms 
            brokerURL: `ws://${ip}/wscn/websocket?username=${cookie.load('user-name')}&token=${cookie.load('socket-token')}`,
            onConnect: (e) => {
              console.log("connect success! \n" + e);
              this.search()
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

    render() {// dat.text, user.name
      const ee = this.state.data.map(
        (dat, index) => {
          var user = JSON.parse(dat.user);
          return <div>
              <Tweet rcvData={dat} />
            </div>
        });

        return (
        <div className="content">
            <div className="column-header">
            {/* <input onChange={this.handleChange} name="sub"/> */}
            {/* <button onClick={()=>this.get20(keyword)}>과거20개</button> */}
                <IoIosRocket size="30" color="#38444d"/>
                <Header name="BTS"/>
            </div>
        <InfiniteScroll
          dataLength={this.state.data.length}
          // next={this.fetchData} // fetchData를 이용하여 사용자가 맨 밑의 페이지에 도달했을 때 데이터를 더 가져옴
          next={()=>this.get20()}
          hasMore={this.state.hasMore} // boolean 형식
          height={950}
          //loader : 로딩 스피너! API요청이 아직 처리중일 때 렌더링 
          loader={<h4>Loading...</h4>}> 
          {ee}          
        </InfiniteScroll>
        {/* {ee} */}
        
        {/* <Tweet rcvData={this.state.data}/> */}
        </div>
        )
      }
    }
    export default BTSColumn;

                      {/* {this.state.datas.map(brewery => (
                        <ul className="user" key={brewery.name}>
                          <li>Name: {brewery.name}</li>
                        </ul>
                      ))} */}