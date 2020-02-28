import React, { Component } from 'react'
import '../../../App.css';

import {IoMdHome} from "react-icons/io";
import Header from '../header/Header';
import cookie from 'react-cookies';
import axios from 'axios'; 
import InfiniteScroll from 'react-infinite-scroll-component';

import Trending from '../../tweets/Trending'

const hashtagRank = 'trend/hashtag'
const trendTweetTime = "2020/02/25/17/02"
const ip = "20.41.86.4:5000";

class RankingColumn extends Component {
    state = {
        data: [],
        items: 40,
        hasMore: true,
        // idxs : 1
      };

    componentDidMount(){
        this._getTrend();
        this.interval = setInterval(() => {
            this.setState({
                data: []
            })
            this._getTrend();
            // this._test()
        }, 10000);
        
        // console.log("idxs : ", this.state.idxs)
        // this._getTrend()
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _test = () => {
        console.log("data request!!!!!")
    }
    
    
    _getTrend = () => {
        axios.get(`http://${ip}/${hashtagRank}`, {
            headers: {
              "Authorization" : "Bearer " + cookie.load('access-token')
            }
        }).then(res => {
            console.log('trend : \n',res.data.message)
                if (res.data.errorCode === 10) {
                console.log("trend success \n");
                let something = JSON.parse(res.data.message)
                console.log(something)

                something.map((dat, index) => {
                    console.log(dat)
                    this.setState(prevState => ({
                        data: [...prevState.data, dat]
                    }))
                })

                // console.log("setState 값 : \n", this.state.data)

                // console.log('setstate 완료');
               }
          }).catch(e => {
              console.log(e);
          })  
        }

        render() {
        const ee = this.state.data.map(
            (dat, index) => {
        //       var user = JSON.parse(dat.user);
              return <div>
                  {/* {dat} */}
               <Trending tag={dat[0]} count={dat[1]} idx={index} /> 
                </div>
            });
        return (
            <div className="content">
            <div className="column-header">
                <IoMdHome size="30" color="#38444d"/>
                <Header name="Trending"/>
                </div>
                <InfiniteScroll
          dataLength={this.state.data.length}
          height={950}
          loader={<h4>Loading...</h4>}> 
          {ee} 
        </InfiniteScroll>
          </div>
        )
    }
}
export default RankingColumn;