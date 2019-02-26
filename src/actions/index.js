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

function setLoadingServers(loading) {
  return {
    type: 'SET_LOADING_SERVERS',
    data: loading,
  };
}

function setConfig(config) {
  return {
    type: 'SET_CONFIG',
    data: config,
  };
}

function setLoadingConfig(loading) {
  return {
    type: 'SET_LOADING_CONFIG',
    data: loading,
  };
}

function setBooks(books) {
  return {
    type: 'SET_BOOKS',
    data: books,
  };
}

function setLoadingBooks(loading) {
  return {
    type: 'SET_LOADING_BOOKS',
    data: loading,
  };
}

function setBookCategories(bookCategories) {
  return {
    type: 'SET_BOOK_CATEGORIES',
    data: bookCategories,
  };
}

function setLoadingBookCategories(loading) {
  return {
    type: 'SET_LOADING_BOOK_CATEGORIES',
    data: loading,
  };
}

function fetchBooks() {
  return async (dispatch, getState) => {
    const { app } = getState();
    const { loadingBooks } = app;
    if(!loadingBooks) {
      dispatch(setLoadingBooks(true));
      dispatch(setLoadingBookCategories(true));
      dispatch(setBooks(undefined));
      dispatch(setBookCategories(undefined));
      try {
        const [books, bookCategories] = await Promise.all([db.getBooks(), db.getBookCategories()]);
        dispatch(setBooks(books));
        dispatch(setBookCategories(bookCategories));
        dispatch(setLoadingBooks(false));
        dispatch(setLoadingBookCategories(false));
      } catch(e) {
        dispatch(setLoadingBooks(false));
        dispatch(setLoadingBookCategories(false));
      }
    }
  }
}

function fetchConfig() {
  return async (dispatch, getState) => {
    const { app } = getState();
    const { loadingConfig } = app;
    if(!loadingConfig) {
      dispatch(setLoadingConfig(true));
      try {
        const config = await db.getConfig();
        dispatch(setConfig(config));
        dispatch(setLoadingConfig(false));
      } catch(e) {
        dispatch(setLoadingConfig(false));
      }
    }
  }
}

function fetchServers() {
  return async (dispatch, getState) => {
    const { app } = getState();
    const { loadingServers } = app;
    if(!loadingServers) {
      dispatch(setLoadingServers(true));
      try {
        const servers = await db.getServers();
        dispatch(setServers(servers));
        dispatch(setLoadingServers(false));
      } catch(e) {
        dispatch(setLoadingServers(false));
      }
    }
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
  setLoadingServers,
  setLoadingConfig,
  setLoadingBooks,
}