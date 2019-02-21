import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import getCommunityContext from '../utils/communityContext';
import LoadingIndicator from "./loadingIndicator";

const splashStyle = {
  textAlign: 'center',
  paddingTop: '200px',
};

export default class SplashPage extends React.Component {
  static contextType = getCommunityContext();
  render() {
    if(this.context.loading) {
      return (<LoadingIndicator center />);
    }
    return (
      <div style={splashStyle}>
        <h1>{this.context.config.splash_title_text}</h1>
        <div>
          <Link to={`/panel`}>
            <Button type="primary" style={{ margin: '10px' }}>Enter the Bridge</Button>
          </Link>
        </div>
      </div>
    );
  }
};