import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Help from "./Help"
import Test from "./Test"
import Score from "./Score"

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/help' component={Help} />
      <Route path='/test' component={Test} />
      <Route path='/score/:id' component={Score} />
    </Switch>
  </main>
)

export default Main
