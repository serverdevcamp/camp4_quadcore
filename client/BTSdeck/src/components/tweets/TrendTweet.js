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
        backgroundColor: 'white',
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

export default class Tweet extends Component {
    state = {
        author: '',
        tweetText: ''
    }

    // _isRT = (data) => {
    //     if (data.retweeted === true){
    //         let retweetedStatus = JSON.parse(data.retweeted_status) 
    //         {console.log("data : ", data)}
    //         return (
    //             <div>sadas</div>
                
            //     <div style={styles.divTweet}>
            //     <RetweetImg name={data.name}/> 
            //     <div style={styles.tweetProfile}>
            //         <ProfileImage imgsrc={retweetedStatus.profile_image_url} imgLink = {retweetedStatus.screen_name}/>
            //         <div style={styles.tweetAuthorProfile}>
            //             {/* {this.props.rcvData.name} */}
            //             <ProfileUser rcvData={retweetedStatus.user}/>
            //             {/* {console.log('toJson : ',toJson)} */}
            //                 {/* userName={this.props.rcvData.user.name} 
            //                  userId={this.props.rcvData.user.id} />*/}
            //         </div>
            //     </div>
            //     <ProfileText tweet={retweetedStatus.text}/>
            // </div>
            // )
        // }
    // }
    // _isTruncated = (data) => {

    // }
    // _isMedia = (data) => {

//    }

    
    
    render() {
        let toJson = this.props.rcvData
        // let toJson = JSON.parse(this.)
        return (
            // this._isRT(this.props.rcvData)
            <div style={styles.divTweet}>
                {console.log("now props:"+this.props.rcvData)}
                <div style={styles.tweetProfile}>
                    <ProfileImage imgsrc={toJson.user.profile_image_url} imgLink = {toJson.user.screen_name}/>
                    <div style={styles.tweetAuthorProfile}>
                        <ProfileUser rcvData={toJson.user}/>
                        
                    </div>
                </div>
                <ProfileText tweet={this.props.rcvData.text}/>
            </div>
        )
    }
}
