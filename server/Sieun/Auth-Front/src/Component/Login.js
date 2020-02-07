import React, { Component } from 'react'
import axios from 'axios';
import cookie from 'react-cookies';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + cookie.load('access-token')
};
const data = {
    accessToken: cookie.load('access-token')
};
class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            checked_email: false,
            accessToken: cookie.load('access-token')
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }
/*
    requestAccessToken = () => {
        axios.post("http://20.41.86.4:8080/user/refresh", {
            accessToken: this.state.accessToken,
            refreshToken: cookie.load('refresh-token')
        }).then(res => {
            if (res..success) {
                //console.log("success to refresh token to: " + res.data.accessToken);
                cookie.save('access-token', res.data.accessToken, { path: '/' })
                this.setState({
                    isNormal: true
                })
            } else {
                alert("로그인연장 실패로 로그인이 필요합니다.");
                console.log("failed to refresh access token. You need re-login.");
                this.setState({
                    isNormal: false
                })
            }
        }
        ).catch(e => {
            console.log(e);
        })
    }
    */
    findpw = () => {
       
        axios.post("http://http://20.41.86.4:8080/auth/getpwmail", {
            username : this.state.username
        }).then(res => {
            if (res.data.errorCode == 10) {
                alert("이메일을 확인해주세요");
            }
        }).catch(e => {
            console.log(e);
        })   
    }

    logout = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + cookie.load('access-token')
        };
        axios.post("http://20.41.86.4:8080/auth/out", data, {
            headers: headers
        }).then(res => {
            if (res.data.errorCode == 10) {
                cookie.remove('access-token');
                cookie.remove('refresh-token');
                window.location.reload();
            }
            
        }).catch(e => {
            console.log(e);
        })
    }

    componentDidMount(){
        axios.post("http://20.41.86.4:8080/auth/name", data, {
            headers: headers
           }).then(res => {
            console.log(res);
            if (res.data.errorCode == 10) {
                this.setState({
                    isNormal:true,
                    username : res.data.username
                });
            }  else {
                this.setState({
                    isNormal:false
                });
                console.log("cannot validate access token. trying to get new..");
                //this.requestAccessToken();
            }
        }).catch(e => {
            this.setState({
                isNormal:false
            });
            console.log(e);
        })
    }


    handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://20.41.86.4:8080/auth/login",
            {
                username: this.state.username,
                password: this.state.password
            }
        )
            .then(res => {
                console.log(res);
                if (res.data.errorCode == 10) {
                    cookie.save('access-token', res.data.accessToken, { path: '/' })
                    cookie.save('refresh-token', res.data.refreshToken, { path: '/' })
                    window.location.reload();
                } else {
                    alert("로그인불가능");
                }      
            }
            ).catch(e => {
                console.log(e);
                alert("로그인불가능");
            })
    }

    findPassword = (e) => { }

    render() {
        return (
            <React.Fragment>
                Login Page!
            {this.state.isNormal ?
                    <div>
                        {this.state.username} 님 환영합니다.
                <button onClick={this.logout}> 로그아웃</button>
                    </div>
                    :
                    <div>
                    <form onSubmit={this.handleLogin}>
                        Username
                    <input
                            value={this.state.username}
                            name="username"
                            onChange={this.handleChange}
                        />
                        <br />
                        Password
                <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <div><button type="submit" >로그인하기</button></div>
                    </form>
                        <div><button onClick={this.findpw} >비밀번호 변경하기</button></div>
                        </div>
                }
                
            </React.Fragment>
        )
    }
}

export default Login
