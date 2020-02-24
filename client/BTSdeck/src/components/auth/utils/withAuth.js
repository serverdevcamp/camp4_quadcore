import React from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();

    return class AuthWrapped extends React.Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/');
            }
            else {
                try {
                    const profile = Auth.getProfile();
                    this.setState({
                        user: profile
                    });
                }
                catch (err) {
                    Auth.logout();
                    this.props.history.replace('/');
                }
            }
        }

        render(){
            if(this.state.user){
                return(
                    <AuthComponent history={this.props.history} user={this.state.user}/>
                );
            }
            else{
                return null;
            }
        }
    }
}