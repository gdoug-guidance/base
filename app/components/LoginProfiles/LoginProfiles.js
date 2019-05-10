import React, { Component } from 'react';
import Amplify from 'aws-amplify';
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
import { CardActions, Dialog, DialogContent } from '@material-ui/core';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import configurations from '../../constants/configurations';

type Props = {};

const style = {};

class LoginProfiles extends Component<Props> {
  props: Props;

  state = {
    auth: {
      region: configurations.cognito.region,
      userPool: configurations.cognito.userPool,
      identityPool: configurations.cognito.identityPool,
      appClientId: configurations.cognito.appClientId
    },
    settingsSaved: false,
    systemMessage: ''
  };

  componentDidMount() {
    this.hydrateState();
  }

  componentDidUpdate() {
    this.hydrateState();
    this.checkDeferredCommands();
  }

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
    const { auth, settingsSaved } = this.state;
    if (
      !this.amplifyConfigured &&
      auth.appClientId &&
      auth.identityPool &&
      auth.region &&
      auth.userPool &&
      settingsSaved
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
  };

  handleCognitoChange = event => {
    const { auth } = this.state;
    auth[event.target.name] = event.target.value;
    this.setState({ auth, settingsSaved: false });
  };

  handleCognitoSave = () => {
    this.setState({ settingsSaved: true });
  };

  handleErrorDismiss = () => {
    this.setState({ systemMessage: '' });
  };

  render() {
    const { auth, systemMessage } = this.state;

    return (
      <div>
        <div>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Cognito Settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Card>
                <CardHeader title="Settings" />
                <CardContent>
                  <TextField
                    id="region"
                    key="region"
                    name="region"
                    label="AWS Region"
                    onChange={this.handleCognitoChange}
                    value={auth.region}
                    fullWidth
                  />
                  <TextField
                    id="userPool"
                    key="userPool"
                    name="userPool"
                    label="Cognito User Pool ID"
                    onChange={this.handleCognitoChange}
                    value={auth.userPool}
                    fullWidth
                  />
                  <TextField
                    id="identityPool"
                    key="identityPool"
                    name="identityPool"
                    label="Cognito Identity Pool ID"
                    onChange={this.handleCognitoChange}
                    value={auth.identityPool}
                    fullWidth
                  />
                  <TextField
                    id="appClientId"
                    key="appClientId"
                    name="appClientId"
                    label="Cognito App Client ID"
                    onChange={this.handleCognitoChange}
                    value={auth.appClientId}
                    fullWidth
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleCognitoSave}
                  >
                    Save Settings
                  </Button>
                </CardActions>
              </Card>
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

LoginProfiles.propTypes = {};

export default withStyles(style)(LoginProfiles);
