import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
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

class Api extends Component<Props> {
  props: Props;

  state = {
    systemMessage: '',
    publicResponse: '',
    privateResponse: ''
  };

  componentDidMount() {
    this.hydrateState();
  }

  componentDidUpdate() {
    this.hydrateState();
    this.checkDeferredCommands();
  }

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

  hydrateState = () => {};

  handlePublicCall = () => {
    this.setState({
      systemMessage: 'Contacting the API... ',
      publicResponse: ''
    });
    fetch(`${configurations.api.endpoint}/hello`)
      .then(res => res.json())
      .then(
        result => this.setState({ publicResponse: result, systemMessage: '' }),
        error => {
          this.setState({ publicResponse: error, systemMessage: '' });
        }
      )
      .catch(error =>
        this.setState({ publicResponse: error, systemMessage: '' })
      );
  };

  handlePrivateCallWithoutToken = () => {
    this.setState({
      systemMessage: 'Contacting the API... ',
      privateResponse: ''
    });
    fetch(`${configurations.api.endpoint}/private`)
      .then(res => res.json())
      .then(
        result => this.setState({ privateResponse: result, systemMessage: '' }),
        error => {
          this.setState({ privateResponse: error, systemMessage: '' });
        }
      )
      .catch(error =>
        this.setState({ privateResponse: error, systemMessage: '' })
      );
  };

  handlePrivateCallWithToken = () => {
    const { user } = this.props;
    this.setState({
      systemMessage: 'Contacting the API... ',
      privateResponse: ''
    });
    fetch(`${configurations.api.endpoint}/private`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(res => res.json())
      .then(
        result => this.setState({ privateResponse: result, systemMessage: '' }),
        error => {
          this.setState({ privateResponse: error, systemMessage: '' });
        }
      )
      .catch(error =>
        this.setState({ privateResponse: error, systemMessage: '' })
      );
  };

  handleErrorDismiss = () => {
    this.setState({ systemMessage: '' });
  };

  render() {
    const { systemMessage, publicResponse, privateResponse } = this.state;

    return (
      <div>
        <div>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Public Endpoint</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Card>
                <CardHeader title="Call Public Endpoint" />
                <CardContent>
                  <pre>{JSON.stringify(publicResponse, null, 2)}</pre>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handlePublicCall}
                  >
                    Make Call
                  </Button>
                </CardActions>
              </Card>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Private Endpoint</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Card>
                <CardHeader title="Call Private Endpoint" />
                <CardContent>
                  <pre>{JSON.stringify(privateResponse, null, 2)}</pre>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handlePrivateCallWithToken}
                  >
                    Make Call w/ Token
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handlePrivateCallWithoutToken}
                  >
                    Make Call w/out Token
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

Api.propTypes = {
  user: PropTypes.any.isRequired
};

export default withStyles(style)(Api);
