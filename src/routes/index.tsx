import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Main from '../pages/Main';
import Place from '../pages/Place';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Main} />
    <Route path="/place" component={Place} />
  </Switch>
);

export default Routes;
