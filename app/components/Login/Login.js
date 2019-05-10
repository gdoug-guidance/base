import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Amplify, { Auth } from 'aws-amplify';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import TextField from '@material-ui/core/TextField';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import CardActions from '@material-ui/core/es/CardActions/CardActions';
import Dialog from '@material-ui/core/es/Dialog/Dialog';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import configurations from '../../constants/configurations';

type Props = {};

const style = {};

class Login extends Component<Props> {
  props: Props;

  state = {
    auth: {
      region: configurations.cognito.region,
      userPool: configurations.cognito.userPool,
      identityPool: configurations.cognito.identityPool,
      appClientId: configurations.cognito.appClientId
    },
    userCredentials: {
      username: '',
      password: '',
      code: ''
    },
    user: {},
    systemMessage: '',
    userRegistration: '',
    loginStatus: false
  };

  componentDidMount() {
    this.hydrateState();
  }

  componentDidUpdate() {
    this.hydrateState();
    this.checkDeferredCommands();
  }

  sessionCheck = false;

  amplifyConfigured = false;

  // List of commands to run after render.
  deferredCommands = [];

  /*
   *
   * The Deferred Commands model is to allow us to run functions once the
   * state has been set.
   * This is useful when we want to persist data via a redux action, or run
   * multiple steps to record progress.
   *
   */
  checkDeferredCommands = () => {
    if (!this.deferredCommands.length) return;

    this.deferredCommands = this.deferredCommands.filter(command => {
      command();
      return false;
    });
  };

  hydrateState = () => {
    const { auth } = this.state;
    if (
      !this.amplifyConfigured &&
      auth.appClientId &&
      auth.identityPool &&
      auth.region &&
      auth.userPool
    ) {
      Amplify.configure({
        Auth: {
          mandatorySignIn: true,
          region: auth.region,
          userPoolId: auth.userPool,
          identityPoolId: auth.identityPool,
          userPoolWebClientId: auth.appClientId
        }
      });
      this.amplifyConfigured = true;
    }
    if (!this.sessionCheck) this.getSession();
  };

  getSession = async () => {
    try {
      const userSession = await Auth.currentSession();
      this.deferredCommands.push(() => {
        this.setTokenOnUser();
      });
      this.setState({ user: userSession, loginStatus: true });
    } catch (e) {
      this.setState({ loginStatus: false });
    }
    this.sessionCheck = true;
  };

  setTokenOnUser = () => {
    const { user } = this.state;
    const { setUserToken } = this.props;
    if (user.accessToken.jwtToken) {
      setUserToken(user.accessToken.jwtToken);
    }
  };

  handleUserCredentialsChange = event => {
    const { userCredentials } = this.state;
    userCredentials[event.target.name] = event.target.value;
    this.setState({ userCredentials });
  };

  handleUserRegister = async () => {
    const { userCredentials } = this.state;
    try {
      await Auth.signUp(userCredentials);
      this.setState({
        userRegistration: 'submitted',
        systemMessage:
          'Sign Up Success. Please Check your email for confirmation code'
      });
    } catch (e) {
      this.setState({ systemMessage: e.message });
    }
  };

  handleUserConfirm = async () => {
    const { userCredentials } = this.state;
    try {
      await Auth.confirmSignUp(userCredentials.username, userCredentials.code);
      this.setState({
        userRegistration: 'confirmed',
        systemMessage: 'Sweet! Great work. Now you can log in.'
      });
    } catch (e) {
      this.setState({ systemMessage: e.message });
    }
  };

  handleUserLogin = async () => {
    const { userCredentials } = this.state;
    try {
      await Auth.signIn(userCredentials.username, userCredentials.password);
      this.sessionCheck = false;
      this.setState({ systemMessage: 'Successfully Logged In' });
    } catch (e) {
      this.setState({ systemMessage: e.message });
    }
  };

  handleUserLogout = async () => {
    await Auth.signOut();
    this.sessionCheck = false;
    this.setState({ systemMessage: 'Logged Out.' });
  };

  handleErrorDismiss = () => {
    this.setState({ systemMessage: '' });
  };

  render() {
    const {
      userCredentials,
      user,
      systemMessage,
      userRegistration,
      loginStatus
    } = this.state;

    return (
      <div>
        <div>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>User Sign up</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {userRegistration === 'submitted' ? (
                <Card>
                  <CardHeader title="Confirm Code" />
                  <CardContent>
                    <TextField
                      id="code"
                      key="code"
                      name="code"
                      label="Confirmation Code"
                      onChange={this.handleUserCredentialsChange}
                      value={userCredentials.code}
                      fullWidth
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleUserConfirm}
                    >
                      Confirm
                    </Button>
                  </CardActions>
                </Card>
              ) : (
                <Card>
                  <CardHeader title="User Registration" />
                  <CardContent>
                    <TextField
                      id="email"
                      key="email"
                      name="username"
                      label="User Email"
                      onChange={this.handleUserCredentialsChange}
                      value={userCredentials.username}
                      fullWidth
                    />
                    <TextField
                      id="password"
                      key="password"
                      name="password"
                      type="password"
                      label="User Password"
                      onChange={this.handleUserCredentialsChange}
                      value={userCredentials.password}
                      fullWidth
                    />
                    <div>{JSON.stringify(user)}</div>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleUserRegister}
                    >
                      Create User
                    </Button>
                  </CardActions>
                </Card>
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {loginStatus ? 'User Logout' : 'User Login'}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {loginStatus ? (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleUserLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardHeader title="User Login" />
                  <CardContent>
                    <TextField
                      id="email"
                      key="email"
                      name="username"
                      label="User Email"
                      onChange={this.handleUserCredentialsChange}
                      value={userCredentials.username}
                      fullWidth
                    />
                    <TextField
                      id="password"
                      key="password"
                      name="password"
                      type="password"
                      label="User Password"
                      onChange={this.handleUserCredentialsChange}
                      value={userCredentials.password}
                      fullWidth
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleUserLogin}
                    >
                      Login
                    </Button>
                  </CardActions>
                </Card>
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Dialog open={Boolean(systemMessage)}>
            <DialogContent>{systemMessage}</DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleErrorDismiss}
              >
                Dismiss
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  setUserToken: PropTypes.func.isRequired
};

export default withStyles(style)(Login);
