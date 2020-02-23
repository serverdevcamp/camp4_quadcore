import React, { Component } from 'react'

import ProfileImage from 'components/tweets/TweetInfo/ProfileImage'
import ProfileUser from 'components/tweets/TweetInfo/ProfileUser'
import ProfileText from 'components/tweets/TweetInfo/ProfileText'

// TODO
const styles={
    divTweet : {
        marginTop: '2px',
        padding:'10px',
        backgroundColor: '#FCF7F6',
        borderBottom: '1px solid #e1e8ed',
        borderRadius: '5%',
    },
    divRetweetValue: {
        fontSize: '10px',
        marginBottom: '8px'
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

export default class TweetTest extends Component {
    render() {
        // let data = this.props.data 
        let data = JSON.parse(this.props.data)
        console.log(data)
        return (
            <div style={styles.divTweet}>
                <div style={styles.tweetProfile}>
                    {/* <ProfileImage imgsrc={data.user.profile_image_url}/> */}
                    <div style={styles.tweetAuthorProfile}>
                        {/* <ProfileUser 
                            userName={data.user.name} 
                            userId={data.user.screen_name} /> */}
                    </div>
                </div>
                {/* {console.log('sdfasdfsasassas', JSON.parse(data[0].parse))} */}
                {/* //{data.user.name} */}
                {/* <ProfileText tweet={data.author_tweet_text}/> */}
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