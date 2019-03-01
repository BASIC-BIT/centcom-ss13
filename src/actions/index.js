import DB from '../brokers/serverBroker';

const db = new DB();

function setLoading(loading) {
  return {
    type: 'MERGE',
    data: { loading },
  };
}

function setServers(servers) {
  return {
    type: 'MERGE',
    data: { servers },
  };
}

function setLoadingServers(loadingServers) {
  return {
    type: 'MERGE',
    data: { loadingServers },
  };
}

function setConfig(config) {
  return {
    type: 'MERGE',
    data: { config },
  };
}

function setLoadingConfig(loadingConfig) {
  return {
    type: 'MERGE',
    data: { loadingConfig },
  };
}

function setBooks(books) {
  return {
    type: 'MERGE',
    data: { books },
  };
}

function setPermissions(permissions) {
  return {
    type: 'MERGE',
    data: { permissions },
  };
}

function setLoadingBooks(loadingBooks) {
  return {
    type: 'MERGE',
    data: { loadingBooks },
  };
}

function setBookCategories(bookCategories) {
  return {
    type: 'MERGE',
    data: { bookCategories },
  };
}

function setLoadingBookCategories(loadingBookCategories) {
  return {
    type: 'MERGE',
    data: { loadingBookCategories },
  };
}

function setLoadingPermissions(loadingPermissions) {
  return {
    type: 'MERGE',
    data: { loadingPermissions },
  };
}

function setUsers(users) {
  return {
    type: 'MERGE',
    data: { users },
  };
}

function setLoadingUsers(loadingUsers) {
  return {
    type: 'MERGE',
    data: { loadingUsers },
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
  fetchBooks,
  fetchConfig,
  fetchServers,
  fetchPermissions,
  fetchUsers,
}