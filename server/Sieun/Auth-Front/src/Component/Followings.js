import React, { Component } from 'react'
import axios from 'axios';
import cookie from 'react-cookies';

const headers = {
    'Content-Type': 'application/json',
    'Authorization' : "Bearer "+ cookie.load('access-token')
};
const ip="20.41.86.4:5000";
class Followings extends Component {
    constructor(props) {
        super(props)

        this.state = {
               followings: []  
        }
    }

    componentDidMount(){
        axios.get(`http://20.41.86.4:5000/follow/flist/tlatldms`, {
            headers: headers
           }).then(res => {
            console.log(res);
            if (res.data.errorCode == 10) {
                this.setState({
                    followings : res.data.followings
                });
            }  else {
               
                console.log("err");
            }
        }).catch(e => {
            
            console.log(e);
        })
    }

    render() {
        return (
            <div>
                {this.state.followings}
            </div>
        )
    }
}

export default Followings
