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
    this._getTrend()
    }

    _getTrend(){
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", "Bearer " + cookie.load('access-token'));

        let urlencoded = new URLSearchParams();
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