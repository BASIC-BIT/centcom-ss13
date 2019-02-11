import React from "react";
import { HashRouter as Router, Route, Switch, Link, withRouter } from "react-router-dom";
import {Breadcrumb} from "antd";

import Home from './home';
import Admin from './admin';
import getCommunityContext from '../communityContext';

class BreadcrumbWrapper extends React.Component {
  static contextType = getCommunityContext();

  getBreadcrumbNameMap() {
    return {
      [`/community/${this.context.community.url}/panel`]: `${this.context.community.name} Home`,
      [`/community/${this.context.community.url}/panel/admin`]: 'Admin Panel',
    };
  }

  render() {
    const { location } = this.props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const breadcrumbName = this.getBreadcrumbNameMap()[url];

      if(!breadcrumbName) {
        return null;
      }

      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {breadcrumbName}
          </Link>
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home">
        <Link to="/panel">CentCom Panel</Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
    return (
      <React.Fragment>
        <Breadcrumb>
          {breadcrumbItems}
        </Breadcrumb>
        {this.props.children}
      </React.Fragment>
    );
  }
}

class BreadcrumbWrappedComponent extends React.Component {
  render() {
    const BreadcrumbWrapperWithRouter = withRouter(BreadcrumbWrapper);
    return (
      <BreadcrumbWrapperWithRouter {...this.props}>
        {this.props.children}
      </BreadcrumbWrapperWithRouter>
    );
  }
}

function wrapWithBreadcrumbs(Component) {
  return () => (
    <BreadcrumbWrappedComponent>
      <Component />
    </BreadcrumbWrappedComponent>
  )
}

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