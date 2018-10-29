import React, { Component } from 'react';
import { Link, withRouter, } from 'react-router-dom';
import { signIn } from '../firebase/auth';
import * as routes from './Main';
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './SignIn.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import BodyClass from './BodyClass';

const SignInPage = ({ history }) =>
    <div>
      <SignInForm history={history}/>
    </div>;

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onSubmit = this.onSubmit.bind(this);

  }

  onSubmit(event)  {
    const {
      email,
      password,
    } = this.state;

    console.log(this.state);


    const {
      history,
    } = this.props;

    signIn(email, password)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          history.push("/");
        })
        .catch(error => {
          this.setState(byPropKey('error', error));
        });

    event.preventDefault();
  }

  render() {

    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
        password === '' ||
        email === '';

    return (
        <BodyClass className="body--signin">
          <Card className={"signincard"}>
            <CardContent>
              <br/>
              <Typography variant="h2" component="h2" className={"root"}>
                Sign In
              </Typography>
              <br/>
              <form  noValidate autoComplete="off" className={"root"}>
                <Grid container spacing={0}>

                  <Grid item xs={12}>
                    <TextField
                        label="Email"
                        onChange={event => this.setState(byPropKey('email', event.target.value))}
                        type="text"
                        value={email}
                        margin="normal"
                        variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        label="Enter Password"
                        onChange={event => this.setState(byPropKey('password', event.target.value))}
                        type="password"
                        value={password}
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
              <Button variant="contained" color="primary" type="submit" disabled={isInvalid} onClick={this.onSubmit}>
                Sign In
              </Button>

            </CardActions>
            <CardContent className={"root"}>
              <p>
                Don't have an account? <Link to={"/signup"}>Sign Up</Link>
              </p>
            </CardContent>
          </Card>
        </BodyClass>
    )
  }
}


export default withRouter(SignInPage);

export {
  SignInForm,
};

