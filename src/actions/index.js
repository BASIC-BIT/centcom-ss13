import DB from '../brokers/serverBroker';

const db = new DB();

function setLoading(loading) {
  return {
    type: 'SET_LOADING',
    data: loading,
  };
}

function setServers(servers) {
  return {
    type: 'SET_SERVERS',
    data: servers,
  };
}

function setConfig(config) {
  return {
    type: 'SET_CONFIG',
    data: config,
  };
}

function setBooks(books) {
  return {
    type: 'SET_BOOKS',
    data: books,
  };
}

function fetchBooks() {
  return async (dispatch) => {
    dispatch(setBooks(await db.getBooks()));
  }
}
function fetchConfig() {
  return async (dispatch) => {
    dispatch(setConfig(await db.getConfig()));
  }
}
function fetchServers() {
  return async (dispatch) => {
    dispatch(setServers(await db.getServers()));
  }
}

export default {
  setLoading,
  setServers,
  setConfig,
  setBooks,
  fetchBooks,
  fetchConfig,
  fetchServers,
}