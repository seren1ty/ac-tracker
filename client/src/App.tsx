import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';
import { SessionProvider } from './context/session.context';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

import Login from "./components/login.component";
import LapsList from "./components/lap-list.component";
import AddEditLap from "./components/add-edit-lap.component";

function App() {

  axios.defaults.withCredentials = true;

  return (
    <Router>
      <SessionProvider>
        <div className="container">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" exact component={LapsList} />
            <Route path="/addLap" component={AddEditLap} />
            <Route path="/editLap/:id" component={AddEditLap} />
            <Route component={LapsList} />
          </Switch>
        </div>
      </SessionProvider>
    </Router>
  );
}

export default App;
