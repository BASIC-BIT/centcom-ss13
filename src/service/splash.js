import React from 'react';
import {Link} from "react-router-dom";

export default class Splash extends React.Component {
  render() {
    return (
      <div>
        <div>
          CentCom
        </div>
        <br/>
        <Link to="/panel">CentCom Control</Link>
      </div>
    );
  }
}