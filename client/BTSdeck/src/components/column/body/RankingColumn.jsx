import React, { Component } from 'react'
import '../../../App.css';

import Header from '../header/Header';
import cookie from 'react-cookies';
import axios from 'axios'; 
import InfiniteScroll from 'react-infinite-scroll-component';

import Trending from '../../tweets/Trending';
import ICON from '../../../assets/img/graph.png';
const hashtagRank = 'trend/hashtag'

const ip = "20.41.86.4:5000";

class RankingColumn extends Component {
    state = {
        data: [],
        items: 40,
        hasMore: true,
      };

    componentDidMount(){
        this._getTrend();
        this.interval = setInterval(() => {
            this.setState({
                data: []
            })
            this._getTrend();
        }, 10000);
        
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
                console.log("something" + something)

                something.map((dat, index) => {
                    console.log(dat)
                    this.setState(prevState => ({
                        data: [...prevState.data, dat]
                    }))
                })

               }
          }).catch(e => {
              console.log(e);
          })  
        }

        render() {
        const ee = this.state.data.map(
            (dat, index) => {
              return <div>
               <Trending handleChange={this.props.handleChange} tag={dat[0]} count={dat[1]} idx={index} /> 
                </div>
            });
        return (
            <div className="content">
            <div className="column-header">
                <img className="icoico" src={ICON}/>
                <Header name="HASHTAG"/>
               
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