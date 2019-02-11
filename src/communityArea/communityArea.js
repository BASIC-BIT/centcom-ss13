import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {Route, Switch, withRouter} from "react-router";
import SplashPage from "./splash";
import Panel from "./panel/panel";
import ErrorPage404 from "../error/ErrorPage404";
import getCommunityContext from './communityContext';

const urlNameMap = {
  yogstation: 'Yogstation',
  st13: 'Startrek 13'
};

export default withRouter(class CommunityArea extends React.Component {
  static contextType = getCommunityContext();
  constructor(props) {
    super(props);
    this.state = {};
    if(props.match.params && props.match.params.communityUrl) {
      const communityUrl = props.match.params.communityUrl;
      const communityName = urlNameMap[communityUrl];

      if(communityName) {
        this.state = {
          communityUrl,
          communityName,
        };
      }
    }
  }

  componentDidUpdate() {
    console.log(this.props);
    if(this.props.match.params && this.props.match.params.communityUrl && this.state.communityUrl !== this.props.match.params.communityUrl) {
      const communityUrl = this.props.match.params.communityUrl;
      const communityName = urlNameMap[communityUrl];

      if(communityName) {
        this.setState({
          communityUrl,
          communityName,
        });
      }
    }
  }

  wrapComponentInProps(Component) {
    return (props) => (<Component
      {...props}
      community={{
        url: this.state.communityUrl,
        name: this.state.communityName,
      }}
    />);
  }

  render() {
    const Provider = getCommunityContext().Provider;
    return (
      <Provider value={{
        community: {
          url: this.state.communityUrl,
          name: this.state.communityName,
        }
      }}>
        <Switch>
          <Route path={`/community/${this.state.communityUrl}/panel`} component={Panel}/>
          <Route exact path={`/community/${this.state.communityUrl}/`} component={SplashPage}/>
          <Route component={ErrorPage404}/>
        </Switch>
      </Provider>
    );
  }
});