'use strict';
require("@babel/polyfill");

import ApiGatewayEventParser from "./api-gateway-event-parser";

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
    path: /^\/connect/,
    handler: async (eventParser) => {
      const mysql = require('mysql');

      const connection = mysql.createConnection({
        host     : process.env.RDS_HOSTNAME,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        port     : process.env.RDS_PORT
      });

      const output = await new Promise((resolve, reject) => {
        connection.connect(function(err) {
          if (err) {
            resolve(createResponse({ body: 'Database connection failed: ' + err.stack, statusCode: 500 }));
            return;
          }

          resolve(createResponse({ body: 'Connected to database.', statusCode: 200 }));
        });
      });

      try {
        connection.end();
      } catch (e) {}

      return output || createResponse({ body: 'Unknown error (better check that out)', statusCode: 500 });
    },
  }
];

exports.handler = async function (event, context, callback) {
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