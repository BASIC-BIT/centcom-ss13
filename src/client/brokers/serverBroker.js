import terraformOutput from '../../../generated/terraform_output';
import xhr from 'xhr';
import {isErrorCode} from "../utils/statusCodes";
import CrudEndpointSet from "./crudEndpointSet";
import endpointDefinitions from '../../shared/defs/endpointDefinitions';

class ServerBroker {
  constructor() {
    this.serverUrl = terraformOutput.server_url.value;

    this.endpoints = Object.entries(endpointDefinitions)
    .map(([key, endpointDefinition]) => ({ [key]: new CrudEndpointSet(this, endpointDefinition) }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  get(key, id = null, params = []) {
    return this.endpoints[key].get(id, params);
  }

  create(key, body, params = []) {
    return this.endpoints[key].create(body, params);
  }

  update(key, body, params = []) {
    let outputPromises = [];

    const endpoint = this.endpoints[key];
    const endpointDefinition = endpoint.endpointDefinition;

    outputPromises.push(endpoint.update(body, params));

    console.log(body);
    endpointDefinition.fields &&
      Object.entries(endpointDefinition.fields)
      .filter(([key, field]) => field.saveHandler && body[key])
      .forEach(([key, field]) => outputPromises.push(field.saveHandler(this, body[key], params)));

    return outputPromises;
  }

  delete(key, id, params = []) {
    return this.endpoints[key].delete(id, params);
  }

  upsert(key, body, params = []) {
    return this.endpoints[key].upsert(body, params);
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
