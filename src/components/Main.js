import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Help from "./Help"

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/help' component={Help} />
    </Switch>
  </main>
)

export default Main
