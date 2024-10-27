import { createStore } from 'redux';

const initialState = {
  user: null,
  documents: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    default:
      return state;
  }
};

const store = createStore(rootReducer);
export default store;
