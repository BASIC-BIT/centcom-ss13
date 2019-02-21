import React from 'react';
import getCommunityContext from '../utils/communityContext';

export default class Admin extends React.Component {
  static contextType = getCommunityContext();
  render() {
    return (
      <div>Super secret adminbus buttons</div>
    )
  }
}