import React, { Component } from 'react';
import '../../App.css';

import Sidebar from '../nav/sideBar';

import SearchColumn from '../column/body/SearchColumn'
import TrendColumn from '../column/body/TrendColumn'
import HomeColumn from '../column/body/HomeColumn'
import BtsColumn from '../column/body/BtsColumn'

class Main extends Component {

 render() {
    return (
      <div className="app">
        <Sidebar></Sidebar>
        <SearchColumn/>
        <HomeColumn/>
        <TrendColumn/>
        <BtsColumn/>
      </div>
    );
  }
}

export default Main;