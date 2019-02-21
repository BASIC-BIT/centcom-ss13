import React from 'react';
import { Layout, DatePicker } from 'antd';
import getCommunityContext from '../utils/communityContext';

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
    const sloganText = this.context.community.slogan || 'The Space Station 13 Experience';
    return (
      <Header style={style}>
        <h2 style={titleStyle}>{this.context.community.name}: {sloganText}</h2>
      </Header>
    );
  }
}