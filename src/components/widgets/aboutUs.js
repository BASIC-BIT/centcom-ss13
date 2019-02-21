import React from 'react';
import {Button, Row, Col, Card, Divider, Icon, Spin, Skeleton} from "antd";
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

  wrapWithLinkIfExists(Component, configKey) {
    if(this.context.config && this.context.config[configKey]) {
     return (<a href={this.context.config[configKey]} style={iconLinkStyle}><Component /></a>)
    }

    return <Component />
  }

  getFollowLinks() {
    return (
      <React.Fragment>
        <Col className="gutter-row" span={8}>{this.wrapWithLinkIfExists(TwitterIcon, 'twitter_url')}</Col>
        <Col className="gutter-row" span={8}>{this.wrapWithLinkIfExists(SteamIcon, 'steam_url')}</Col>
        <Col className="gutter-row" span={8}>{this.wrapWithLinkIfExists(DiscordIcon, 'discord_url')}</Col>
      </React.Fragment>
    );
  }

  getAboutUs() {
    if(this.context.loading) {
      return <Skeleton active />
    }

    return (
      <React.Fragment>
        Put some stuff here!<br />
        <br />
        Current Council Members:<br />
        Xantam, KTLwjec, SLRaptor, Yogurtshrimp69, zxmongoose<br />
        <br />
        Host: Xantam<br />
        Head Coders: ThatLing, Nichlas0010<br />
      </React.Fragment>
    );
  }

  render() {
    return (
      <Col className="gutter-row" {...this.getDefaultWidgetColProps()}>
        <Spin spinning={this.context.loading}>
          <Card title="About Us" style={panelCardStyle}>
            {this.getAboutUs()}
            <Divider />
              <Row type="flex" justify="space-between" style={{ textAlign: 'center' }}>
                {this.getFollowLinks()}
              </Row>
          </Card>
        </Spin>
      </Col>
    )
  }
}