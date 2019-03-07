require("@babel/core");
require("@babel/polyfill");

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { expect } = require('chai');
const mysql = require('mysql');
const Chance = require('chance');
const { promisify } = require('util');

let handler;

describe('CentCom Server', () => {
  let sandbox;
  let env;
  let chance;
  let expectedMysqlConnectionPayload;
  let originalEnvironmentVariables;
  let mysqlCreateConnectionStub;
  let expectedEnvironmentVariables;
  let mysqlConnectStub;
  let mysqlEndStub;
  let mysqlQueryStub;
  let handler;
  let mysqlStub;

  function createRequest({
                           path = '/',
                           httpMethod = 'GET',
                           body = undefined,
                         } = {}) {
    return {
      path,
      httpMethod,
      body,
    };
  }

  beforeEach(() => {
    originalEnvironmentVariables = process.env;
    sandbox = sinon.createSandbox();
    chance = new Chance();
    mysqlConnectStub = sandbox.stub().callsFake((callback) => callback());
    mysqlEndStub = sandbox.stub().yields();
    mysqlQueryStub = sandbox.stub();
    expectedEnvironmentVariables = {
      RDS_HOSTNAME: chance.string(),
      RDS_PASSWORD: chance.string(),
      RDS_PORT: chance.string(),
      RDS_USERNAME: chance.string(),
    };
    expectedMysqlConnectionPayload = {
      host: expectedEnvironmentVariables.RDS_HOSTNAME,
      user: expectedEnvironmentVariables.RDS_USERNAME,
      password: expectedEnvironmentVariables.RDS_PASSWORD,
      port: expectedEnvironmentVariables.RDS_PORT,
      debug: true,
      multipleStatements: true,
    };
    process.env = expectedEnvironmentVariables;

    class Connection {
      bindValue([key, value]) {
        this[key] = value;
      }

      constructor(props) {
        Object.entries(props).forEach(this.bindValue.bind(this));
      }
    }

    mysqlCreateConnectionStub = sandbox.stub(mysql, 'createConnection')
    .withArgs(expectedMysqlConnectionPayload)
    .returns(new Connection({
      connect: mysqlConnectStub,
      end: mysqlEndStub,
      query: mysqlQueryStub,
    }));
    mysqlStub = {
      createConnection: mysqlCreateConnectionStub,
    };

    handler = proxyquire('../../src/server/main', {
      mysql: mysqlStub,
    });
  });

  afterEach(() => {
    process.env = originalEnvironmentVariables;
    sandbox.restore();
  });

  it('should return 200 from /test endpoint', (done) => {
    handler.handler(createRequest({ path: '/test' }), {}, (error, output) => {
      expect(output.body).to.include('Hello world! Current Time: ');
      expect(output.statusCode).to.equal(200);
      done();
    });
  });

  it('should return input event from /event endpoint', (done) => {
    const event = createRequest({ path: '/event' });
    handler.handler(event, {}, (error, output) => {
      expect(output.body).to.include(JSON.stringify(event));
      expect(output.statusCode).to.equal(200);
      done();
    });
  });

  it('should return 501 Not Implemented for /login', (done) => {
    const event = createRequest({ path: '/login' });
    handler.handler(event, {}, (error, output) => {
      expect(output.body).to.include('501 Not Implemented');
      expect(output.statusCode).to.equal(501);
      done();
    });
  });

  it('should return 200 when connecting to database', async () => {
    const event = createRequest({ path: '/connect' });
    mysqlQueryStub
    .withArgs('show databases;')
    .yieldsRight(undefined, 'Database list', { foo: 'bar' });

    const output = await promisify(handler.handler)(event, {});

    expect(output.body).to.equal('"Database list"');
    expect(output.statusCode).to.equal(200);
  });

  it('should return 200 when running database destroy', async () => {
    const event = createRequest({ path: '/destroy' });
    mysqlQueryStub
    .withArgs('DROP DATABASE IF EXISTS centcom;')
    .yieldsRight(undefined, 'Destroy finished', { foo: 'bar' });

    const output = await promisify(handler.handler)(event, {});

    expect(output.body).to.equal('"Destroy finished"');
    expect(output.statusCode).to.equal(200);
  });

  it('should return 200 when running database init', async () => {
    const event = createRequest({ path: '/init' });
    mysqlQueryStub
    .yieldsRight(undefined, 'Init finished!', { foo: 'bar' });

    const output = await promisify(handler.handler)(event, {});

    expect(output.body).to.equal('"Init finished!"');
    expect(output.statusCode).to.equal(200);
  });

  it.skip('should end gracefully', async () => {
    const event = createRequest({ path: '/connect' });

    const output = await promisify(handler.handler)(event, {});

    sinon.assert.calledOnce(mysqlEndStub);
  });

  describe('CRUD books', () => {
    describe('create', () => {
      it('should create new book', (done) => {
        mysqlQueryStub
        .withArgs('USE centcom;\nINSERT INTO books (title, category_id, content) VALUES (\'foo\', 15, \'bar\');')
        .yieldsRight(undefined, 'Created!', { foo: 'bar' });
        const event = createRequest({
          path: '/books',
          httpMethod: 'POST',
          body: JSON.stringify({ title: 'foo', content: 'bar', category_id: 15 })
        });
        handler.handler(event, {}, (error, output) => {
          expect(output.body).to.include('Created!');
          expect(output.statusCode).to.equal(201);
          done();
        });
      });
    });
    describe('update', () => {
      it('should update existing book', (done) => {
        mysqlQueryStub
        .withArgs('USE centcom;\nUPDATE books SET title = \'foo\', category_id = 15, content = \'bar\' WHERE id = 1;')
        .yieldsRight(undefined, 'Updated!', { foo: 'bar' });
        const event = createRequest({
          path: '/books/1',
          httpMethod: 'PUT',
          body: JSON.stringify({ title: 'foo', content: 'bar', category_id: 15 })
        });
        handler.handler(event, {}, (error, output) => {
          expect(output.body).to.include('Updated!');
          expect(output.statusCode).to.equal(204);
          done();
        });
      });
    });
    describe('read', () => {
      it('should read existing books', async () => {
        mysqlQueryStub
        .withArgs('USE centcom;\nSELECT books.id, books.title, books.content, books.category_id, book_categories.name AS category_name FROM books LEFT JOIN book_categories ON books.category_id = book_categories.id;')
        .yieldsRight(undefined, ['ok', [{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]], { foo: 'bar' });
        const event = createRequest({
          path: '/books',
          httpMethod: 'GET',
        });
        const output = await promisify(handler.handler)(event, {});

        expect(output.body).to.equal(JSON.stringify([{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]));
        expect(output.statusCode).to.equal(200);
      });
    });
    describe('delete', () => {
      it('should delete a book', async () => {
        mysqlQueryStub
        .withArgs('USE centcom;\nDELETE FROM books WHERE id = 1;')
        .yieldsRight(undefined, 'Deleted!', { foo: 'bar' });
        const event = createRequest({
          path: '/books/1',
          httpMethod: 'DELETE',
        });
        const output = await promisify(handler.handler)(event, {});

        expect(output.body).to.include('Deleted!');
        expect(output.statusCode).to.equal(202);
      });
    });
  });

  it.skip('should get user permissions', async () => {
    mysqlQueryStub
    .withArgs('USE centcom;\n' +
      'SELECT\n' +
      '    user_permissions.id AS id,\n' +
      '    user_permissions.user_id AS user_id,\n' +
      '    user_permissions.permission_id AS permission_id,\n' +
      '    permissions.name AS name,\n' +
      '    permissions.description AS description\n' +
      'FROM user_permissions\n' +
      'LEFT JOIN permissions\n' +
      '    ON user_permissions.permission_id = permissions.id\n' +
      'LEFT JOIN users\n' +
      '    ON user_permissions.user_id = users.id\n' +
      'WHERE user_permissions.user_id = 5;')
    .yieldsRight(undefined, ['ok', [{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]], { foo: 'bar' });
    const event = createRequest({
      path: '/users/5/permissions',
      httpMethod: 'GET',
    });
    const output = await promisify(handler.handler)(event, {});

    expect(output.body).to.equal(JSON.stringify([{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]));
    expect(output.statusCode).to.equal(200);
  });

  it('should post bulk user permissions', async () => {
    mysqlQueryStub
    .withArgs('USE centcom;\n' +
      'DELETE FROM user_permissions WHERE user_permissions.user_id = 5;\n' +
      'INSERT INTO user_permissions (permission_id, user_id) VALUES (3,5), (6,5), (13,5), (15,5);')
    .yieldsRight(undefined, ['ok', [{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]], { foo: 'bar' });
    const event = createRequest({
      path: '/users/5/permissions',
      httpMethod: 'POST',
      body: '[3, 6, 13, 15]',
    });
    const output = await promisify(handler.handler)(event, {});

    expect(output.body).to.equal(JSON.stringify(['ok', [{ id: 1, title: 'foo', content: 'bar' }, { id: 2, title: 'baz', content: 'quux' }]]));
    expect(output.statusCode).to.equal(201);
  });
});