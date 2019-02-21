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
  } = {}) {
    return {
      path,
      httpMethod,
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

    handler = proxyquire('../../server/main', {
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
});