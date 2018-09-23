import React from "react";
import ReactDOM from "react-dom";
import { Link, Switch, Route, BrowserRouter } from "react-router-dom";

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
    </Switch>
  </main>
)

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

const Home = () => (
  <div>
    <h1>Welcome to Re:Music</h1>
  </div>
)

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/what'>What</Link></li>
      </ul>
    </nav>
  </header>
)

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById("index"));

