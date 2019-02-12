import React from 'react';
import {Layout, Menu, Icon,} from 'antd';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import getCommunityContext from '../communityContext';

const {
  Sider,
} = Layout;

const SubMenu = Menu.SubMenu;

const style = {
  color: '#EEE',
};

export default withRouter(class PageSidebar extends React.Component {
  static contextType = getCommunityContext();
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: [this.props.location.pathname],
    };
  }

  onCollapse(collapsed) {
    this.setState({ collapsed });
  };

  componentDidUpdate(prevProps) {
    if(this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ selectedKeys: [this.props.location.pathname] });
    }
  }

  render() {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse.bind(this)}
        style={style}
        width={280}
      >
        <div className="logo" />
        <Menu theme="dark" selectedKeys={this.state.selectedKeys} mode="inline">
          <Menu.Item key={`/community/${this.context.community.url}`}>
            <Link to={`/community/${this.context.community.url}`}>
              <Icon type="desktop" />
              <span>Splash Page</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={`/community/${this.context.community.url}/panel`}>
            <Link to={`/community/${this.context.community.url}/panel`}>
              <Icon type="home" />
              <span>{this.context.community.name} Home</span>
            </Link>
          </Menu.Item>
          {this.context.community.serverLink && <Menu.Item key="joinserver">
            <a href={this.context.community.serverLink}>
              <Icon type="play-circle" />
              <span>Join Server!</span>
            </a>
          </Menu.Item>}
          {this.context.community.github && <Menu.Item key="github">
            <a href={this.context.community.github}>
              <Icon type="github" />
              <span>Github</span>
            </a>
          </Menu.Item>}
          {this.context.community.forums && <Menu.Item key="forums">
            <a href={this.context.community.forums}>
              <Icon type="layout" />
              <span>Forums</span>
            </a>
          </Menu.Item>}
          {this.context.community.wiki && <Menu.Item key="wiki">
            <a href={this.context.community.wiki}>
              <Icon type="read" />
              <span>Wiki</span>
            </a>
          </Menu.Item>}
          <SubMenu
            key="admin_menu"
            title={<span><Icon type="pie-chart" /><span>Admin</span></span>}
          >
            <Menu.Item key={`/community/${this.context.community.url}/panel/admin`}>
              <Link to={`/community/${this.context.community.url}/panel/admin`}>
                <Icon type="dashboard" />
                <span>Dashboard</span>
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
});
