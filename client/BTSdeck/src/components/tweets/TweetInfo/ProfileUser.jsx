import React, { Component } from 'react'
import Modal from 'react-awesome-modal';

const styles ={
    testDiv: {
        flexDirection: 'row',
        position: 'relative',
        textDecoration: 'none !important',
        pointerEvents: 'none',
    },
    tweetAuthorName: {
        fontSize: '12px',
        lineWeight: '18px',
        fontWeight: 700,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingRight: '4px',
    },
    tweetAuthorScreenName: {
        fontSize: '12px',
        lineHeight: '18px',
        fontWeight: 300,
        paddingRight: '4px',
        color: '#8800A6',
    },
      modalBackgroundImage: {
        width: '100%',
        height: '80%',
        backgroundColor: 'coral',
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      },
      profileImage: {
        width: '100px',
        height: '100px',
        borderRadius: '200px',
      },
      userName: {
        fontSize: 30,
        color:'white',
        margin: '10 !important'
      },
      aTag: {
        pointerEvents: 'none',
        textDecoration: 'none',
        color:'white',
      },
      bottomDiv: {
        width: '90%',
        height: '20%',
        padding: '20px',
        // backgroundColor: 'yellow',
        marginLeft: '40px',
        display: 'flex',
        justifyContent: 'space-around'
        // justifyContent: 'space-between'
      },
      bottomItem: {
        // border: '1px solid #e1e8ed',
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: '40px'
      },
      p: {
          margin: 'auto',
          align: 'center'
      }
      
}

export default class ProfileUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    render(){
        return (
            <div>
                <a href="#" onClick={() => this.openModal()}>
                    <div style={styles.testDiv}>
                        <span style={styles.tweetAuthorName}>
                        {this.props.rcvData.name}
                        </span>
                        <br/>
                        <span style={styles.tweetAuthorScreenName}>
                        {'@' + this.props.rcvData.screen_name}
                        </span>
                    </div>
                </a>
                {/* Modal */}
                <Modal width="800" height="600" visible={this.state.visible}  effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <a style={styles.aTag} href={'https://twitter.com/' + this.props.rcvData.screen_name}>
                        <div style={styles.modalBackgroundImage}>
                            <img style={styles.profileImage} src={this.props.rcvData.profile_image_url} />
                            <p style={styles.userName} href="#" >{this.props.rcvData.name}</p>
                            <p>{'@' + this.props.rcvData.screen_name}</p>
                            <p>{this.props.rcvData.description}</p>
                        </div>
                    </a>
                    <div style={styles.bottomDiv}>
                        <div style={styles.bottomItem}>
                            {/* <img src={tweetDecklogo} alt="tweetDeck" height="60" width="80"></img> */}
                            <h2>Tweets</h2>
                            <p> Count  </p>
                        </div>
                        <div>
                            {/* <img src={tweetDecklogo} alt="tweetDeck" height="60" width="80"></img> */}
                            <h2>Following</h2>
                            <p> Count  </p>
                        </div>
                        <div>
                            {/* <img src={tweetDecklogo} alt="tweetDeck" height="60" width="80"></img> */}
                            <h2>Followers</h2>
                            <p> Count </p>
                        </div>
                        <div>
                            {/* <img src={tweetDecklogo} alt="tweetDeck" height="60" width="80"></img> */}
                            <h2>LISTED</h2>
                            <p> Count </p>
                        </div>
                        {/* <div>
                            <img src={tweetDecklogo} alt="tweetDeck" height="60" width="80"></img>
                            <p> Twitter </p>
                            <a></a>
                        </div> */}
                        {/* <h1>Id : {this.props.userName}</h1>
                        <p>Some Contents</p> */}
                    </div>
                </Modal>
            </div>
        )
    }
}


{/* <div>
<h1>Title</h1>
<p>Some Contents</p>
<a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
</div> */}

// onClickAway={() => this.closeModal()}