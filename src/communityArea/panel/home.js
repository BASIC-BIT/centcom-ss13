import React from 'react';
import getCommunityContext from '../communityContext';

export default class Home extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <div>Welcome!</div>
    )
  }
}