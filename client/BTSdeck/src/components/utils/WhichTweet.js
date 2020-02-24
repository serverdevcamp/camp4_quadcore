import React, { Component } from 'react'
import axios from 'axios';

import Retweet from '../tweets/Retweet';
import Tweet from '../tweets/Tweet';
import Quoted from '../tweets/Quoted'

//utils => 기능적인 클래스들만 모아두는 곳

class WhichTweet extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isRetweet: false,
          author_tweet_author: '',
          author_tweet_text: '',
          author_tweet_Id : '',
          author_profile_image : '',
          author_truncated : '',
          
          quoted_tweet_author : '',
          quoted_tweet_text : '',
          quoted_tweet_id : '',
          quoted_profile_image : '',
          quoted_truncated : '',       
        }
    }

    _isRetweet = (data) => {
        return (data.truncated ? true : false)
    }
    componentDidMount(){
        this._getList();
    }

    _getList(){
        const apiUrl = 'dummy/complexTweet.json' 
        
        axios.get(apiUrl)
            .then(data => {
                this.setState({
                    author_tweet_author: data.data.user.name,
                    author_tweet_text: data.data.extended_tweet.full_text, 
                    author_tweet_Id: data.data.user.screen_name,
                    author_profile_image: data.data.user.profile_image_url,
                    author_truncated: data.truncated,
                    
                    quoted_tweet_author: data.data.quoted_status.user.name,
                    quoted_tweet_text: data.data.quoted_status.extended_tweet.full_text,
                    quoted_tweet_id: data.data.quoted_status.user.screen_name,
                    quoted_profile_image: data.data.quoted_status.user.profile_image_url,
                    quoted_truncated: data.data.quoted_status.truncated,
                });
                // console.log('id : '+ author_tweet_Id)
                console.log('axios complete')
            })
            .catch(error => {
                console.log("error : " + error)
            })
    }

    render() {
        const { tweet } = this.state;
        
        return (
            <div>
                {'this is Retweet '}
                <Retweet rcvData={this.state}/>
                {'this is tweet '}
                <Tweet rcvData={this.state} />
                {'this is Quoted Tweet'}
                <Quoted rcvData={this.state}/>
            </div>
        );
    }
}

export default WhichTweet;