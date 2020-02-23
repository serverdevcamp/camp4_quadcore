import React, { Component } from 'react'
import axios from 'axios';


const styles={
    divTweet : {
        marginTop: '2px',
        padding:'10px',
        // border: 'solid 0.5px red',
        backgroundColor: '#FCF7F6',
        borderBottom: '1px solid #e1e8ed',
        borderRadius: '5%',
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
        fontWeight: 'bold',
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

export default class Trending extends Component {
    constructor(props){
        super(props);
        this.state = {
            trending: '',
        }
    }
    componentWillMount(){
        this._getList();
    }

    _getList(){
        const apiUrl = 'dummy/trendingData.json'
        // const { trendState } = this.state.trending.data

        axios.get(apiUrl)
            .then(data =>{
                this.setState({
                    trending: data
                });
                // console.log("trending : " + this.state.trending.data.trend_10.id)
                // console.log("trending : " + trendState.trend_1.id)
            })
            .catch(error=> {
                console.log("error : " + error)
            })
    }
    // _trending = ({data}) => {
    //     if(this.state.trending.data === undefined){}
    // }

    render() {
        return (
            <div style={styles.divTweet}>
                <div style={styles.tweetProfile}>
                    <span style={styles.tweetAuthor} >
                        1
                    </span>
                    <div style={styles.tweetAuthorProfile}>
                         <a href="#">
                            <div style={styles.testDiv}>
                                내용입니당
                                {/* {while } */}
                            </div>
                         </a>
                         <div>
                             count 트윗
                         </div>
                    </div>
                </div>
            </div>
        )
    }
}
