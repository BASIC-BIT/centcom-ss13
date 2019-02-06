import React from 'react';
import { Button } from 'react-toolbox/lib/button';

const title = 'Hello YogStation World!';

export default class Main extends React.Component {
  render() {
    return (
      <div id="app">
        <div>{title}</div>
        <Button label="I'm a button." />
      </div>
    );
  }
}