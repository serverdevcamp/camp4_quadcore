import React from 'react'
// import '../../App.css'

const styles = {
    tweetButton: {
        width: '100%',
        height: '36px',
        fontSize: '16px',
        backgroundColor: '#1da1f2',
        border: '1px solid #1da1f2',
        borderRadius: '45px',
        marginBottom: '10px',
        color: 'white',
      },
}

export default function TweetSubmit() {
    return (
        <div>
        <button style={styles.tweetButton} type="submit" value="Tweet">Tweet
        </button>
        </div>
    )
}
