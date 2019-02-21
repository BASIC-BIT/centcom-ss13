import React from 'react';
import {Layout, Menu, Icon,} from 'antd';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import getCommunityContext from '../../utils/communityContext';

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
        width={200}
      >
        <div className="logo" />
        <Menu theme="dark" selectedKeys={this.state.selectedKeys} mode="inline">
          <Menu.Item key={`/`}>
            <Link to={`/`}>
              <Icon type="desktop" />
              <span>Splash Page</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={`/panel`}>
            <Link to={`/panel`}>
              <Icon type="home" />
              <span>{this.context.config.community_name} Home</span>
            </Link>
          </Menu.Item>
          {/*{this.context.community.serverLink && <Menu.Item key="joinserver">*/}
            {/*<a href={this.context.community.serverLink}>*/}
              {/*<Icon type="play-circle" />*/}
              {/*<span>Join Server!</span>*/}
            {/*</a>*/}
          {/*</Menu.Item>}*/}
          {this.context.config.github_url && <Menu.Item key="github">
            <a href={this.context.config.github_url}>
              <Icon type="github" />
              <span>Github</span>
            </a>
          </Menu.Item>}
          {this.context.config.forums_url && <Menu.Item key="forums">
            <a href={this.context.config.forums_url}>
              <Icon type="layout" />
              <span>Forums</span>
            </a>
          </Menu.Item>}
          {this.context.config.wiki_url && <Menu.Item key="wiki">
            <a href={this.context.config.wiki_url}>
              <Icon type="read" />
              <span>Wiki</span>
            </a>
          </Menu.Item>}
          <SubMenu
            key="admin_menu"
            title={<span><Icon type="pie-chart" /><span>Admin</span></span>}
          >
            <Menu.Item key={`/panel/admin`}>
              <Link to={`/panel/admin`}>
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
