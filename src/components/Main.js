import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Help from "./Help"
import Test from "./Test"
import Score from "./Score"
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/help' component={Help} />
      <Route path='/test' component={Test} />
      <Route path='/score/:id' component={Score} />
      <Route path='/signup' component={SignUp} />
      <Route path='/signin' component={SignIn} />
    </Switch>
  </main>
);

export const home = '/';
export const signup = '/signup';

export default Main
