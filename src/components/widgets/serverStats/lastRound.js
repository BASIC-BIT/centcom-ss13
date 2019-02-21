import React from 'react';
import {Icon, Statistic, Tabs, Row, Col} from "antd";

export default class LastRound extends React.Component {
  render() {
    return (
      <Tabs.TabPane
        {...this.props}
        className="server-stats-menu-item"
      >
        <Row gutter={20} type="flex" justify="space-between">
          <Col span={10}>
            <Statistic prefix={<Icon type="robot" />} title="Round Type" value={"Nuke Ops"} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="rocket" />} title="Round #" value={23622} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="hourglass" />} title="Round Length" value={'1:23:09'} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="frown" />} title="Deaths" value={23} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="warning" />} title="Antags" value={3} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="smile" />} title="Escapees" value={14} />
          </Col>
          <Col span={10}>
            <Statistic prefix={<Icon type="trophy" />} title="Green Texts" value={14} />
          </Col>
        </Row>
      </Tabs.TabPane>
    );
  }
}