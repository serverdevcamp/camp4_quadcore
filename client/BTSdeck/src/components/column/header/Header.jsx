import React from 'react'

const styles={
    spanHeader: {
        textAlign: 'center'
    }
}
//Header
function Header(props){
    return (
        <span style={styles.spanHeader}>
        {props.name === '' ? 'Search' : props.name }
        </span>
    )
}   

export default Header;