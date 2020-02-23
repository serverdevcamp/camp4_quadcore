import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './App.css'

import "./assets/scss/argon-dashboard-react.scss";
import "./assets/css/argon-dashboard-react.css"

// import AdminLayout from "./layouts/Admin.jsx";
import AdminLayout from "./components/auth/layouts/Admin"
import AuthLayout from "./components/auth/layouts/Auth"
import MainLayout from "./components/auth/layouts/Main"

// function App() {
//   return (
//     <div className="App">
//       <Routes />      
//     </div>
//   );
// }

// export default App;


function App(){
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Route path="/auth" render={props => <AuthLayout {...props} />} />
        <Route path="/main" render={props => <MainLayout {...props} />} />
        <Redirect from="/" to="/auth/login"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


// import "./assets/scss/argon-dashboard-react.scss";
// import "./assets/css/argon-dashboard-react.css"

// import AdminLayout from "./layouts/Admin.jsx";
// import AuthLayout from "./layouts/Auth.jsx";
// import MainLayout from "./layouts/Main.jsx"

// // front

// ReactDOM.render(
//     <BrowserRouter>
//       <Switch>
//         <Route path="/admin" render={props => <AdminLayout {...props} />} />
//         <Route path="/auth" render={props => <AuthLayout {...props} />} />
//         <Route path="/main" render={props => <MainLayout {...props} />} />
//         <Redirect from="/" to="/auth/login"/>
//       </Switch>
//     </BrowserRouter>,
//     document.getElementById("root")
// );


// // Progressive Web Apps이 되기 위해서 필수 조건인 Service Worker
// //serviceWorker.unregister();
