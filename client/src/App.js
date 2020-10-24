import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Navbar from "./components/navbar.component";
import Login from "./components/login.component";
import LapsList from "./components/lap-list.component";
import AddEditLap from "./components/add-edit-lap.component";

function App() {

  axios.defaults.withCredentials = true;

  return (
    <Router>
      <div className="container">
        <Navbar/>
        <br/>
        <Route path="/login" component={Login} />
        <Route path="/" exact component={LapsList} />
        <Route path="/addLap" component={AddEditLap} />
        <Route path="/editLap/:id" component={AddEditLap} />
      </div>
    </Router>
  );
}

export default App;
