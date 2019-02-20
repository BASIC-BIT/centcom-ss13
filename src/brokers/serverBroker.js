import terraformOutput from '../../generated/terraform_output';
import xhr from 'xhr';

class ServerBroker {
  constructor() {
    this.serverUrl = terraformOutput.server_url.value;
  }

  query(queryString) {
    return new Promise((resolve, reject) => {
      xhr.get(`${this.serverUrl}/${queryString}`, (err, results) => {
        if(err) {
          reject(err);
        } else {
          resolve(JSON.parse(results));
        }
      });
    });
  }

  getCommunities() {
    return this.query('/communities');
  }
}

export default ServerBroker;
