import terraformOutput from '../../generated/terraform_output';
import xhr from 'xhr';
import {isErrorCode} from "../utils/statusCodes";

class ServerBroker {
  constructor() {
    this.serverUrl = terraformOutput.server_url.value;
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

  getServers() {
    return this.query('/servers');
  }

  getConfig() {
    return this.query('/config');
  }

  getBooks() {
    return this.query('/books');
  }

  createBook(book) {
    return this.query(`/books`, { body: JSON.stringify(book), method: 'POST' });
  }

  updateBook(book) {
    return this.query(`/books/${book.id}`, { body: JSON.stringify(book), method: 'PUT' });
  }

  deleteBook(id) {
    return this.query(`/books/${id}`, { method: 'DELETE' });
  }
}

export default ServerBroker;
