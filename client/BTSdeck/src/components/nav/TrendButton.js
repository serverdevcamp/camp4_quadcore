import React, { Component } from 'react';
import {IoIosSunny} from "react-icons/io"


const styles ={
    column: {
        margin: '10px',
        backgroundColor: '#1da1f2',
        padding:'10px',
        fontSize: '20px',
        border: '1px solid #1da1f2',
        justifyContent: 'center',
        borderRadius: '20px',
        width: '140px',
        height: '50px'
    },
    iconSize: {
        width: '1px',
        height: '1px'
    }
}

class TrendButton extends Component {
    render(){
    //   const { isSidebarExpanded } = this.state;
      return(
        <div style={styles.column}>
            <IoIosSunny size="20" color="white"/>            
            <span>    Trending</span>
        </div>
        );
    }
}

export default TrendButton;