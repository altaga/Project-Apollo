// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MyApp from "./MyAppTest"
import MyApp2 from "./MyApp2"

class App extends React.Component {

  render() {

    // Display the app home page hosted in Teams
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MyApp} />
          <Route exact path="/landing" component={MyApp2} />
          <Route path="*" render={() => (<MyApp />)} />
        </Switch>
      </Router>
    );
  }
}

export default App;
