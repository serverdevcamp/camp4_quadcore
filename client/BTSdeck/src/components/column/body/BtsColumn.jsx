import React, { Component } from 'react'
import '../../../App.css';

import {IoIosRocket} from "react-icons/io"
import Header from '../header/Header'

import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import ICON from '../../../assets/img/bts.png';

import cookie from 'react-cookies';

import Tweet from '../../tweets/Tweet'

//LOGOUT구현

const ip = "20.41.86.4:5000";
class BTSColumn extends Component {
    state = {
        data: [],
        pageNumber: 1,
        items: 40,
        hasMore: true,
        lt: '',
        ld: ''
      };
      
      componentDidMount(){
        console.log("component Did mount!")
        
      }
      shouldComponentUpdate(nextProps, nextState) {
       
        if (nextProps.isLoaded !== this.props.isLoaded) {
          console.log("shibalbhasidflksdnfkdsfs " + nextProps.client);
          this.search(nextProps.client);
          return true;
        }
      
        return true;
      }



      search = (c) => {
        console.log("client:" +c);
        
        c.subscribe('/topic/bts', message => {
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
        axios.get(`http://${ip}/data/pastbts/${td}/${(today.getTime())*1000}`, {
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
                  ld: arr[arr.length-1].date
                })
              }
            }
        }).catch(e => {
            console.log(e);
        }) 

        
      }
      
      get20 = () => {
    
        axios.get(`http://${ip}/data/pastbts/${this.state.ld}/${this.state.lt}`, {
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
                  this.setState({
                    lt: arr[arr.length-1].timestamp,
                    ld: arr[arr.length-1].date
                  })
                  console.log('lt : ',this.state.lt)
                  console.log('ld :' , this.state.ld)

                } 
                else {
                }
               }
          }).catch(e => {
              console.log(e);
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
                <img className="icoico" src={ICON}/>
                <Header name="BTS"/>
            </div>
        <InfiniteScroll
          dataLength={this.state.data.length}
          next={()=>this.get20()}
          hasMore={this.state.hasMore} // boolean 형식
          height={950}
          loader={<h4>Loading...</h4>}> 
          {ee}          
        </InfiniteScroll>
        </div>
        )
      }
    }
    export default BTSColumn;