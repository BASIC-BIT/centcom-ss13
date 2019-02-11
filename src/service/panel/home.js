import React from 'react';
import {Link} from "react-router-dom";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div>Welcome!</div>
        <br/>
        <Link to="/community/yogstation">Yogstation</Link>
        <br/>
        <Link to="/community/st13">Startrek 13</Link>
      </div>
    )
  }
}