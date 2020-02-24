import React, { Component } from 'react'
import '../../../App.css';

import {IoIosRocket} from "react-icons/io"
import Header from '../header/Header'

import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'

import WhereTweet from '../../utils/WhereTweet'

// class SearchColumn extends Component {
//     render() {
//         return (
//         <div className="content">
//             <div className="column-header">
//                 <IoIosSearch size="30" color="#38444d"/>
//                 <Header name="Search"/>
//                 </div>
//                 {/* search */}
//                 {/* <TweetList/> */}
//             <WhereTweet/>
//           </div>
//         )
//     }
// }
// export default SearchColumn;
class SearchColumn extends Component {
    state = {
        datas: [],
        pageNumber: 1,
        items: 40,
        hasMore: true
      };
    
      componentDidMount(){
        this.fetchData()
      }
    
      fetchData = () => {
        axios
        .get(`https://api.openbrewerydb.org/breweries?page=${
          this.state.pageNumber
        }&per_page=${this.state.items}`)
        .then(res => 
          this.setState({
            datas: [...this.state.datas, ...res.data],
            pageNumber: this.state.pageNumber + 1
          }))
      }

    render() {
        return (
        <div className="content">
            <div className="column-header">
                <IoIosRocket size="30" color="#38444d"/>
                <Header name="BTS"/>
            </div>
        <InfiniteScroll
          dataLength={this.state.datas.length}
          next={this.fetchData} // fetchData를 이용하여 사용자가 맨 밑의 페이지에 도달했을 때 데이터를 더 가져옴
          hasMore={this.state.hasMore} // boolean 형식
          height={950}
          //loader : 로딩 스피너! API요청이 아직 처리중일 때 렌더링 
          loader={<h4>Loading...</h4>}> 
            {this.state.datas.map(brewery => (
              <ul className="user" key={brewery.name}>
                <li>Name: {brewery.name}</li>
              </ul>
            ))}
        </InfiniteScroll>
        </div>
        )
    }
}
export default SearchColumn;