import React from 'react';

require('@babel/polyfill');

import getCommunityContext from '../../utils/communityContext';
import DB from '../../brokers/serverBroker';
import {Button, Table, Row, Col, Icon, Tabs, Card, Statistic} from "antd";

const db = new DB();

const tableStyle = {
  minWidth: '200px',
};

const containerStyle = {
  minWidth: '300px',
};

const panelCardStyle = {
  backgroundColor: 'transparent',
  padding: '10px',
  margin: '10px',
};

const followButtonStyle = {
  width: '90%',
  margin: '0 5%',
  padding: '0 auto',
};
export default class Admin extends React.Component {
  static contextType = getCommunityContext();

  state = {
    current: 'info',
  };

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
    const serverListColumns = [
      {
        title: '',
        key: 'name',
        render: (text, server) => (
          <span>
            <h2 style={{ margin: 'auto' }}>{server.name}</h2>
          </span>
        ),
      },
      {
        title: '',
        key: 'joinserver',
        render: (text, server) => (
          <span>
            <a href={server.url}><Button type="primary">Join!</Button></a>
          </span>
        ),
      },
    ];

    return (
      <div style={containerStyle}>
        <Row gutter={20} type="flex" justify="space-between">
          <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
            <Card title="Servers" style={panelCardStyle}>
              <Table
                showHeader={false}
                style={tableStyle}
                dataSource={this.context.servers}
                columns={serverListColumns}
                pagination={false}
              />
            </Card>
          </Col>
          <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
            <Card title="Server Stats" style={panelCardStyle}>
              <Tabs
                type="card"
                className="server-stats-menu"
              >
                <Tabs.TabPane
                  tab={<span><Icon type="info-circle" />Info</span>}
                  key="info"
                  className="server-stats-menu-item"
                >
                  It's uh, up!
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={<span><Icon type="arrow-left" />Last Round</span>}
                  key="lastRound"
                  className="server-stats-menu-item"
                >
                  It was a round!
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={<span><Icon type="medicine-box" />Health</span>}
                  key="health"
                  className="server-stats-menu-item"
                >
                  What am I, a doctor or a moon-shuttle conductor?
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
            <Card title="About Us" style={panelCardStyle}>
              Put some stuff here!<br />
              <br />
              Current Council Members:<br />
              Xantam, KTLwjec, SLRaptor, Yogurtshrimp69, zxmongoose<br />
              <br />
              Host: Xantam<br />
              Head Coders: ThatLing, Nichlas0010
            </Card>
          </Col>
          <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
            <Card title="Follow Us!" style={panelCardStyle}>
              <Row type="flex" justify="space-between">
                <Col className="gutter-row" span={8}><Button style={followButtonStyle}>Twitter</Button></Col>
                <Col className="gutter-row" span={8}><Button style={followButtonStyle}>Steam</Button></Col>
                <Col className="gutter-row" span={8}><Button style={followButtonStyle}>Discord</Button></Col>
              </Row>
            </Card>
          </Col>
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
        </Row>
      </div>
    )
  }
}