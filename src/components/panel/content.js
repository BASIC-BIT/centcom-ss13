import React from 'react';
import {Layout, DatePicker, Breadcrumb} from 'antd';
import {Link} from "react-router-dom";
import PageSwitcher from "./pageSwitcher";

const {
  Content,
} = Layout;

const style = {
  color: '#333',
  padding: '14px',
  minHeight: 'unset',
};

export default class PageContent extends React.Component {
  render() {
    return (
      <Content style={style}>
        <PageSwitcher/>
      </Content>
    );
  }
}