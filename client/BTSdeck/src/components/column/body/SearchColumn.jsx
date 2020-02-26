import React, { Component } from 'react'
import '../../../App.css';

import {IoIosSearch} from "react-icons/io"
import Header from '../header/Header'

import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'

import cookie from 'react-cookies';

import Tweet from '../../tweets/Tweet'
const ip = "20.41.86.4:5000";

class SearchColumn extends Component {
    state = {
        datas: [],
        search: '',
        pageNumber: 1,
        items: 40,
        hasMore: true
      };

      shouldComponentUpdate(nextProps, nextState) {
        // 수정 상태가 아니고, info 값이 같다면 리렌더링 안함
        console.log("nextProps : " + nextProps.search + ", props: " + this.props.search);
        if (nextProps.search === this.props.search) {
          return false;
        }
        // 나머지 경우엔 리렌더링함
        return true;
      }
      componentDidMount(){
        // this.fetchData()
        // 주류
        console.log("CLLLIIEENTT: " + this.props.client);
       console.log("sssseeeeaarrrccchhhh: " + this.props.search);
        this.search()
        this.initCall()
        this.get20()
      }
// {this.props.search}
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
        axios.get(`http://${ip}/data/search/${encodeURIComponent(this.props.search)}/${td}/${(today.getTime())*1000}`, {
          headers: {
            "Authorization" : "Bearer " + cookie.load('access-token')
          }
        }).then(res => {
            if (res.data.errorCode === 10) {
              console.log("search zsuccess\n");
              var arr = Array.from(res.data.data);
              if (arr.length) {
                cookie.save('last-time-'+encodeURIComponent(this.props.search), arr[arr.length-1].timestamp);
                cookie.save('last-date-'+encodeURIComponent(this.props.search), arr[arr.length-1].date);
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
        this.props.client.subscribe(`/topic/${this.props.search}`, message => {
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
        axios.get(`http://${ip}/data/search/${encodeURIComponent(this.props.search)}/${td}/${(today.getTime())*1000}`, {
          headers: {
            "Authorization" : "Bearer " + cookie.load('access-token')
          }
        }).then(res => {
            if (res.data.errorCode === 10) {
              console.log("search zsuccess\n");
              var arr = Array.from(res.data.data);
              if (arr.length) {
                cookie.save('last-time-'+encodeURIComponent(this.props.search), arr[arr.length-1].timestamp);
                cookie.save('last-date-'+encodeURIComponent(this.props.search), arr[arr.length-1].date);
              }
            }
        }).catch(e => {
            console.log(e);
        }) 
      }
      
      get20 = () => {
        // '#BTS' <-> this.state.sub
        if (cookie.load('last-time-'+encodeURIComponent(this.props.search))) {
          axios.get(`http://${ip}/data/get20/${encodeURIComponent(this.props.search)}/${cookie.load('last-date-'+encodeURIComponent(this.props.search))}/${cookie.load('last-time-'+encodeURIComponent(this.props.search))}`, {
            headers: {
              "Authorization" : "Bearer " + cookie.load('access-token')
            }
          }).then(res => {
              if (res.data.errorCode === 10) {
                console.log("get20 success\n");
                var arr = res.data.data;

                arr.map((dat, index) => {
                  this.setState({
                    data: this.state.data.concat(dat)
                  })
                })
                console.log('setstate 완료');
                if (arr.length) {
                  cookie.save('last-time-'+encodeURIComponent(this.props.search), arr[arr.length-1].timestamp);
                  cookie.save('last-date-'+encodeURIComponent(this.props.search), arr[arr.length-1].date);
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
      
    render() {
      // const ee = this.state.data.length === 0 ? 
      //   console.log('data is empty') : this.state.datas.map(
      //     (dat, index) => {
      //       var user = JSON.parse(dat.user);
      //       return <div>
      //           <Tweet rcvData={dat} />
      //         </div>
      //     });
      const ee = this.state.datas.map((dat, index) => {
        var user = JSON.parse(dat.user);
        return <div>
          <Tweet rcvData={dat}/>
        </div>
      })
      
          return (
        <div className="content">
            <div className="column-header">
                <IoIosSearch size="30" color="#38444d"/>
                <Header name={this.props.search}/>
            </div>
        <InfiniteScroll
          dataLength={this.state.datas.length}
          next={()=>this.get20()} // fetchData를 이용하여 사용자가 맨 밑의 페이지에 도달했을 때 데이터를 더 가져옴
          hasMore={this.state.hasMore} // boolean 형식
          height={950}
          loader={<h4>Loading...</h4>}> 
          {/* {console.log('search 에서 받음 : ', this.props.search)} */}
          {ee} 
          {console.log('state 길이 : ', this.state.datas.length)}
        </InfiniteScroll>
        </div>
        )
    }
}
export default SearchColumn;