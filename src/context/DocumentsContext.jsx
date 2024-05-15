/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

export const DocumentsContext = createContext();

const initialState = {
  completedDocuments: {},
};

function documentsReducer(state, action) {
  switch (action.type) {
    case "SET_COMPLETED_DOCUMENTS":
      return {
        ...state,
        completedDocuments: {
          ...state.completedDocuments,
          ...action.payload,
        },
      };
    case "COMPLETE_DOCUMENT": {
      const { documentName, applicationId } = action.payload;
      return {
        ...state,
        completedDocuments: {
          ...state.completedDocuments,
          [applicationId]: {
            ...state.completedDocuments[applicationId],
            [documentName]: true,
          },
        },
      };
    }
    case "UNCOMPLETE_DOCUMENT": {
      const { documentName, applicationId } = action.payload;
      const newState = { ...state };
      if (newState.completedDocuments[applicationId]) {
        delete newState.completedDocuments[applicationId][documentName];
        if (
          Object.keys(newState.completedDocuments[applicationId]).length === 0
        ) {
          delete newState.completedDocuments[applicationId];
        }
      }
      return newState;
    }
    default:
      return state;
  }
}

export const DocumentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentsReducer, initialState);

  return (
    <DocumentsContext.Provider value={{ state, dispatch }}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
};
