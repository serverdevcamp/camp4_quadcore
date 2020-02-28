import React, { Component, Fragment } from 'react';

import SearchButton from './SearchButton';
import BtsButton from './BtsButton';
import TrendButton from './TrendButton';
import HomeButton from './HomeButton';

import TweetButton from './TweetSubmit'


import tweetDecklogo from 'assets/img/tweetDeck.png'

import {IoMdArrowRoundBack, IoMdArrowRoundForward, IoLogoTwitter} from "react-icons/io"

const styles = {
  sideBarStyle: {
    minHeight: '100vh',
    display: 'flex'
  },
  ul: {
    paddingInlineStart: 0,
  },
  li: {
    listStyleType:'none',
    marginBottom: '10px',
  },
  logoStyle:{
    marginBottom: '40px',
    paddingLeft: '20px'

  },
  logoEmptyStyle:{
    marginBottom: '25px',
    height: '80px'
  },
  expandedArrowStyle: {
    position: 'absolute',
    bottom:'100px',
    left: 0,
    right: 0,
    backgroundColor: '#1c2938',
    padding: '20px',
    cursor: 'pointer',
    color: '#1da1f2',
    marginLeft: '50px'
  },
  collapsedArrowStyle: {
    position: 'absolute',
    bottom:'100px',
    left: 0,
    right: 0,
    backgroundColor: '#1c2938',
    paddingBottom: '20px',
    cursor: 'pointer',
    color: '#1da1f2',
    marginLeft: '10px'
  },
  collapsedStyle: {
    width: '70px',
    padding: '17px 10px 0',
    background: '#1c2938',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'    
  },
  expandedStyle: {
    width: '200px',
    padding: '17px 10px 0',
    background: '#1c2938',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  tweetButton: {
    width: '100%',
    height: '36px',
    fontSize: '16px',
    backgroundColor: '#1da1f2',
    border: '1px solid #1da1f2',
    borderRadius: '45px',
    marginBottom: '10px',
    color: 'white',
  },
  navBarItemStyle: {
    width: '100%',
    height: '75%'
  }
}
//  TODO : styles

class Sidebar extends Component {
    state = { // sidebar state
        isSidebarExpanded: true,
        search: '',
      };
      
      handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        })

      }


      sidebarExpanded = () => (
        <header style={styles.expandedStyle}>
          <div style={styles.logoStyle}>
            <img src={tweetDecklogo} alt="tweetDeck" height="80" width="100"></img>
          </div>

          {/* <TweetButton/> */}
          <button onClick={()=>this.props.handleChange(this.state.search)} style={styles.tweetButton} className="tweet-button" type="submit" value="Tweet">Search</button>
          <div className="search-upper">
            <div className="search">
              <input name="search" onChange={this.handleChange} className="input-search" placeholder="Search Twitter"></input>
            </div>
          </div>
          <HomeButton/>
          <TrendButton/>
          <SearchButton/>
          <BtsButton/>

          <div style={styles.expandedArrowStyle}>
            <a style={styles.appNavLink}
              role="presentation"
              onClick={() => this.setState({ isSidebarExpanded: false })}>
            <IoMdArrowRoundBack size="40"/>
            </a>
          </div>
        </header>
      );
    
      sidebarCollapsed = () => (
      <header style={styles.collapsedStyle}>
          <div style={styles.logoEmptyStyle}>
          </div>
        <button className="js-show-drawer js-show-tip Button Button--primary Button--large tweet-button margin-t--8 margin-b--10" type="submit" value="Tweet"></button>
        <div className="search-upper">
          <div className="search">
            <input className="input-search" placeholder="Tst"></input>
            <a href="#"></a>
          </div>
        </div>
        <div style={styles.navBarItemStyle} >
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        </div>
        {/* <div class="app-navigator margin-bm padding-tm"> */}
        <div style={styles.collapsedArrowStyle} >
          <a 
            role="presentation"
            onClick={() => this.setState({ isSidebarExpanded: true })}
          >
            <IoMdArrowRoundForward size="40"/>
          </a>
        </div>
        <IoLogoTwitter size="40"/>
      </header>
      );

    render(){
      const { isSidebarExpanded } = this.state;
      return(
          <Fragment>
            {isSidebarExpanded && this.sidebarExpanded()}
            {isSidebarExpanded || this.sidebarCollapsed()}
          </Fragment>
        );
    }
}

export default Sidebar;