import React, { Component } from 'react';
import {IoIosSearch} from "react-icons/io"
import ICON from '../../assets/img/crown.png';

// import Glass from '../img/magnifiGlass.png'

// TODO
// component
// each column add image 
// Home, search, Trending

const styles = {
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

class SearchButton extends Component {
    render(){
    //   const { isSidebarExpanded } = this.state;
      return(
        <div style={styles.column}>
            {/* <IoIosSearch size="20" color="white"/>    */}
            <img src={ICON} className="navicon"/>
            <span className="navfonts">    Tweet</span>
        </div>
        );
    }
}

export default SearchButton;