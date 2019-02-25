const initialState = {

};

const merge = (...args) => args.reduce((acc, cur) => ({ ...acc, ...cur }), {});

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return merge(state, { loading: action.data });
    case 'SET_SERVERS':
      return merge(state, { servers: action.data });
    case 'SET_CONFIG':
      return merge(state, { config: action.data });
    case 'SET_BOOKS':
      return merge(state, { books: action.data });
    default:
      return state
  }
}