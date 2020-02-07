import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NewUser from './NewUser';
import Header from './Header';
import Manage from './Manage';
import Login from './Login';
import Normal from './Normal';
import Follow from './Followings';

export default () => (
    <Router>
      <Header />
      <br/><br/><br/>   
      <Route path="/new" component={NewUser} /> 
      <Route path="/manage" component={Manage} />
      <Route path="/login" component={Login} />
      <Route path="/normal" component={Normal}/>
      <Route path="/follow" component={Follow}/>
      
    </Router>
  )