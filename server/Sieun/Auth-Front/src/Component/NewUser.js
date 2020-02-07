import React, { Component } from 'react'
import axios from 'axios';
import  { Redirect } from 'react-router-dom'
import validator from 'validator';

class NewUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
                checked_email: false,
                email_msg: '',
                username_msg:'',
                password_msg: '',
                e: false, u:false, p:false
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        })
        if (e.target.name == "email") {
            if (validator.isEmail(e.target.value)) {
                this.setState({
                    email_msg: '유효한 이메일 형식입니다',
                    e: true
                });
            } else {
                this.setState({
                    email_msg: '유효하지 않은 이메일 형식입니다',
                    e: false
                });
            }
        } else if (e.target.name == "username") {
            if (validator.isLength(e.target.value,{min:5, max:10})) {
                this.setState({
                    username_msg: '유효한 아이디 형식입니다',
                    u: true
                });
            } else {
                this.setState({
                    username_msg: '아이디는 5글자 이상 10글자 이하',
                    u:false
                });
            }
        } else {
            if (validator.isLength(e.target.value,{min:8, max:16})) {
                this.setState({
                    password_msg: '유효한 비밀번호 형식입니다',
                    p:true
                });
            } else {
                this.setState({
                    password_msg: '비밀번호는 8글자 이상 16글자 이하',
                    p:false
                });
            }
        }
    }
    
    handleEmailCheck = (e) => {
        if (!this.state.e) {
            alert("이메일 형식을 확인해주십시오.");
        } else {
            axios.post("http://20.41.86.4:8080/auth/checkemail", 
                { email: this.state.email}
            )
            .then(res => {
                if (res.data.errorCode == 10){
                    alert("사용 가능한 이메일입니다.");
                    this.setState({
                        checked_email : true 
                    });
                } else {
                    alert("이미 존재하는 이메일입니다.");
                    this.setState({
                        email:'',
                        checked_email: false
                    });
                }
            }
            ).catch(e => {
                console.log(e);
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        /*
        if (!this.state.checked_email) {
            alert("이메일 중복체크를 먼저 해주십시오.");
        } else if ((!this.state.p&& this.state.u&& this.state.e)) {
            alert("형식 체크좀");
        }
        else {
            */
            axios.post("http://20.41.86.4:8080/auth/register",  {
                username: String(this.state.username),
                email: String(this.state.email),
                password: String(this.state.password)
            }).then(res => {
                console.log(res);
                /*
                if (!res.data.success){
                    alert("이미 존재하는 아이디입니다.");
                } else {
                    alert("가입에 성공했습니다.");
                    this.setState({
                        redirect: true
                    });
                }
                */
            }).catch(e => {
                console.log(e);
            })
       // }
    
    }
  

    render() {
        if (this.state.redirect) {
            return <Redirect to='/login'/>;
        }
        return (
            <React.Fragment>
                NewUser
                <form onSubmit={this.handleSubmit}>
                    Email
                    <input 
                        name="email"
                        value= {this.state.email}
                        onChange={this.handleChange}
                    /> <button type="button" onClick={this.handleEmailCheck}>중복체크</button>
                    <br />
                    {this.state.email_msg}
                    <br />
                    Username
                    <input 
                        value={this.state.username}
                        name="username"
                        onChange={this.handleChange}
                    />
                    <br />
                    {this.state.username_msg}
                    <br />
                    Password
                <input 
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <br />
                     {this.state.password_msg}
                <div><button type="submit"  >확인</button></div>
                </form>

            </React.Fragment>
        )
    }
}

export default NewUser
