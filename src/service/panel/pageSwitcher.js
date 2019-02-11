import React from "react";
import { HashRouter as Router, Route, Switch, Link, withRouter } from "react-router-dom";
import {Breadcrumb} from "antd";

import Home from './home';
import Admin from './admin';
import getCommunityContext from "../../communityArea/communityContext";

const breadcrumbNameMap = {
  '/panel': 'Panel',
  '/panel/admin': 'Admin',
};

const BreadcrumbWrapper = withRouter((props) => {
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {breadcrumbNameMap[url]}
        </Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">CentCom</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);
  return (
    <React.Fragment>
      <Breadcrumb>
        {breadcrumbItems}
      </Breadcrumb>
      {props.children}
    </React.Fragment>
  );
});

function wrapWithBreadcrumbs(Component) {
  return (props) => (<BreadcrumbWrapper {...props}>
    <Component />
  </BreadcrumbWrapper>)
}

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