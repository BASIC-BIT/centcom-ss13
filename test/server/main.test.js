const handler = require('../../server/main');
const sinon = require('sinon');
const { expect } = require('chai');
const mysql = require('mysql');
const Chance = require('chance');

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

  beforeEach(() => {
    originalEnvironmentVariables = process.env;
    sandbox = sinon.createSandbox();
    chance = new Chance();
    mysqlConnectStub = sandbox.stub().callsFake((callback) => callback());
    mysqlEndStub = sandbox.stub();
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
    };
    process.env = expectedEnvironmentVariables;
    mysqlCreateConnectionStub = sandbox.stub(mysql, 'createConnection')
    .withArgs(expectedMysqlConnectionPayload)
    .returns({
      connect: mysqlConnectStub,
      end: mysqlEndStub,
    });

  });

  afterEach(() => {
    process.env = originalEnvironmentVariables;
    sandbox.restore();
  });

  it('should return 200 from /test endpoint', (done) => {
    handler.handler({ path: '/test' }, {}, (error, output) => {
      expect(output.body).to.include('Hello world! Current Time: ');
      expect(output.statusCode).to.equal(200);
      done();
    });
  });

  it('should return input event from /event endpoint', (done) => {
    const event = { path: '/event', foo: 'bar' };
    handler.handler(event, {}, (error, output) => {
      expect(output.body).to.include(JSON.stringify(event));
      expect(output.statusCode).to.equal(200);
      done();
    });
  });

  it('should return 501 Not Implemented for /login', (done) => {
    const event = { path: '/login' };
    handler.handler(event, {}, (error, output) => {
      expect(output.body).to.include('501 Not Implemented');
      expect(output.statusCode).to.equal(501);
      done();
    });
  });

  it('should return 200 when connecting to database', (done) => {
    const event = { path: '/connect' };
    handler.handler(event, {}, (error, output) => {
      expect(output.body).to.equal('Connected to database.');
      expect(output.statusCode).to.equal(200);
      sinon.assert.calledOnce(mysqlCreateConnectionStub);
      sinon.assert.calledOnce(mysqlConnectStub);
      sinon.assert.calledOnce(mysqlEndStub);
      done();
    });
  });
});