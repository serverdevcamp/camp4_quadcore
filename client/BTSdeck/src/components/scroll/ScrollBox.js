import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
// import './styles.css'

export default class ScrollBox extends Component {
  state = {
    breweries: [],
    pageNumber: 1,
    items: 15,
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
        breweries: [...this.state.breweries, ...res.data],
        pageNumber: this.state.pageNumber + 1
      }))
  }

  render() {
    return (
      <div className="App">
        <InfiniteScroll
          dataLength={this.state.breweries.length}
          next={this.fetchData} // fetchData를 이용하여 사용자가 맨 밑의 페이지에 도달했을 때 데이터를 더 가져옴
          hasMore={this.state.hasMore} // boolean 형식
          //loader : 로딩 스피너! API요청이 아직 처리중일 때 렌더링 
          loader={<h4>Loading...</h4>}> 
            {this.state.breweries.map(brewery => (
              <ul className="user" key={brewery.name}>
                <li>Name: {brewery.name}</li>
              </ul>
            ))}
        </InfiniteScroll>
      </div>
    );
  }
}