import React from 'react';
import {Icon, Statistic, Tabs, Row, Col, Skeleton} from "antd";
import getCommunityContext from "../../../utils/communityContext";

export default class LastRound extends React.Component {
  static contextType = getCommunityContext();
  getContent() {
    if(this.context.loading) {
      return (<Skeleton active />);
    }

    return (
      <React.Fragment>
        <Row gutter={20} type="flex" justify="space-between">
          <Col span={10}>
            <Statistic title="Round Type" value={"Nuke Ops"} />
          </Col>
          <Col span={10}>
            <Statistic prefix="#" title="Round" value={23622} />
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
      </React.Fragment>
    );
  }

  render() {
    return (
      <Tabs.TabPane
        {...this.props}
        className="server-stats-menu-item"
      >
        {this.getContent()}
      </Tabs.TabPane>
    );
  }
}