import mysql from 'mysql';

const buildQuery = (statements = []) => statements.join('\n');

class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host     : process.env.RDS_HOSTNAME,
      user     : process.env.RDS_USERNAME,
      password : process.env.RDS_PASSWORD,
      port     : process.env.RDS_PORT,
      debug: true,
      multipleStatements: true,
    });
    // this.connectPromise = new Promise((resolve, reject) => {
    //   this.connection.connect((err) => {
    //     if(err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
  }

  query(query) {
    console.log(query);
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, results, fields) => {
        if(err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  multiQuery(statements) {
    return this.query(buildQuery(statements));
  }

  end() {
    try {
      return new Promise((resolve, reject) => {
        this.connection.end((err) => {
          if(err) {
            reject(err);
          } else {
            resolve('ok');
          }
        });
      });
    } catch(e) {}
  }
}

export { DB };