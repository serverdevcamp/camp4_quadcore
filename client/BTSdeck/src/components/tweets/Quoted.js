import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser';
import * as twitter from 'twitter-text';

// TODO
const styles={
    divTweet : {
        marginTop: '2px',
        padding:'10px',
        backgroundColor: '#FCF7F6',
        borderBottom: '2px solid #e1e8ed',
        borderRadius: '2%',
        boxShadow: '1px 0.3px 0.3px 0.1px #ccc'
    },
    a :{
        color: "#2b7bb9"
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
    imgProfile: {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '50%'
    },
    tweetAuthor: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 'none',
        width: '32px',
        height: '32px',
        overflow: 'hidden',
        borderRadius: '4px'
    },
    tweetAuthorProfile: {
        maxWidth: '100%',
        overflow: 'hidden!important',
        textOverflow: 'ellipsis!important',
        whiteSpace: 'nowrap!important',
        wordWrap: 'normal!important'
    },
    tweetAuthorDecoratedName: {
        display: 'flex',
        overflow: 'hidden',
        alignItems: 'center'
    },
    tweetAuthorName: {
        fontSize: '12px',
        lineWeight: '18px',
        fontWeight: 700,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingRight: '4px'
    },
    tweetAuthorScreenName: {
        // flexBasis: '100%',
        // overflow: 'hidden',
        // textOverflow: 'ellipsis',
        // whiteSpace: 'nowrap',
        fontSize: '12px',
        lineHeight: '18px',
        fontWeight: 300,
        paddingRight: '4px',
        color: '#8800A6'
    },
    testDiv: {
        flexDirection: 'row',
        position: 'relative'
    },
    timeLineTweetText: {
        marginLeft: '40px',
        marginBottom: '12px',
        lineHeight: '18px',
        fontSize: '14px',
        fontWeight: '400',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
    }
}


export default class Quoted extends Component {
    state = {
        author: '',
        tweetText: ''
    }
    
    render() {
        return (
            <div style={styles.divTweet}>
                <div style={styles.tweetProfile}>
                    <a href="#" style={styles.tweetAuthor}>
                        <img style={styles.imgProfile} 
                        src={this.props.rcvData.author_profile_image} 
                        // src="https://pbs.twimg.com/profile_images/1111866139062104065/XIdUgtDy_normal.png"
                        height="40" 
                        width="40"/>
                    </a>
                    <div style={styles.tweetAuthorProfile}>
                         <a href="#">
                            <div style={styles.testDiv}>
                                <span style={styles.tweetAuthorName}>
                                {this.props.rcvData.author_tweet_author}
                                </span>
                                <br/>
                                <span style={styles.tweetAuthorScreenName}>
                                {'@' + this.props.rcvData.author_tweet_Id}
                                </span>
                            </div>
                         </a>
                    </div>
                </div>
                <p style={styles.timeLineTweetText}>
                {ReactHtmlParser(twitter.autoLink(twitter.htmlEscape(this.props.rcvData.author_tweet_text)))}
                </p>
                {/* Quoted */}
                <div style={styles.divTweet}>
                <div style={styles.tweetProfile}>
                    <a href="#" style={styles.tweetAuthor}>
                        <img style={styles.imgProfile} 
                        src={this.props.rcvData.author_profile_image} 
                        // src="https://pbs.twimg.com/profile_images/1111866139062104065/XIdUgtDy_normal.png"
                        height="40" 
                        width="40"/>
                    </a>
                    <div style={styles.tweetAuthorProfile}>
                         <a href="#">
                            <div style={styles.testDiv}>
                                <span style={styles.tweetAuthorName}>
                                {this.props.rcvData.quoted_tweet_author}
                                </span>
                                <br/>
                                <span style={styles.tweetAuthorScreenName}>
                                {'@' + this.props.rcvData.quoted_tweet_id}
                                </span>
                            </div>
                         </a>
                    </div>
                </div>
                <p style={styles.timeLineTweetText}>
                    {ReactHtmlParser(twitter.autoLink(twitter.htmlEscape(this.props.rcvData.quoted_tweet_text)))}
                </p>
                </div>
            </div>
        )
    }
}
