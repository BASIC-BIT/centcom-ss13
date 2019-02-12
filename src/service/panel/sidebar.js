import React from 'react';
import {Layout, Menu, Icon,} from 'antd';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";

const {
  Sider,
} = Layout;

const SubMenu = Menu.SubMenu;

const style = {
  color: '#EEE',
};

export default withRouter(class PageSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: [this.props.location.pathname],
    };
  }

  onCollapse(collapsed) {
    console.log(collapsed);
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
      >
        <div className="logo" />
        <Menu theme="dark" selectedKeys={this.state.selectedKeys} mode="inline">
          <Menu.Item key="/">
            <Link to="/">
              <Icon type="desktop" />
              <span>Splash Page</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/panel">
            <Link to="/panel">
              <Icon type="cloud" />
              <span>Panel Home</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="github">
            <a href="https://github.com/BASIC-BIT/centcom-ss13">
              <Icon type="github" />
              <span>Github</span>
            </a>
          </Menu.Item>
          <SubMenu
            key="admin_menu"
            title={<span><Icon type="pie-chart" /><span>Admin</span></span>}
          >
            <Menu.Item key="/panel/admin">
              <Link to="/panel/admin">Home</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
});
