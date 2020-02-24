import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import constants from '../config/constants';
import axios from 'axios'; // HTTP 클라이언트 라이브러리
import routes from "../routes.js";

// core components
import Header from "../components/Header/Header.jsx";

axios.defaults.baseURL = constants.apiUrl;

class Auth extends React.Component {
  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  getRoutes = routes => {
    // 각 prop에 대해서 모두 실행해본다.
    console.log("props: ", this.props)
    if(this.props.token && this.props.isAuthenticated){
  
      return (
        <Redirect to="/main"/>
      );
    }

    console.log(this.props)
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        console.log("Test: ", prop)
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <>
        <Header/>
        <div className="main-content mt-7">
            <Row className="justify-content-center">
              <Switch>{this.getRoutes(routes)}</Switch>
            </Row>
        </div>
      </>
    );
  }
}

export default Auth;
