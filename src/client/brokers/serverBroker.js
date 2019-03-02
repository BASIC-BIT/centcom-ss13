import terraformOutput from '../../../generated/terraform_output';
import xhr from 'xhr';
import {isErrorCode} from "../utils/statusCodes";
import CrudEndpointSet from "./crudEndpointSet";
import endpointDefinitions from '../../shared/defs/endpointDefinitions';

class ServerBroker {
  constructor() {
    this.serverUrl = terraformOutput.server_url.value;

    this.endpoints = Object.entries(endpointDefinitions)
    .map(([key, { path }]) => ({ [key]: new CrudEndpointSet(this, path) }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  get(key, id = null) {
    return this.endpoints[key].get(id);
  }

  create(key, body) {
    return this.endpoints[key].create(body);
  }

  update(key, body) {
    return this.endpoints[key].update(body);
  }

  delete(key, id) {
    return this.endpoints[key].delete(id);
  }

  upsert(key, body) {
    return this.endpoints[key].upsert(body);
  }

  query(queryString, {
    method = 'GET',
    body = undefined,
    headers = {},
  } = {}) {
    return new Promise((resolve, reject) => {
      xhr({
        uri: `${this.serverUrl}${queryString}`,
        method,
        body,
        headers,
      }, (err, results) => {
        const finalError = err || isErrorCode(results.statusCode);
        if(finalError) {
          reject(finalError);
        } else {
          resolve(JSON.parse(results.body));
        }
      });
    });
  }
}

export default ServerBroker;
