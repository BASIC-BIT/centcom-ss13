import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Home from './home';
import Admin from './admin';
import { wrapWithBreadcrumbs } from "../../utils/breadcrumbs";
import ErrorPage404 from "../../error/ErrorPage404";
import BookEditor from "./bookEditor";
import PermissionsEditor from "./permissionsEditor";

class PageSwitcher extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path={`/panel/admin/book`} component={wrapWithBreadcrumbs(BookEditor)}/>
          <Route path={`/panel/admin/permissions`} component={wrapWithBreadcrumbs(PermissionsEditor)}/>
          <Route path={`/panel/admin`} component={wrapWithBreadcrumbs(Admin)}/>
          <Route path={`/panel`} component={wrapWithBreadcrumbs(Home)}/>
          <Route component={ErrorPage404}/>
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(PageSwitcher);