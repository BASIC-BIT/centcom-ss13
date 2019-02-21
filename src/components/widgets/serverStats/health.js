import React from 'react';
import {Icon, Statistic, Tabs, Row, Col} from "antd";

export default class Health extends React.Component {
  getHealthStatistic(value) {
    let icon;

    if(value === 'Online') {
      icon = (<Icon type="check-circle" theme="twoTone" twoToneColor="#22EE22" />);
    } else if(value === 'Offline') {
      icon = (<Icon type="exclamation-circle" theme="twoTone" twoToneColor="#EE2222" />);
    } else if(value === 'Unknown') {
      icon = (<Icon type="question-circle" theme="twoTone" twoToneColor="#CCCC55" />);
    } else {
      icon = (<Icon type="stop" theme="twoTone" twoToneColor="#EE2222" />);
    }

    return (
      <span>{icon} {value}</span>
    );
  }
  render() {
    return (
      <Tabs.TabPane
        {...this.props}
        className="server-stats-menu-item"
      >
        <Row gutter={20} type="flex" justify="space-between">
          <Col span={10}>
            <Statistic title="SS13 Server" value={"Online"} formatter={this.getHealthStatistic} />
          </Col>
          <Col span={10}>
            <Statistic title="CentCom Server" value={"Unknown"} formatter={this.getHealthStatistic} />
          </Col>
          <Col span={10}>
            <Statistic title="Server Reporter" value={"Offline"} formatter={this.getHealthStatistic} />
          </Col>
          <Col span={10}>
            <Statistic title="Database" value={"Error"} formatter={this.getHealthStatistic} />
          </Col>
        </Row>
      </Tabs.TabPane>
    );
  }
}