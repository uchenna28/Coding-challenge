
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signin from './Signin';
import UserTable from './UserTable';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" component={Signin} exact  />
      <Route path="/userTable" component={UserTable} />
    </Switch>
  </Router>
);

export default App;
