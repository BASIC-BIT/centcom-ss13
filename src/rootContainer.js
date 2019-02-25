import React from 'react';
import {Redirect, Route, Switch} from "react-router";
import { message } from 'antd';
import ErrorPage404 from "./error/ErrorPage404";
import Panel from './components/panel/panel';
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

  async wrapInCatchDefault(key, func, defaultValue) {
    try {
      return await func();
    } catch (e) {
      message.error(`Error fetching ${key}.`);
      console.log(e);
      return defaultValue;
    }
  }

  async getData() {
    try {
      const [servers, config, books] = await Promise.all([
        this.wrapInCatchDefault('servers', db.getServers.bind(db), []),
        this.wrapInCatchDefault('config', db.getConfig.bind(db), {}),
        this.wrapInCatchDefault('books', db.getBooks.bind(db), [{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]),
      ]);

      this.setState({
        servers,
        config,
        books,
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
    // if(this.state.loading) {
    //   return (<LoadingIndicator center />);
    // }

    const Provider = getCommunityContext().Provider;
    return (
      <Provider value={{
        servers: this.state.servers,
        config: this.state.config,
        loading: this.state.loading,
        books: this.state.books,
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