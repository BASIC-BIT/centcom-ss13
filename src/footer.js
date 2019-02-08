import React from 'react';
import { Layout } from 'antd';

const {
  Footer,
} = Layout;

const style = {
  color: '#333',
};

export default class PageFooter extends React.Component {
  render() {
    return (
      <Footer style={style}>Beta version - Please use our bug tracker to report issues.</Footer>
    );
  }
}