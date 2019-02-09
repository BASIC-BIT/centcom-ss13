import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";

const splashStyle = {
  textAlign: 'center',
  paddingTop: '200px',
};

export default class SplashPage extends React.Component {
  render() {
    return (
      <div style={splashStyle}>
        Yogstation's Gorgeous Splash Page
        <div>
          <Link to="/panel">
            <Button type="primary" style={{ margin: '10px' }}>Go to User Panel</Button>
          </Link>
        </div>
      </div>
    );
  }
}