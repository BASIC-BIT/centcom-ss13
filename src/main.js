import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import RootContainer from "./rootContainer";
import store from './store'
import {Provider} from "react-redux";


export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div id="app">
            <RootContainer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}