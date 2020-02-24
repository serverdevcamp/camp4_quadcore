import React, { Component } from 'react'

const styles = {
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
    imgProfile: {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '50%'
    },
}

export default function ProfileImage(props) {
    return (
        <div>
            <a href={'https://twitter.com/' + props.imgLink} style={styles.tweetAuthor}>
                            <img style={styles.imgProfile} 
                        src={props.imgsrc} 
                        height="40" 
                        width="40"/>
            </a>            
        </div>
    )
}