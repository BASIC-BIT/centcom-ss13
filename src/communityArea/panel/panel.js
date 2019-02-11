import React from 'react';
import {Layout} from 'antd';
import PageSidebar from "./sidebar";
import PageContent from "./content";
import PageFooter from "./footer";
import PageHeader from "./header";


export default class Panel extends React.Component {
  render() {
    return (
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
    );
  }
}