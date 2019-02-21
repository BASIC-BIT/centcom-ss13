import React from 'react';
import {Row, Col, Card, Icon, Statistic} from "antd";
import getCommunityContext from "../../utils/communityContext";

const panelCardStyle = {
  backgroundColor: 'transparent',
  padding: '10px',
  margin: '10px',
};

export default class Statistics extends React.Component {
  static contextType = getCommunityContext();

  getDefaultWidgetColProps() {
    return {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
      xxl: 8,
    };
  }

  render() {
    return (
      <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
        <Card title="Statistics" style={panelCardStyle}>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={10}>
              <Statistic prefix={<Icon type="team" />} title="Players" value={1337} />
            </Col>
            <Col span={10}>
              <Statistic prefix={<Icon type="rocket" />} title="Peak Players" value={9001} />
            </Col>
            <Col span={10}>
              <Statistic prefix={<Icon type="eye" />} title="Admins Online" value={3} />
            </Col>
            <Col span={10}>
              <Statistic prefix={<Icon type="solution" />} title="Forum Posts" value={93782} />
            </Col>
          </Row>
        </Card>
      </Col>
    )
  }
}