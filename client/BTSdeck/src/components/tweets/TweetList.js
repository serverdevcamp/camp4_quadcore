import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";

import Tweet from "./Tweet"

// import CardComponent from './CardComponent';


class TweetList extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { items: [], searchTerm: "bts" };
    this.state = {
      isRetweet: false,
      author_tweet_author: '',
      author_tweet_text: '',
      author_tweet_Id : '',
      author_profile_image : '',
      author_truncated : '',
      
      quoted_tweet_author : '',
      quoted_tweet_text : '',
      quoted_tweet_id : '',
      quoted_profile_image : '',
      quoted_truncated : '',       
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }

  handleChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleResume();
    }
  }

  handleResume() {
    // let term = this.state.searchTerm;
    let term = this.state;
    fetch("/setSearchTerm",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term })
      })
  }

  handlePause(event) {
    fetch("/pause",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

componentDidMount() {
  const socket = socketIOClient('http://localhost:3000/');

  // socket.on('connect', () => {
  //   console.log("Socket Connected");
  //   socket.on("tweets", data => {
  //     console.info(data);
  //     let newList = [data].concat(this.state.items.slice(0, 15));
  //     this.setState({ items: newList });
  //   });
  // });
    socket.on('connect', () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
        console.info(data);
        // let newList = [data].concat(this.state.items.slice(0, 15));
        this.setState({
          author_tweet_author: data.data.user.name,
          author_tweet_text: data.data.extended_tweet.full_text, 
          author_tweet_Id: data.data.user.screen_name,
          author_profile_image: data.data.user.profile_image_url,
          author_truncated: data.truncated,
          
          quoted_tweet_author: data.data.quoted_status.user.name,
          quoted_tweet_text: data.data.quoted_status.extended_tweet.full_text,
          quoted_tweet_id: data.data.quoted_status.user.screen_name,
          quoted_profile_image: data.data.quoted_status.user.profile_image_url,
          quoted_truncated: data.data.quoted_status.truncated,
        });
    });
  });
  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}


  render() {
    // let items = this.state.items;

    // let itemsCards = <CSSTransitionGroup
    //   transitionName="example"
    //   transitionEnterTimeout={500}
    //   transitionLeaveTimeout={300}>
    //   {items.map((x, i) =>
    //     <CardComponent key={i} data={x} />
    //   )}
    // </CSSTransitionGroup>;

    // let searchControls =
    //   <div>
    //     <input id="email" type="text" className="validate" value={this.state.searchTerm} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
    //     <label htmlFor="email">Search</label>
    //   </div>

    // let filterControls = <div>
    //   <a className="btn-floating btn-small waves-effect waves-light pink accent-2" style={controlStyle} onClick={this.handleResume}><i className="material-icons">play_arrow</i></a>
    //   <a className="btn-floating btn-small waves-effect waves-light pink accent-2" onClick={this.handlePause} ><i className="material-icons">pause</i></a>
    //   <p>
    //     <input type="checkbox" id="test5" />
    //     <label htmlFor="test5">Retweets</label>
    //   </p>
    // </div>

    // let controls = <div>
    //   {
    //     items.length > 0 ? filterControls : null
    //   }
    // </div>

    // let loading = <div>
    //   <p className="flow-text">Listening to Streams</p>
    //   <div className="progress lime lighten-3">
    //     <div className="indeterminate pink accent-1"></div>
    //   </div>
    // </div>

    return (
      <div>
        <Tweet rcvData={this.state}/>
      </div>
      // <div className="row">
      //   <div className="col s12 m4 l4">
      //     <div className="input-field col s12">
      //       {searchControls}
      //       {
      //         items.length > 0 ? controls : null
      //       }
      //     </div>
      //   </div>
      //   <div className="col s12 m4 l4">
      //     <div>
      //       {
      //         items.length > 0 ? itemsCards : loading
      //       }
      //     </div>

      //   </div>
      //   <div className="col s12 m4 l4">
      //   </div>
      // </div>
    );
  }
}

const controlStyle = {
  marginRight: "5px"
};

export default TweetList;