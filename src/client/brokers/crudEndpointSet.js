export default class CrudEndpointSet {
  constructor(db, path) {
    this.db = db;
    this.path = path;
  }

  get(id = null) {
    if(id) {
      return this.db.query(`${this.path}/${id}`);
    }

    return this.db.query(`${this.path}`);
  }

  update(body) {
    return this.db.query(`${this.path}/${body.id}`, { body: JSON.stringify(body), method: 'PUT' });
  }

  create(body) {
    this.db.query(`${this.path}`, { body: JSON.stringify(body), method: 'POST' });
  }

  upsert(body) {
    if(body.id) {
      try {
        return this.update(body);
      } catch (e) {
        return this.create(body);
      }
    }

    return this.create(body);
  }

  delete(id) {
    return this.db.query(`${this.path}/${id}`, { method: 'DELETE' });
  }
}