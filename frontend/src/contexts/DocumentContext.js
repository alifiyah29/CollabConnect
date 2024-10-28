import React, { createContext, useContext, useReducer } from 'react';

const DocumentContext = createContext();

const documentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOCUMENT':
      return { ...state, document: action.payload };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        document: { ...state.document, content: action.payload }
      };
    case 'SET_COLLABORATORS':
      return { ...state, collaborators: action.payload };
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, {
    document: null,
    collaborators: []
  });

  return (
    <DocumentContext.Provider value={{ state, dispatch }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => useContext(DocumentContext);