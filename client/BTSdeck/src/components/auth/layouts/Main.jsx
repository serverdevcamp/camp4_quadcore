import React, {Component} from 'react';
import '../../../App.css'

import withAuth from '../utils/withAuth';

import Sidebar from '../../nav/sideBar';

import SearchColumn from '../../column/body/SearchColumn'
import TrendColumn from '../../column/body/TrendColumn'
import HomeColumn from '../../column/body/HomeColumn'
import BtsColumn from '../../column/body/BtsColumn'

class Main extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        search : '',
    };
}
  handleChange = (e) => {
    this.setState({
        search : e,
    })
    console.log('main search : ', this.state.search)
  }



  render(){
    return (
      <div className="app">
          <Sidebar handleChange={this.handleChange} />
          <SearchColumn search={this.state.search}/>
          <HomeColumn/>
          <TrendColumn/>
          <BtsColumn/>
      </div>
    )
  }
}



// function Main () {
//   return (
//     <>
//       <div className="main-content mt-7">
//           <Row className="justify-content-center">
//             <p>안녕하세요 :)</p>
//           </Row>
//       </div>
//     </>
//   );
// }

export default withAuth(Main);
