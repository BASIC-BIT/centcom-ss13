require('@babel/polyfill');

import React from 'react';
import getCommunityContext from '../utils/communityContext';
import DB from '../brokers/serverBroker';
import LoadingIndicator from "../components/loadingIndicator";
import {Button, Table} from "antd";
import {Link} from "react-router-dom";

const db = new DB();

const tableStyle = {
  // width: '700px',
};

export default class Home extends React.Component {
  static contextType = getCommunityContext();

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.getServers();
  }

  async getServers() {
    const servers = await db.getServers();
    this.setState({ servers, loading: false });
  }

  render() {
    if(this.state.loading) {
      return (<LoadingIndicator center />);
    }

    const serverListColumns = [
      {
        title: '',
        key: 'name',
        render: (text, server) => (
          <span>
            <h2 style={{ margin: 'auto' }}>{server.name}</h2>
          </span>
        ),
      },
      {
        title: '',
        key: 'joinserver',
        render: (text, server) => (
          <span>
            <a href={server.url}><Button type="primary">Join!</Button></a>
          </span>
        ),
      },
      {
        title: '',
        key: 'description',
        render: (text, server) => (
          <span>
            <Link to={`/community/${server.url}/panel`}>{server.description}</Link>
          </span>
        ),
      },
    ];

    return (
      <div>
        <Table style={tableStyle} dataSource={this.state.servers} columns={serverListColumns}/>
      </div>
    )
  }
}