import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Home from './home';
import Admin from './admin';
import getCommunityContext from '../communityContext';
import { wrapWithBreadcrumbs } from "../../utils/breadcrumbs";

class PageSwitcher extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path={`/community/${this.context.community.url}/panel/admin`} component={wrapWithBreadcrumbs(Admin)}/>
          <Route path={`/community/${this.context.community.url}/panel`} component={wrapWithBreadcrumbs(Home)}/>
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(PageSwitcher);