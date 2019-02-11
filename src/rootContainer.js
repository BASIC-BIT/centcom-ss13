import React from 'react';
import {Route, Switch} from "react-router";
import CommunityArea from "./communityArea/communityArea";
import ErrorPage404 from "./error/ErrorPage404";
import Splash from "./service/splash";
import Panel from "./service/panel/panel";

export default class RootContainer extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/community/:communityUrl" component={CommunityArea}/>
        <Route path="/panel" component={Panel}/>
        <Route exact path="/" component={Splash}/>
        <Route component={ErrorPage404}/>
      </Switch>
    )
  }
}