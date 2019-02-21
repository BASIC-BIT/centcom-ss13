import React from 'react';
import {Layout, Spin} from 'antd';
import getCommunityContext from '../../utils/communityContext';

const {
  Footer,
} = Layout;

const style = {
  color: '#333',
};

export default class PageFooter extends React.Component {
  static contextType = getCommunityContext();
  render() {
    if(this.context.loading) {
      return (<Footer style={style}><Spin /></Footer>);
    }

    return (
      <Footer style={style}>{this.context.config.footer_text}</Footer>
    );
  }
}