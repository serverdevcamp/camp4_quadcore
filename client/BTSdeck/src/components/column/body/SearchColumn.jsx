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
        data: [],
        search: '',
        pageNumber: 1,
        items: 40,
        hasMore: true,
        lt: '',
        ld: ''
      };

      componentDidMount(){
          this.search()
      }

      search = (c) => {
        console.log(" IN search CLIENT :" + this.props.client);
        this.props.client.subscribe(`/topic/${this.props.search}`, message => {
          var datas = JSON.parse(message.body);
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
                this.setState({
                  lt: arr[arr.length-1].timestamp,
                  ld: arr[arr.length-1].date,
                  data: this.state.data.concat(arr)
                })
              }
            }
        }).catch(e => {
            console.log(e);
        }) 
      }

      get20 = () => {
        axios.get(`http://${ip}/data/past/${this.props.search}/${this.state.ld}/${this.state.lt}`, {
            headers: {
              "Authorization" : "Bearer " + cookie.load('access-token')
            }
          }).then(res => {
              if (res.data.errorCode === 10) {
                console.log("get20 success\n");
                var arr = res.data.data;

                this.setState({
                  data: this.state.data.concat(arr)
                });

                if (arr.length) {
                  this.setState({
                    lt: arr[arr.length-1].timestamp,
                    ld: arr[arr.length-1].date
                  })
                  console.log('lt : ',this.state.lt)
                  console.log('ld :' , this.state.ld)
                } 
                else {
                  // alert("없음 2");
                }
               }
          }).catch(e => {
              console.log(e);
          })  
       
      }

    render(){
      const ee = this.state.data.map((dat, index) => {
        var user = JSON.parse(dat.user);
        return <div>
          {console.log(dat)}
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
          dataLength={this.state.data.length}
          next={()=>this.get20()} // fetchData를 이용하여 사용자가 맨 밑의 페이지에 도달했을 때 데이터를 더 가져옴
          hasMore={this.state.hasMore} // boolean 형식
          height={950}
          loader={<h4>Loading...</h4>}> 
          {ee} 
        </InfiniteScroll>
        </div>
        )
    }
}

export default SearchColumn;