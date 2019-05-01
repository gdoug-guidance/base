import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginProfiles from '../components/LoginProfiles/LoginProfiles';

type Props = {};

export class LoginProfilesPageContainer extends Component<Props> {
  props: Props;

  render() {
    return <LoginProfiles />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginProfiles);
