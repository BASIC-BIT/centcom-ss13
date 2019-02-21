import React from 'react';
import getCommunityContext from '../../utils/communityContext';

export default class Home extends React.Component {
  static contextType = getCommunityContext();

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        Put some normal user facing data and links here
      </div>
    )
  }
}