import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Home from './home';
import Admin from './admin';
import { wrapWithBreadcrumbs } from "../../utils/breadcrumbs";

class PageSwitcher extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path={`/panel/admin`} component={wrapWithBreadcrumbs(Admin)}/>
          <Route path={`/panel`} component={wrapWithBreadcrumbs(Home)}/>
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(PageSwitcher);