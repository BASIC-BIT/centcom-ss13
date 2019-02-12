import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Home from './home';
import Admin from './admin';
import getCommunityContext from '../communityContext';
import { wrapWithBreadcrumbs } from "../../utils/breadcrumbs";
import ErrorPage404 from "../../error/ErrorPage404";

class PageSwitcher extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path={`/community/${this.context.community.url}/panel/admin`} component={wrapWithBreadcrumbs(Admin)}/>
          <Route exact path={`/community/${this.context.community.url}/panel`} component={wrapWithBreadcrumbs(Home)}/>
          <Route component={ErrorPage404}/>
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(PageSwitcher);