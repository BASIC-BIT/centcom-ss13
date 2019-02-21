import React from 'react';
import {Col, Card, Tabs, Icon} from "antd";
import getCommunityContext from "../../utils/communityContext";
import Info from "./serverStats/info";
import LastRound from "./serverStats/lastRound";
import Health from "./serverStats/health";

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
            <Info tab={<span><Icon type="info-circle" />Info</span>} key="info" />
            <LastRound
              tab={<span><Icon type="arrow-left" />Last Round</span>}
              key="lastRound"
            />
            <Health
              tab={<span><Icon type="medicine-box" />Health</span>}
              key="health"
            />
          </Tabs>
        </Card>
      </Col>
    )
  }
}