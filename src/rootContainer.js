import React from 'react';
import {Route, Switch} from "react-router";
import Panel from "./pages/panel/panel";
import SplashPage from "./pages/splash";

export default class RootContainer extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/panel" component={Panel}/>
        <Route exact path="/" component={SplashPage}/>
      </Switch>
    )
  }
}