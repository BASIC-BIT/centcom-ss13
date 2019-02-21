import React from 'react';
import {Button, Col, Card, Row, Divider, Spin} from "antd";
import getCommunityContext from "../../utils/communityContext";
import {Link} from "react-router-dom";

const panelCardStyle = {
  backgroundColor: 'transparent',
  padding: '10px',
  margin: '10px',
};

export default class Intro extends React.Component {
  static contextType = getCommunityContext();

  getDefaultWidgetColProps() {
    return {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      xxl: 24,
      style: {
        marginTop: '10px',
      },
    };
  }

  getIntroColProps() {
    return {
      xs: 24,
      sm: 21,
      md: 18,
      lg: 15,
      xl: 13,
      xxl: 10,
    };
  }

  getContent() {
    if (this.context.loading) {
      return (
        <Spin><div className="panelIntro"></div></Spin>
      );
    }

    return (
      <div className="panelIntro">
        <h1 style={{ fontSize: '35px' }}>{this.context.config.panel_home_intro_text}</h1>
        <a href={this.context.servers.find(server => server.name === 'Main').url}>
          <Button type="primary" style={{ margin: '10px' }}>Join Server!</Button>
        </a>
      </div>
    );
  }

  render() {
    return (
      <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
        <Row type="flex" justify="center" style={{ textAlign: 'center' }}>
          <Col className="gutter-row" {...this.getIntroColProps()}>
            {this.getContent()}
          </Col>
        </Row>
        <Divider/>
      </Col>
    );
  }
};
