import React, { useState } from 'react';
import decode from 'jwt-decode';
import axios from 'axios'; // HTTP 클라이언트 라이브러리
import constants from '../config/constants'; // api server domain

import cookie from 'react-cookies'

axios.defaults.baseURL = constants.apiUrl;

export default class AuthService extends React.Component {
    constructor() {
        super();
        this.domain = constants.apiUrl; // API server domain
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    // login(email, password) {
    login(name, password) {
        // console.log("login data: ", email, password)
        // console.log("login data: ", name, password)
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
            console.log('headers: ', headers['Authorization'])
        }
        const reqObj = {
            // email: email,
            // name: name,
            username: name,
            password: password
        };

        // login 
        return axios.post(`${this.domain}auth/login`, reqObj, headers)
            .then(res => {
                // console.log('res : ', res.data.errorCode)
                if (res.data.errorCode == 10) {
                    cookie.save('access-token', res.data.accessToken, { path: '/' });
                    cookie.save('refresh-token', res.data.refreshToken, { path: '/' });
                    cookie.save('user-name', name);
                    console.log('res : ',res.data.accessToken)
                    this.setToken(res.data.accessToken); 
                    return Promise.resolve(res);
                }

                /// expired? 
                // else if (res.data.errorCode == 56 || res.data.errorCode == 55){
                //     // conso
                //     axios.post(`${this.domain}user/refresh`, {
                //         accessToken: this.state.accessToken,
                //         // refreshToken: setRawCookie.load('refresh-token')
                //         refreshToken: cookie.load('refresh-token')
                //     }).then(res => {
                //         if(res.data.success){
                //             this.setToken(res.data.accessToken)
                //             this.logout()
                //             alert("다시 로그인해주세요.")
                //         }
                //     })
                // }
        })
    }

    getToken() {
        return localStorage.getItem('access-token');
    }

    setToken(idToken) {
        localStorage.setItem('access-token', idToken);
    }

    loggedIn() {
        const token = this.getToken(); 
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            return false;
        }
    }

    logout() {
        localStorage.removeItem('accessToken');
    }

    getProfile() {
        return decode(this.getToken());
    }

}