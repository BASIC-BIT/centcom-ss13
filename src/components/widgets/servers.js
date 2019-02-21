import React from 'react';
import {Table, Col, Card, Button, Spin} from "antd";
import getCommunityContext from "../../utils/communityContext";

const panelCardStyle = {
  backgroundColor: 'transparent',
  padding: '10px',
  margin: '10px',
};

const tableStyle = {
  minWidth: '200px',
};

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

export default class Servers extends React.Component {
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
        <Spin spinning={this.context.loading}>
          <Card title="Servers" style={panelCardStyle}>
            <Table
              showHeader={false}
              style={tableStyle}
              dataSource={this.context.servers || []}
              columns={serverListColumns}
              pagination={false}
            />
          </Card>
        </Spin>
      </Col>
    )
  }
}