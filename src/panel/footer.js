import React from 'react';
import { Layout } from 'antd';
import getCommunityContext from '../utils/communityContext';

const {
  Footer,
} = Layout;

const style = {
  color: '#333',
};

export default class PageFooter extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <Footer style={style}>{this.context.config.footer_text}</Footer>
    );
  }
}