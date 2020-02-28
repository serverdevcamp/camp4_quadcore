import React, { Component } from 'react'
import '../../../App.css';

import {IoIosSunny} from "react-icons/io"
import Header from '../header/Header'

import InfiniteScroll from 'react-infinite-scroll-component'

import cookie from 'react-cookies';

import Tweet from '../../tweets/Tweet'

const ip = "20.41.86.4:5000";
// 해시 태그 순위
const tweetRank = 'trend/tweet'

const trendTweetTime = "2020/02/25/17/02"

class TrendColumn extends Component {
    state = {
        data: [],
        items: 40,
        hasMore: true
      };

    componentDidMount(){
    // ?? 
        this.interval = setInterval(() => {
            this._getTrend();
        }, 10000);
            
    }
    componentWillMount(){
        clearInterval(this.interval);
    }

    _getTrend(){
        let myHeaders = new Headers();

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
        
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", "Bearer " + cookie.load('access-token'));

        let urlencoded = new URLSearchParams();
        // urlencoded.append("time", `${td}/${(today.getTime())*1000}`)
        urlencoded.append("time", trendTweetTime);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://${ip}/${tweetRank}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            var datas = JSON.parse(JSON.parse(result).message);
            // console.log('예은데이터 : \n ',datas)
            // console.log('cookie is : \n', cookie.load('access-token'))
            this.setState({
                data: []
            })

            datas.map((dat, index) => {
                this.setState({
                        data: datas.concat(dat)
                    })
                })
        })
        .catch(error => console.log('error', error));
    }

    render() {
        const ee = this.state.data.map(
            (dat, index) => {
              var user = JSON.parse(dat);
              return <div>
                  <Tweet rcvData={user} />
                </div>
            });
        return (
        <div className="content">
            <div className="column-header">
                <IoIosSunny size="30" color="#38444d"/>
                <Header name="Tweet-Ranking"/>
            </div>
         <InfiniteScroll
          dataLength={this.state.data.length}
          hasMore={this.state.hasMore} // boolean 형식
          height={950}
        //   loader={<h4>Loading...</h4>}
          > 
          {ee}          
        </InfiniteScroll>
          </div>
        )
    }
}
export default TrendColumn;