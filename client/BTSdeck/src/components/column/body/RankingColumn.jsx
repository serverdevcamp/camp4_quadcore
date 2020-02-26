import React, { Component } from 'react'
import '../../../App.css';

import {IoMdHome} from "react-icons/io"
import Header from '../header/Header'
import cookie from 'react-cookies';
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

import Trending from '../../tweets/Trending'

const hashtagRank = 'trend/hashtag'
const trendTweetTime = "2020/02/25/17/02"
const ip = "20.41.86.4:5000";

class RankingColumn extends Component {
    state = {
        data: [],
        items: 40,
        hasMore: true
      };

    componentDidMount(){
        this._getTrend()
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
                        // data:this.state.data.concat(dat)
                        data: [...prevState.data, dat]
                    }))
                })

                console.log("setState 값 : \n", this.state.data)

                // console.log(JSON.parse(something))
                // console.log('type : ', arr[0])
                // console.log(typeof(something));

                // arr.map((dat, index) => {
                //     console.log(dat)
                //     this.setState({
                //     //     data: this.state.data.concat(dat)
                //         data: this.state.data.dat
                //     })
                // })

                // arr.map((dat, index) => {
                //       this.setState({
                //     data: this.state.data.concat(dat)
                //   })
                // })
                console.log('setstate 완료');
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
                {ee}
                {/* <WhichTweet/> */}
          </div>
        )
    }
}
export default RankingColumn;
    
        // _getTrend(){
        //     let myHeaders = new Headers();
        //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        //     myHeaders.append("Authorization", "Bearer " + cookie.load('access-token'));
    
        //     let urlencoded = new URLSearchParams();
        //     urlencoded.append("time", trendTweetTime);
    
        //     let requestOptions = {
        //         method: 'POST',
        //         headers: myHeaders,
        //         body: urlencoded,
        //         redirect: 'follow'
        //     };
    
        //     fetch(`http://${ip}/${hashtagRank}`, requestOptions)
        //     .then(response => response.text())
        //     .then(result => {
        //         var datas = JSON.parse(JSON.parse(result).message);
        //         console.log('예은데이터 : \n ',datas)
    
        //         datas.map((dat, index) => {
        //             this.setState({
        //                     data: datas.concat(dat)
        //                 })
        //             })
        //     })
        //     .catch(error => console.log('error', error));
        // }