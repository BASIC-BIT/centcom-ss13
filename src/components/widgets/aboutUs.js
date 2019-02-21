import React from 'react';
import {Button, Row, Col, Card, Divider, Icon} from "antd";
import getCommunityContext from "../../utils/communityContext";
import TwitterIcon from "../icons/twitterIcon";
import SteamIcon from "../icons/steamIcon";
import DiscordIcon from "../icons/discordIcon";

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

const iconLinkStyle = {
  padding: '0px 10px',
  height: '100%',
};

export default class AboutUs extends React.Component {
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
        <Card title="About Us" style={panelCardStyle}>
          Put some stuff here!<br />
          <br />
          Current Council Members:<br />
          Xantam, KTLwjec, SLRaptor, Yogurtshrimp69, zxmongoose<br />
          <br />
          Host: Xantam<br />
          Head Coders: ThatLing, Nichlas0010<br />
          <Divider />
          <Row type="flex" justify="space-between" style={{ textAlign: 'center' }}>
            <Col className="gutter-row" span={8}><a href={this.context.config.twitter_url} style={iconLinkStyle}><TwitterIcon /></a></Col>
            <Col className="gutter-row" span={8}><a href={this.context.config.steam_url} style={iconLinkStyle}><SteamIcon /></a></Col>
            <Col className="gutter-row" span={8}><a href={this.context.config.discord_url} style={iconLinkStyle}><DiscordIcon /></a></Col>
          </Row>
        </Card>
      </Col>
    )
  }
}