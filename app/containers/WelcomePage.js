// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAction } from '../actions/user';
import Welcome from '../components/Welcome/Welcome';

type Props = {};

export class WelcomePageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Welcome />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  setUser: name => {
    dispatch(setUserAction(name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
