import React, { Component } from 'react'
import '../../../App.css';

import {IoMdHome} from "react-icons/io"
import Header from '../header/Header'

import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'

import WhichTweet from '../../utils/WhichTweet'



// import ScrollBox from '../../scroll/ScrollBox'

class HomeColumn extends Component {
    render() {
        return (
        <div className="content">
            <div className="column-header">
                <IoMdHome size="30" color="#38444d"/>
                <Header name="Home"/>
                </div>
                {/* <WhichTweet/> */}
          </div>
        )
    }
}
export default HomeColumn;