'use strict';
require("@babel/polyfill");

import fs from 'fs';
import ApiGatewayEventParser from "./api-gateway-event-parser";
import { DB } from './db_broker';

const db = new DB();

require.extensions['.sql'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

function createResponse({
  body,
  statusCode = 200,
  headers,
} = {}) {
  return {
    statusCode,
    ...(body && { body }),
    ...(headers && { headers }),
  }
}

const endpoints = [
  {
    path: /^\/login$/,
    handler: (eventParser) => {
      return createResponse({ statusCode: 501, body: `501 Not Implemented` });
    },
  },
  {
    path: /^\/terraform_outputs$/,
    handler: (eventParser) => {
      const terraform_outputs = require('../generated/terraform_output.json');
      return createResponse({ statusCode: 501, body: JSON.stringify(terraform_outputs) });
    },
  },
  {
    path: /^\/test$/,
    handler: (eventParser) => {
      const date = new Date();
      return createResponse({ body: `Hello world! Current Time: ${date.toString()}`});
    },
  },
  {
    path: /^\/event/,
    handler: (eventParser) => {
      return createResponse({ body: JSON.stringify(eventParser.getEvent())});
    },
  },
  {
    path: /^\/context/,
    handler: (eventParser) => {
      return createResponse({ body: JSON.stringify(eventParser.getContext())});
    },
  },
  {
    path: /^\/servers/,
    handler: async (eventParser) => {
      try {
        const statements = [
          'USE centcom',
          'SELECT * FROM servers',
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running connect\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/init/,
    handler: async (eventParser) => {
      try {
        const initTablesSql = require('./sql/initTables.sql');
        const setConfig = require('./sql/setConfig.sql');
        const initServers = require('./sql/initServers.sql');

        const queries = [
          [initTablesSql],
          [setConfig],
          [initServers],
        ];

        const result = await db.multiQuery(queries);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running init\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/destroy/,
    handler: async (eventParser) => {
      try {
        const destroy = require('./sql/destroy.sql');

        const queries = [
          [destroy],
        ];

        const result = await db.multiQuery(queries);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running init\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/connect/,
    handler: async (eventParser) => {
      try {
        const query = 'show databases;';
        const result = await db.query(query);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running connect\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  }
];

const handler = async function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const eventParser = new ApiGatewayEventParser(event, context);

    const endpointMatch = endpoints.find(endpoint => eventParser.regexTestPath(endpoint.path));

    if(endpointMatch) {
      callback(null, await endpointMatch.handler(eventParser));
    } else {
      callback(null, createResponse({ statusCode: 404 }));
    }
  } catch(e) {
    callback(null, createResponse({ statusCode: 500, body: e.stack }));
  }

  //
  // const response = {
  //   statusCode: 200,
  //   headers: {
  //     'Content-Type': 'text/html; charset=utf-8'
  //   },
  //   body: `<p>Hello world!, you passed me an event:<br />${JSON.stringify(event)}<br />${JSON.stringify(context)}</p>`
  // };
  // callback(null, response);
};

export { handler };