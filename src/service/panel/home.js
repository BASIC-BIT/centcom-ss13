import React from 'react';
import {Link} from "react-router-dom";
import {Button, Table} from "antd";
import servers from '../../repositories/servers';

const tableStyle = {
  // width: '700px',
};

export default class Home extends React.Component {
  render() {
    const serverListColumns = [
      {
        title: '',
        key: 'name',
        render: (text, record) => (
          <span>
            {record.hasPanel ?
              (<Link to={`/community/${record.url}`}><h2 style={{margin: 'auto' }}>{record.name}</h2></Link>) :
              (<h2 style={{margin: 'auto' }}>{record.name}</h2>)}
          </span>
        ),
      },
      {
        title: '',
        key: 'joinserver',
        render: (text, record) => (
          <span>
            {record.serverLink && (<a href={record.serverLink}><Button type="primary">Join</Button></a>)}
          </span>
        ),
      },
      {
        title: '',
        key: 'panel',
        render: (text, record) => (
          <span>
            {record.hasPanel && <Link to={`/community/${record.url}/panel`}><Button>Panel</Button></Link>}
          </span>
        ),
      },
      {
        title: '',
        key: 'forums',
        render: (text, record) => (
          <span>
            {record.forums && (<a href={record.forums}><Button>Forums</Button></a>)}
          </span>
        ),
      },
      {
        title: '',
        key: 'github',
        render: (text, record) => (
          <span>
            {record.github && (<a href={record.github}><Button>Github</Button></a>)}
          </span>
        ),
      },
      {
        title: '',
        key: 'wiki',
        render: (text, record) => (
          <span>
            {record.wiki && (<a href={record.wiki}><Button>Wiki</Button></a>)}
          </span>
        ),
      },
    ];

    return (
      <div>
        <Table style={tableStyle} dataSource={servers} columns={serverListColumns}/>
      </div>
    )
  }
}