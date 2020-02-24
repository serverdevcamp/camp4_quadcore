import React from 'react'

const styles={
    spanHeader: {
        textAlign: 'center'
    }
}

function Header(props){
    return (
        <span style={styles.spanHeader}>
        {props.name}
        </span>
    )
}

export default Header;