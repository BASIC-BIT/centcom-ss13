import React from 'react';
import {Link} from "react-router-dom";
import {Button} from "antd";

const splashStyle = {
  textAlign: 'center',
  paddingTop: '200px',
};

export default class Splash extends React.Component {
  render() {
    return (
      <div style={splashStyle}>
        <h1>CentCom</h1>
        <div>
          <Link to={`/panel`}>
            <Button type="primary" style={{ margin: '10px' }}>Enter the Bridge</Button>
          </Link>
        </div>
      </div>
    );
  }
}