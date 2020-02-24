import React from 'react'
import retweetImg from 'assets/img/retweet.png';

const styles = {
    divRetweetValue: {
        fontSize: '10px',
        marginBottom: '8px'
    },
}

export default function RetweetImg(props) {
    return (
        <div style={styles.divRetweetValue}>
        <img src={retweetImg} height="13" width="13"/>
            {props.name} Retweeted
        </div>
    )
}
