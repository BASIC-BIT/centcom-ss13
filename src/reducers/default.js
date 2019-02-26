const initialState = {};

const merge = (...args) => {
  const output = args.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  return output;
};

export default function defaultState(state = initialState, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return merge(state, { loading: action.data });
    case 'SET_SERVERS':
      return merge(state, { servers: action.data });
    case 'SET_LOADING_SERVERS':
      return merge(state, { loadingServers: action.data });
    case 'SET_CONFIG':
      return merge(state, { config: action.data });
    case 'SET_LOADING_CONFIG':
      return merge(state, { loadingConfig: action.data });
    case 'SET_BOOKS':
      return merge(state, { books: action.data });
    case 'SET_LOADING_BOOKS':
      return merge(state, { loadingBooks: action.data });
    default:
      return state
  }
}