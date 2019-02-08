import React from 'react';
import {Layout} from 'antd';
import PageSidebar from "./sidebar";
import PageContent from "./content";
import PageFooter from "./footer";
import PageHeader from "./header";
import { BrowserRouter } from 'react-router-dom'

const {
  Content,
} = Layout;

export default class Main extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div id="app">
          <Layout>
            <PageHeader/>
            <Layout>
              <PageSidebar/>
              <Layout>
                <PageContent/>
                <PageFooter/>
              </Layout>
            </Layout>
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}