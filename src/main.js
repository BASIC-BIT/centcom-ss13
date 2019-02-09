import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import RootContainer from "./rootContainer";


export default class Main extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div id="app">
          <RootContainer />
        </div>
      </BrowserRouter>
    );
  }
}