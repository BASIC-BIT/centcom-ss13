const initialState = {};

const merge = (...args) => {
  const output = args.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  return output;
};

export default function defaultState(state = initialState, action) {
  switch (action.type) {
    case 'MERGE':
      return merge(state, action.data);
    default:
      return state
  }
}