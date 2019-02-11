import React from 'react';
import { Layout } from 'antd';
import getCommunityContext from '../communityContext';

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
      <Footer style={style}>Beta version - Please use our bug tracker to report issues.</Footer>
    );
  }
}