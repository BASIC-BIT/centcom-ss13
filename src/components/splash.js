import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import getCommunityContext from '../utils/communityContext';

const splashStyle = {
  textAlign: 'center',
  paddingTop: '200px',
};

export default class SplashPage extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <div style={splashStyle}>
        <h1>{this.context.config.community_name}</h1> {/* TODO: Fix config so this works */}
        <div>
          <Link to={`/panel`}>
            <Button type="primary" style={{ margin: '10px' }}>Enter the Bridge</Button>
          </Link>
        </div>
      </div>
    );
  }
};