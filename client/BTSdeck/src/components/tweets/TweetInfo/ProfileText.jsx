import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import * as twitter from 'twitter-text';

const styles = {
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


export default function ProfileText(props) {
    return (
        <div>
            <p style={styles.timeLineTweetText}>
                {ReactHtmlParser(twitter.autoLink(twitter.htmlEscape(props.tweet)))}
            </p>
        </div>
    )
}
