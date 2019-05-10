import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserTokenAction } from '../actions/user';
import Login from '../components/Login/Login';

type Props = {};

export class LoginPageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Login />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  setUserToken: token => {
    dispatch(setUserTokenAction(token));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
