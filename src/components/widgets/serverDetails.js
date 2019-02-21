import React from 'react';
import {Col, Card, Tabs, Icon} from "antd";
import getCommunityContext from "../../utils/communityContext";

const panelCardStyle = {
  backgroundColor: 'transparent',
  padding: '10px',
  margin: '10px',
};

export default class ServerDetails extends React.Component {
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
    )
  }
}