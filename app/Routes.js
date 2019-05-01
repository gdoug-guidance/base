/* eslint flowtype-errors/show-errors: 0 */
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { withRouter } from 'react-router-dom';
import routes from './constants/routes';
import packageJson from './package';
import AppContainer from './containers/App';
import HomePage from './containers/HomePage';
import WelcomePage from './containers/WelcomePage';
import SettingsPage from './containers/SettingsPage';
import HelpPage from './containers/HelpPage';
import styles from './Routes.css';
import BottomBar from './components/Navgation/BottomBar';
import LoginProfilesPage from './containers/LoginProfilesPage';

class Routes extends Component<Props> {
  render() {
    const { location } = this.props;
    console.log(location.pathname);
    return (
      <AppContainer>
        <div className={styles.flex}>
          <Switch>
            <Route path={routes.HOME} component={HomePage} exact />
            <Route path={routes.WELCOME} component={WelcomePage} exact />
            <Route path={routes.SETTINGS} component={SettingsPage} exact />
            <Route path={routes.HELP} component={HelpPage} exact />
            <Route
              path={routes.LOGIN_PROFILES}
              component={LoginProfilesPage}
              exact
            />
          </Switch>
        </div>
        <div className={styles.copyright}>
          Copyright &copy; 2019 {packageJson.author.name} - Version{' '}
          {packageJson.version}
        </div>
        <BottomBar />
      </AppContainer>
    );
  }
}

export default withRouter(Routes);
