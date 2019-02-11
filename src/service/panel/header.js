import React from 'react';
import { Layout, DatePicker } from 'antd';

const {
  Header,
} = Layout;

const style = {
  color: '#EEE',
};
const titleStyle = {
  color: '#EEE',
};

export default class PageHeader extends React.Component {
  render() {
    return (
      <Header style={style}>
        <h2 style={titleStyle}>CentCom - A Space Station 13 Management System in the Cloud</h2>
      </Header>
    );
  }
}