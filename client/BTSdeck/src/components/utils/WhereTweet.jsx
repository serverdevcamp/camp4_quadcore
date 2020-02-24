import React, { Component } from 'react';

import Retweet from '../tweets/Retweet';
import Tweet from '../tweets/Tweet';
import Quoted from '../tweets/Quoted'

import TweetTest from '../tweets/TweetTest'

import { Client } from '@stomp/stompjs';

// /console.log('현재 스테이트 : '+ this.state.data[0].test1);

// test1 => ~~
export default class WhereTweet extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages : [],
            data: [],
            items: []
            // data string type으로 저장되니
            // 렌더링전 파싱 필수
            // let data_s = JSON.parse(this.state.data[0].test1)
            // data_s.create~ 이렇게 넘겨주면 될듯! 
        //   isRetweet: false,
        //   author_tweet_author: '',
        //   author_tweet_text: '',
        //   author_tweet_Id : '',
        //   author_profile_image : '',
        //   author_truncated : '',
          
        //   quoted_tweet_author : '',
        //   quoted_tweet_text : '',
        //   quoted_tweet_id : '',
        //   quoted_profile_image : '',
        //   quoted_truncated : '',       
        }
    }

    componentDidMount(){
        this.client = new Client();
        console.log('hihi');
        this.client.configure({
            //http://20.41.86.4:8080/data/add
            // brokerURL: 'ws://20.41.86.4:8888/wscn/websocket',
            // brokerURL: 'ws://20.41.86.4:8080/wscn/websocket',
            brokerURL: `ws://20.41.86.4:8080/wscn/websocket?username=tlatldms&token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aWt4OTMwMzMwIiwicm9sZSI6WyJST0xFX0hJIiwiUk9MRV9VU0VSIl0sImV4cCI6MTU4MTc3MjI3NCwiaWF0IjoxNTgxNzcxMzc0fQ.6xr29e7Zt6kqGwVXw3qbq8Ls8KiYYAYHWHNZIyavxQ81ri1LLM4TGaj6dEJ-_WJbL0t_qKI0pzFeEjb2jVb5ow}`,
            // end point
            // 중간에서 메세지 관리
            // 내가 Routing 하면될듯
            onConnect: () => {
            // 첫 커넥션 성립 후 
                console.log('onConnect');
                // topic/message => message에 검색어가 위치해야함
                this.client.subscribe('/topic/message', message => {
                    // /topic/search 
                    // /topic/bts
                    // /topic/home
                    // trending  // axios
                    // let datas = JSON.parse(message.body);
                    // console.log(datas);
                    // this.setState({
                    //     data: datas.concat(this.state.data)
                    // });
                    let newList = [message.body].concat(this.state.items.slice(0, 15));
                    this.setState({ items: newList });
                    console.log('newlist \n',newList);
                    // this.setState({
                    //     data: datas
                    // })
                    // console.log("setState after : ", JSON.parse(this.state.data[0].test1));


                    // console.log('datas :'+ typeof(datas));

                    // let stateData = this.state.data.map(
                    //     (dat, index) => {
                    //         let tt = JSON.parse(dat.test1);
                    //         // console.log('데이터 \n', tt);
                    //     }
                    // )
                    

                    
                    // for(let i = 0; i < this.state.data.length; i++){
                    //     console.log(JSON.parse(this.state.data[i].test1));
                    // }
                    // if (this.state.data.length === 10){
                    //     return console.log("length 10 ")
                    // }
                    // console.log(this.state.data[1]);
                    // console.log(this.state.map((x, i) => x[i]));
                    // for(let i in)
                    // console.log(JSON.parse(this.state.data[].test1))
                    // this.state.data.map((x, i) => {console.log(JSON.parse(this.state.data[i].test1))})
                    // let data_s = JSON.parse(this.state.data[0].test1)

                    // console.log("data_s :" + data_s.created_at)

                });
            },
            beforeConnect: () => {
            // connection 하기 전에 
            // 클라이언트에서 실행되는거
            console.log("beforeConnect");
            },
            // Helps during debugging, remove in production
            debug: (str) => {
            // console.log(new Date(), str);
                }
        });

        this.client.activate();
        // console.log('현재 스테이트 : '+ this.state);
            // this._getList();
        }

    _stateObjectValue = (data) => {
        console.log(this.state);
    }
    
    // Tweet Type
    _isRetweeted = (data) => {
        if (data.retweeted === true){
            return true;
        }
        return false;
    }
    
    _isTruncated = (data) => {
        if (data.truncated === true){
            return true;
        }
        return false;
    }
    
    _isQuoted = (data) => {
        if (data.is_quoted_status === true){
            return true;
        }
        return false;
    }
    
    _isType = (data) =>{
        return typeof(data);
    }


    render() {
        let items = this.state.items;

        let itemsCards = items.map((x, i) =>
          <TweetTest key={i} data={x} />
        )
      
        // let stateData = this.state.data.map(
        //     (dat, index) => {
        //         let tt = JSON.parse(dat.test1);
        //         // console.log('데이터 \n', tt);
        //     }
        // )
        return (
            // data_s.create~ 이렇게 넘겨주면 될듯! }
            <div>
                {/* JSON.parse(this.state.data[0].test1) */}
                {itemsCards}
                {/* asdadasdasd */}
                {/* {console.log(this.state.data.retweeted)} */}
                {/* <Tweet rcvData={stateData.tt}/>} */}
                {/* {'this is Retweet '} */}
                {/* <TweetTest rcvData={stateData.tt}/> */}
                {/* {console.log(stateData)} */}
                {/* <TweetTest/> */}
                {/* <Retweet /> */}
                {/* {'this is tweet '} */}
                {/* <Tweet rcvData={this.state}/> */}
                {/* {'this is Quoted Tweet'} */}
                {/* <Quoted rcvData={this.state}/>          */}
            </div>
        )
    }
    
}

        //                 author_tweet_author: data.data.user.name,
        //                 author_tweet_text: data.data.extended_tweet.full_text, 
        //                 author_tweet_Id: data.data.user.screen_name,
        //                 author_profile_image: data.data.user.profile_image_url,
        //                 author_truncated: data.truncated,
                        
        //                 quoted_tweet_author: data.data.quoted_status.user.name,
        //                 quoted_tweet_text: data.data.quoted_status.extended_tweet.full_text,
        //                 quoted_tweet_id: data.data.quoted_status.user.screen_name,
        //                 quoted_profile_image: data.data.quoted_status.user.profile_image_url,
        //                 quoted_truncated: data.data.quoted_status.truncated,