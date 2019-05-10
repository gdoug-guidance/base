import React, { Component } from 'react';
import { connect } from 'react-redux';
import Api from '../components/Api/Api';

type Props = {};

export class ApiPageContainer extends Component<Props> {
  props: Props;

  render() {
    return <Api />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Api);
