import getCommunityContext from "../communityArea/communityContext";
import React from "react";
import {Link, withRouter} from "react-router-dom";
import {Breadcrumb} from "antd";

const breadcrumbStyle = {
  paddingBottom: '20px',
};

class BreadcrumbWrapper extends React.Component {
  static contextType = getCommunityContext();

  getBreadcrumbNameMap() {
    let breadcrumbNameMap = {};
    if(this.context && this.context.community) {
      breadcrumbNameMap = {
        ...breadcrumbNameMap,
        [`/community/${this.context.community.url}/panel`]: `${this.context.community.name} Home`,
        [`/community/${this.context.community.url}/panel/admin`]: 'Admin Panel',
      };
    }

    breadcrumbNameMap = {
      ...breadcrumbNameMap,
      '/panel': 'CentCom Panel',
      '/panel/admin': 'Admin',
    };

    return breadcrumbNameMap;
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
    let breadcrumbItems = extraBreadcrumbItems;
    if(this.context && this.context.community) {
      breadcrumbItems = [
        ...[(
          <Breadcrumb.Item key="home">
            <Link to="/panel">CentCom Panel</Link>
          </Breadcrumb.Item>
        )],
        ...breadcrumbItems,
      ];
    }
    return (
      <React.Fragment>
        <div style={breadcrumbStyle}>
          <Breadcrumb>
            {breadcrumbItems}
          </Breadcrumb>
        </div>
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

export { wrapWithBreadcrumbs };