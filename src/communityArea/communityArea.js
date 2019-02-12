import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {Route, Switch, withRouter} from "react-router";
import SplashPage from "./splash";
import Panel from "./panel/panel";
import ErrorPage404 from "../error/ErrorPage404";
import getCommunityContext from './communityContext';
import servers from '../repositories/servers';


export default withRouter(class CommunityArea extends React.Component {
  static contextType = getCommunityContext();
  constructor(props) {
    super(props);
    this.state = {};
    this.updateCommunity(true);
  }

  updateCommunity(constructor = false) {
    if(this.props.match.params && this.props.match.params.communityUrl && (!this.state.community || (this.state.community && this.state.community.url !== this.props.match.params.communityUrl))) {
      const communityUrl = this.props.match.params.communityUrl;
      const community = servers.find(server => server.url === communityUrl);

      if(community) {
        if(constructor) {
          this.state = { community };
        } else {
          this.setState({
            community,
          });
        }
      }
    }
  }

  componentDidUpdate() {
    this.updateCommunity();
  }

  wrapComponentInProps(Component) {
    return (props) => (<Component
      {...props}
      community={this.state.community}
    />);
  }

  render() {
    const Provider = getCommunityContext().Provider;
    return (
      <Provider value={{
        community: this.state.community,
      }}>
        <Switch>
          <Route path={`/community/${this.state.community.url}/panel`} component={Panel}/>
          <Route exact path={`/community/${this.state.community.url}/`} component={SplashPage}/>
          <Route component={ErrorPage404}/>
        </Switch>
      </Provider>
    );
  }
});