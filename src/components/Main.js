import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Help from "./Help"
import Score from "./Score"
import SignUp from "./SignUp";

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/help' component={Help} />
      <Route path='/score/:id' component={Score} />
      <Route path='/signup' component={SignUp} />
    </Switch>
  </main>
);

export const home = '/';
export const signup = '/signup';

export default Main
