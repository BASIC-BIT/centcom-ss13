import React from 'react';
import {Layout, DatePicker, Breadcrumb} from 'antd';
import {Link} from "react-router-dom";
import PageSwitcher from "./pageSwitcher";
import getCommunityContext from '../../utils/communityContext';

const {
  Content,
} = Layout;

const style = {
  color: '#333',
  padding: '14px',
};

export default class PageContent extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <Content style={style}>
        <PageSwitcher/>
      </Content>
    );
  }
}