import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import getCommunityContext from './communityContext';

const splashStyle = {
  textAlign: 'center',
  paddingTop: '200px',
};

export default withRouter(class SplashPage extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <div style={splashStyle}>
        {this.context.community.name}'s Gorgeous Splash Page
        <div>
          <Link to={`/community/${this.context.community.url}/panel`}>
            <Button type="primary" style={{ margin: '10px' }}>Go to User Panel</Button>
          </Link>
        </div>
      </div>
    );
  }
});