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
        <h2 style={titleStyle}>YogStation: The Space Station 13 Experience</h2>
      </Header>
    );
  }
}