'use strict';
require("@babel/polyfill");

import ApiGatewayEventParser from "./api-gateway-event-parser";
import {DB} from './db_broker';
import initTablesSql from './sql/initTables.sql';
import setConfig from './sql/setConfig.sql';
import initServers from './sql/initServers.sql';
import initBooks from './sql/initBooks.sql';
import destroy from './sql/destroy.sql';

const db = new DB();

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
    path: /^\/servers/,
    handler: async (eventParser) => {
      try {
        const statements = [
          'USE centcom;',
          'SELECT * FROM servers;',
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result[1]), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running servers\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/config/,
    handler: async (eventParser) => {
      try {
        const statements = [
          'USE centcom;',
          'SELECT * FROM config;',
        ];
        const result = await db.multiQuery(statements);

        const formattedResults = result[1].reduce((output, { cfg_key, cfg_value }) => ({
          ...output,
          [cfg_key]: cfg_value
        }), {});

        return createResponse({ body: JSON.stringify(formattedResults), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running connect\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/init/,
    handler: async (eventParser) => {
      try {
        const queries = [
          [initTablesSql],
          [setConfig],
          [initServers],
          [initBooks],
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
        const queries = [
          [destroy],
        ];

        const result = await db.multiQuery(queries);
        return createResponse({ body: JSON.stringify(result), statusCode: 200 });
      } catch (e) {
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
        return createResponse({ body: `Error running health\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/books/,
    method: 'GET',
    handler: async (eventParser) => {
      try {
        const statements = [
          'USE centcom;',
          'SELECT * FROM books;',
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result[1]), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running book get\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/books/,
    method: 'PUT',
    handler: async (eventParser) => {
      try {
        const bookId = parseInt(eventParser.regexMatchPath(/^\/books\/([0-9]+)/)[1]);
        const book = JSON.parse(eventParser.getBody());
        const statements = [
          'USE centcom;',
          `UPDATE books SET title = "${book.title}", content = "${book.content}" WHERE id = ${bookId};`,
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 204 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running book update\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/books/,
    method: 'POST',
    handler: async (eventParser) => {
      try {
        const book = JSON.parse(eventParser.getBody());
        const statements = [
          'USE centcom;',
          `INSERT INTO books (title, content) VALUES ("${book.title}", "${book.content}");`,
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 201 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running book create\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/books/,
    method: 'DELETE',
    handler: async (eventParser) => {
      try {
        const bookId = parseInt(eventParser.regexMatchPath(/^\/books\/([0-9]+)/)[1]);

        const statements = [
          'USE centcom;',
          `DELETE FROM books WHERE id = ${bookId};`,
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 202 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running book delete\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/bookCategories/,
    method: 'GET',
    handler: async (eventParser) => {
      try {
        const statements = [
          'USE centcom;',
          'SELECT * FROM book_categories;',
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result[1]), statusCode: 200 });
      } catch (e) {
        return createResponse({ body: `Error running book categories get\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/bookCategories/,
    method: 'PUT',
    handler: async (eventParser) => {
      try {
        const bookCategoryId = parseInt(eventParser.regexMatchPath(/^\/bookCategories\/([0-9]+)/)[1]);
        const bookCategory = JSON.parse(eventParser.getBody());
        const statements = [
          'USE centcom;',
          `UPDATE book_categories SET name = "${bookCategory.name}", color = "${bookCategory.color}" WHERE id = ${bookCategoryId};`,
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 204 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running book categories update\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/bookCategories/,
    method: 'POST',
    handler: async (eventParser) => {
      try {
        const bookCategory = JSON.parse(eventParser.getBody());
        const statements = [
          'USE centcom;',
          `INSERT INTO book_categories (name, color) VALUES ("${bookCategory.name}", "${bookCategory.color}");`,
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 201 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running book categories create\n${e.message}\n${e.stack}`, statusCode: 500 });
      }
    },
  },
  {
    path: /^\/bookCategories/,
    method: 'DELETE',
    handler: async (eventParser) => {
      try {
        const bookCategoryId = parseInt(eventParser.regexMatchPath(/^\/bookCategories\/([0-9]+)/)[1]);

        const statements = [
          'USE centcom;',
          `DELETE FROM book_categories WHERE id = ${bookCategoryId};`,
        ];
        const result = await db.multiQuery(statements);
        return createResponse({ body: JSON.stringify(result), statusCode: 202 });
      } catch (e) {
        console.log(e);
        return createResponse({ body: `Error running book categories delete\n${e.message}\n${e.stack}`, statusCode: 500 });
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
  }
];

const handler = async function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const eventParser = new ApiGatewayEventParser(event, context);

    const endpointMatch = endpoints.find(endpoint =>
      (endpoint.method || 'GET') === eventParser.getMethod() &&
      eventParser.regexTestPath(endpoint.path));

    if (endpointMatch) {
      callback(null, await endpointMatch.handler(eventParser));
    } else {
      callback(null, createResponse({ statusCode: 404 }));
    }
  } catch (e) {
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