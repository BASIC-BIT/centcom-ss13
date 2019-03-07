'use strict';
require("@babel/polyfill");

import mysql from 'mysql';
import ApiGatewayEventParser from "./api-gateway-event-parser";
import {DB} from './db_broker';
import initTablesSql from '../shared/sql/initTables.sql';
import setConfig from '../shared/sql/setConfig.sql';
import initServers from '../shared/sql/initServers.sql';
import initBooks from '../shared/sql/initBooks.sql';
import initUsers from '../shared/sql/initUsers.sql';
import destroy from '../shared/sql/destroy.sql';
import endpointDefinitions from '../shared/defs/endpointDefinitions';

const db = new DB();

const identityFunction = (a) => a;

const flatMap = (arr, func) => {
  return arr
  .map(func)
  .reduce((acc, cur) => [...acc, ...cur], []);
};

function createResponse({
                          body,
                          statusCode = 200,
                          headers = {},
                        } = {}) {
  return {
    statusCode,
    ...(body && { body }),
    headers: {
      "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      "Access-Control-Allow-Methods": 'GET,OPTIONS,POST,PUT,DELETE',
      "Access-Control-Allow-Origin": '*',
      ...headers,
    },
  }
}

const parseSqlResultValue = (results) => {
  if(results === 'null' || results === 'NULL') {
    return null;
  }

  return results;
};

const getCrudEndpointHandlers = ({
  path,
  table,
  name,
  fields,
  overrideGetSql,
  overrideUpdateSql,
  overrideDeleteSql,
  overrideCreateSql,
  bulkUpdate,
  params,
  postPath,
  postTransform,
  filter,
  filterGet,
  postFetch = identityFunction,
} = {}) => {
  return [
    {
      path: new RegExp(`^${path}$`),
      method: 'GET',
      handler: async (eventParser) => {
        try {
          const filterKeyValuePair = filterGet && Object.entries(fields).find(([key, field]) => field.filter);
          const filterId = filterKeyValuePair ? eventParser.regexMatchPath(path)[1] : undefined;
          const filterText = filterKeyValuePair ? ` WHERE ${filterKeyValuePair[1].name} = ${filterId}` : '';

          let getStatement = overrideGetSql ? overrideGetSql : `SELECT * FROM ${table}${filterText};`;

          if(overrideGetSql && filterKeyValuePair) {
            getStatement = getStatement.replace('$1', filterId);
          }
          const statements = [
            'USE centcom;',
            getStatement,
          ];
          const result = await db.multiQuery(statements);

          const finalResult = postFetch(result[1]);

          return createResponse({ body: JSON.stringify(finalResult), statusCode: 200 });
        } catch (e) {
          console.log(e);
          return createResponse({ body: `Error running ${name} get\n${e.message}\n${e.stack}`, statusCode: 500 });
        }
      },
    },
    {
      path: new RegExp(`^${path}/([0-9]+)$`),
      method: 'PUT',
      handler: async (eventParser) => {
        if(bulkUpdate) {
          return createResponse({
            body: 'Cannot PUT on bulk endpoint (use POST or GET)',
            statusCode: 405,
            headers: {
              Accept: 'GET, POST',
            },
          })
        }
        try {
          const objectId = parseInt(eventParser.regexMatchPath(new RegExp(`^${path}\/([0-9]+)$`))[1]);
          const object = JSON.parse(eventParser.getBody());

          const setFields = Object.entries(fields)
          .filter(([key, field]) => !field.omit && object[key] !== undefined)
          .map(([key, field]) => {
            return `${key} = ${mysql.escape(object[key])}`;
          })
          .join(', ');
          const statements = [
            'USE centcom;',
            `UPDATE ${table} SET ${setFields} WHERE id = ${objectId};`,
          ];
          const result = await db.multiQuery(statements);
          return createResponse({ body: JSON.stringify(result), statusCode: 204 });
        } catch (e) {
          console.log(e);
          return createResponse({ body: `Error running ${name} update\n${e.message}\n${e.stack}`, statusCode: 500 });
        }
      },
    },
    {
      path: new RegExp(`^${postPath || path}$`),
      method: 'POST',
      handler: async (eventParser) => {
        const realPath = postPath || path;
        if(bulkUpdate) {
          try {
            const filterId = eventParser.regexMatchPath(realPath)[1];
            console.log(`filterId: ${filterId}`);
            const filterField = Object.entries(fields).find(([key, field]) => field.filter)[0];
            const objects = JSON.parse(eventParser.getBody());

            const transformedObjects = postTransform ? postTransform(objects, eventParser, db) : objects;

            const filledObjects = Object.values(params).reduce((objectsAcc, param) => {
              const paramFilterId = eventParser.regexMatchPath(realPath)[param.matchIndex];

              let formattedParamFilterId;
              if(param.type === 'numeric') {
                formattedParamFilterId = parseInt(paramFilterId);
              } else {
                formattedParamFilterId = paramFilterId;
              }
              return objectsAcc.map(object => ({
                ...object,
                [param.keyRef]: formattedParamFilterId,
              }));
            }, transformedObjects);

            const sqlFields = Object.entries(fields)
            .filter(([key, field]) => !field.omit)
            .map(([key, field]) => key)
            .join(', ');

            const getFieldValuePairForObject = (object) => {
              console.log('object inside', object, fields);
              return Object.entries(fields)
              .filter(([key, field]) => !field.omit)
              .map(([key, field]) => {
                console.log([key, mysql.escape(object[key])]);
                return [key, mysql.escape(object[key])];
              })
              .reduce(([fieldAcc, valueAcc], [field, value]) => {
                return [
                  [
                    ...fieldAcc,
                    field,
                  ],
                  [
                    ...valueAcc,
                    value,
                  ]
                ];
              }, [[], []]);
            };

            console.log('objects', filledObjects);
            const valuesList = filledObjects.map(getFieldValuePairForObject).map(([, fieldString]) => `(${fieldString})`).join(', ');

            const insertStatement = valuesList ? `INSERT INTO ${table} (${sqlFields}) VALUES ${valuesList};` : '';
            const statements = [
              'USE centcom;',
              `DELETE FROM ${table} WHERE ${table}.${filterField} = ${filterId};`,
              insertStatement
            ];
            const result = await db.multiQuery(statements);
            return createResponse({ body: JSON.stringify(result), statusCode: 201 });
          } catch (e) {
            console.log(e);
            return createResponse({ body: `Error running ${name} create\n${e.message}\n${e.stack}`, statusCode: 500 });
          }
        } else {
          try {
            const object = JSON.parse(eventParser.getBody());

            const [
              sqlFields,
              sqlValues,
            ] = Object.entries(fields)
            .filter(([key, field]) => !field.omit && object[key])
            .map(([key, field]) => {
              return [key, mysql.escape(object[key])];
            })
            .reduce(([fieldAcc, valueAcc], [field, value]) => {
              return [
                [
                  ...fieldAcc,
                  field,
                ],
                [
                  ...valueAcc,
                  value,
                ]
              ];
            }, [[], []]);

            const statements = [
              'USE centcom;',
              `INSERT INTO ${table} (${sqlFields.join(', ')}) VALUES (${sqlValues.join(', ')});`,
            ];
            const result = await db.multiQuery(statements);
            return createResponse({ body: JSON.stringify(result), statusCode: 201 });
          } catch (e) {
            console.log(e);
            return createResponse({ body: `Error running ${name} create\n${e.message}\n${e.stack}`, statusCode: 500 });
          }
        }
      },
    },
    {
      path: new RegExp(`^${path}/([0-9]+)$`),
      method: 'DELETE',
      handler: async (eventParser) => {
        if(bulkUpdate) {
          return createResponse({
            body: 'Cannot DELETE on bulk endpoint (use POST or GET)',
            statusCode: 405,
            headers: {
              Accept: 'GET, POST',
            },
          })
        }
        try {
          const objectId = parseInt(eventParser.regexMatchPath(new RegExp(`^${path}\/([0-9]+)`))[1]);

          const statements = [
            'USE centcom;',
            `DELETE FROM ${table} WHERE id = ${objectId};`,
          ];

          const result = await db.multiQuery(statements);
          return createResponse({ body: JSON.stringify(result), statusCode: 202 });
        } catch (e) {
          console.log(e);
          return createResponse({
            body: `Error running ${name} delete\n${e.message}\n${e.stack}`,
            statusCode: 500
          });
        }
      },
    }
  ];
};

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
      const terraform_outputs = require('../../generated/terraform_output.json');
      return createResponse({ statusCode: 501, body: JSON.stringify(terraform_outputs) });
    },
  },
  {
    path: /^\/test$/,
    handler: (eventParser) => {
      const date = new Date();
      return createResponse({ body: `Hello world! Current Time: ${date.toString()}` });
    },
  },
  {
    path: /^\/event/,
    handler: (eventParser) => {
      return createResponse({ body: JSON.stringify(eventParser.getEvent()) });
    },
  },
  {
    path: /^\/context/,
    handler: (eventParser) => {
      return createResponse({ body: JSON.stringify(eventParser.getContext()) });
    },
  },
  {
    path: /^\/init/,
    handler: async (eventParser) => {
      try {
        const queries = [
          [initTablesSql],
          [setConfig],
          [initUsers],
          [initServers],
          [initBooks],
        ];

        const result = await db.multiQuery(queries);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running init\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/destroy/,
    handler: async (eventParser) => {
      try {
        const queries = [
          [destroy],
        ];

        const result = await db.multiQuery(queries);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running destroy\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/health/,
    handler: async (eventParser) => {
      let healthOutput = {
        db: false, //Guilty until proven innocent
        server: true, //That's me, so we're probably good here
      };
      try {
        const query = 'show databases;';
        const result = await db.query(query);

        if(query && query.length) {
          healthOutput.db = true;
        }
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running health\n${e.message}\n${e.stack}`, statusCode: 500 });
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
        console.log(e);
        return createResponse({ body: `Error running connect\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  }, {
    path: /.*/,
    method: 'OPTIONS',
    handler: async (eventParser) => {
      return createResponse({
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": 'GET,OPTIONS,POST,PUT,DELETE',
          "Access-Control-Allow-Origin": '*',
        }
      });
    },
  },
  ...flatMap(
    Object.values(endpointDefinitions),
    endpointDefinition => getCrudEndpointHandlers(endpointDefinition)
  ),
];

const handler = async function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const eventParser = new ApiGatewayEventParser(event, context);

    const endpointMatch = endpoints.find(endpoint =>
      (endpoint.method || 'GET') === eventParser.getMethod() &&
      eventParser.regexTestPath(new RegExp(endpoint.path)));

    if (endpointMatch) {
      callback(null, await endpointMatch.handler(eventParser));
    } else {
      callback(null, createResponse({ statusCode: 404 }));
    }
  } catch (e) {
    console.log(e);
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

export {handler};