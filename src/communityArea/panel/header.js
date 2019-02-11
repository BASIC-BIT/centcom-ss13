import React from 'react';
import { Layout, DatePicker } from 'antd';
import getCommunityContext from '../communityContext';

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
  static contextType = getCommunityContext();
  render() {
    return (
      <Header style={style}>
        <h2 style={titleStyle}>{this.context.community.name}: The Space Station 13 Experience</h2>
      </Header>
    );
  }
}