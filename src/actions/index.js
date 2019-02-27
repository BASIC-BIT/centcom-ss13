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

function setPermissions(permissions) {
  return {
    type: 'SET_PERMISSIONS',
    data: permissions,
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

function setLoadingPermissions(loading) {
  return {
    type: 'SET_LOADING_PERMISSIONS',
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
      dispatch(setServers(undefined));
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

function fetchPermissions() {
  return async (dispatch, getState) => {
    const { app } = getState();
    const { loadingPermissions } = app;
    if(!loadingPermissions) {
      dispatch(setLoadingPermissions(true));
      dispatch(setPermissions(undefined));
      try {
        const permissions = await db.getPermissions();
        dispatch(setPermissions(permissions));
        dispatch(setLoadingPermissions(false));
      } catch(e) {
        dispatch(setLoadingPermissions(false));
      }
    }
  }
}

function setUsers(users) {
  return {
    type: 'SET_USERS',
    data: users,
  };
}

function setLoadingUsers(loading) {
  return {
    type: 'SET_LOADING_USERS',
    data: loading,
  };
}

function fetchUsers() {
  return async (dispatch, getState) => {
    const { app } = getState();
    const { loadingUsers } = app;
    if(!loadingUsers) {
      dispatch(setLoadingUsers(true));
      dispatch(setUsers(undefined));
      try {
        const users = await db.getUsers();
        dispatch(setUsers(users));
        dispatch(setLoadingUsers(false));
      } catch(e) {
        dispatch(setLoadingUsers(false));
      }
    }
  }
}

export default {
  setLoading,
  setServers,
  setConfig,
  setBooks,
  setPermissions,
  fetchBooks,
  fetchConfig,
  fetchServers,
  fetchPermissions,
  setLoadingServers,
  setLoadingConfig,
  setLoadingBooks,
  setLoadingPermissions,
  setUsers,
  setLoadingUsers,
  fetchUsers,
}