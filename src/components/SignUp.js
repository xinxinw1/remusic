import React, { Component } from 'react';
import { Link, withRouter, } from 'react-router-dom';
import { signUp } from '../firebase/auth';
import * as routes from './Main';
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './Signup.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SignUpPage = ({ history }) =>
    <div>
      <SignUpForm history={history}/>
    </div>;

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event)  {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    signUp(email, passwordOne)
        .then(authUser => {
          this.setState({ ...INITIAL_STATE });
          history.push(routes.home);
        })
        .catch(error => {
          this.setState(byPropKey('error', error));
        });

    event.preventDefault();
  }

  render() {

    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === '';

    return (
        <Card className={"card"}>
          <CardContent>
            <br/>
            <Typography variant="h2" component="h2" className={"root"}>
              Sign Up
            </Typography>
            <br/>
            <form onSubmit={this.onSubmit} noValidate autoComplete="off" className={"root"}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <TextField
                      label="Username"
                      onChange={event => this.setState(byPropKey('username', event.target.value))}
                      type="text"
                      value={username}
                      margin="normal"
                      variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Email"
                      onChange={event => this.setState(byPropKey('email', event.target.value))}
                      type="email"
                      value={email}
                      margin="normal"
                      variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Enter Password"
                      onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                      type="password"
                      value={passwordOne}
                      margin="normal"
                      variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Confirm Password"
                      onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                      type="password"
                      value={passwordTwo}
                      margin="normal"
                      variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  { error && <p>{error.message}</p> }
                </Grid>
              </Grid>
            </form>
          </CardContent>
          <CardActions className={"button"}>
            <Button variant="contained" color="primary" type="submit" disabled={isInvalid} >
              Sign Up
            </Button>
          </CardActions>
          <CardContent className={"root"}>
            <p>
              Don't have an account? <Link to={routes.signup}>Sign Up</Link>
            </p>
          </CardContent>
        </Card>
    )
  }
}


export default SignUpPage;

export {
  SignUpForm,
};

