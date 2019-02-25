import React from 'react';
import {Redirect, Route, Switch} from "react-router";
import { message } from 'antd';
import ErrorPage404 from "./error/ErrorPage404";
import Panel from './components/panel/panel';
import Splash from './components/splash';
import getCommunityContext from "./utils/communityContext";
import DB from './brokers/serverBroker';

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

  async getConfig() {
    this.setState({ config: undefined });
    const config = await this.wrapInCatchDefault('config', db.getConfig.bind(db), {});
    this.setState({ config });
    return config;
  }

  async getBooks() {
    this.setState({ books: undefined });
    const books = await this.wrapInCatchDefault('books', db.getBooks.bind(db), [{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]);
    this.setState({ books });
    return books;
  }

  async getServers() {
    this.setState({ servers: undefined });
    const servers = await this.wrapInCatchDefault('servers', db.getServers.bind(db), []);
    this.setState({ servers });
    return servers;
  }

  async getData() {
    try {
      const [servers, config, books] = await Promise.all([
        this.getServers(),
        this.getConfig(),
        this.getBooks(),
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