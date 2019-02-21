import React from 'react';
import {Redirect, Route, Switch} from "react-router";
import ErrorPage404 from "./error/ErrorPage404";
import Panel from './panel/panel';
import Splash from './components/splash';
import getCommunityContext from "./utils/communityContext";
import DB from './brokers/serverBroker';
import LoadingIndicator from "./components/loadingIndicator";

const db = new DB();

export default class RootContainer extends React.Component {
  static contextType = getCommunityContext();

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
    };

    this.getData();
  }

  async getData() {
    try {
      const [servers, config] = await Promise.all([
        db.getServers(),
        db.getConfig(),
      ]);

      this.setState({
        servers,
        config,
        loading: false,
        error: false,
      });
    } catch (e) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  }

  render() {
    if (this.state.error) {
      return (<Redirect push to={`/404`}/>);
    }
    if(this.state.loading) {
      return (<LoadingIndicator center />);
    }

    const Provider = getCommunityContext().Provider;
    return (
      <Provider value={{
        servers: this.state.servers,
        config: this.state.config,
      }}>
        <Switch>
          <Route path="/panel" component={Panel}/>
          <Route exact path="/" component={Splash}/>
          <Route component={ErrorPage404}/>
        </Switch>
      </Provider>
    );
  }
}