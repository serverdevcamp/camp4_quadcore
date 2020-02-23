import React, { Component } from 'react'

import ProfileImage from 'components/tweets/TweetInfo/ProfileImage'
import ProfileUser from 'components/tweets/TweetInfo/ProfileUser'
import ProfileText from 'components/tweets/TweetInfo/ProfileText'

import RetweetImg from 'components/tweets/TweetInfo/RetweetImg'

// TODO
const styles={
    divTweet : {
        marginTop: '2px',
        padding:'10px',
        backgroundColor: '#FCF7F6',
        borderBottom: '1px solid #e1e8ed',
        borderRadius: '5%',
    },
    tweetProfile: {
        position: 'relative',
        marginBottom: '2px',
        paddingLeft: '40px'
    },
    tweetAuthorProfile: {
        maxWidth: '100%',
        overflow: 'hidden!important',
        textOverflow: 'ellipsis!important',
        whiteSpace: 'nowrap!important',
        wordWrap: 'normal!important'
    },
}

export default class Retweet extends Component {
    state = {
        author: '',
        tweetText: '',
        isQuoted: ''
    }
    
    render() {
        return (
            <div style={styles.divTweet}>
                <RetweetImg/>
                <div style={styles.tweetProfile}>
                    <ProfileImage imgsrc={this.props.rcvData.author_profile_image}/>

                    <div style={styles.tweetAuthorProfile}>
                        <ProfileUser 
                            userName={this.props.rcvData.author_tweet_author} 
                            userId={this.props.rcvData.author_tweet_Id} />
                    </div>
                </div>
                <ProfileText tweet={this.props.rcvData.author_tweet_text}/>
            </div>
        )
    }
}
