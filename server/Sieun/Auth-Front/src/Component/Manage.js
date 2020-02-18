import React, { Component } from 'react'
import axios from 'axios';
import ManageItem from './ManageItem';
import cookie from 'react-cookies';
const ip="localhost:5000";
const headers = {
    'Content-Type': 'application/json',
    'Authorization' : "Bearer "+ cookie.load('access-token')
};
const data = {
    accessToken: cookie.load('access-token')
};
class Manage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
            Authorized: false,
        }
    }
    
    componentDidMount(){
        axios.get(`http://${ip}/admin/getusers`, {
            headers: headers
        }).then(res => {
            if (res.data.errorCode == 10) {
                this.setState({
                    users: res.data.users,
                    Authorized: true
                });
            }
            
        }
        ).catch(e => {
            this.setState({
                Authorized: false
            });
        })
    }

    render() {
        const userList = this.state.users.map(
            x => (
                <ManageItem
                    database= {x}
                />
            )
        );  
        return (
            <div>
                관리 페이지!
                {this.state.Authorized ? userList : <div>  권한이 없습니다. admin으로 로그인하세요.</div> }
            </div>
        )
    }
}

export default Manage
