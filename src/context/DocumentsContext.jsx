/* eslint-disable react/prop-types */
// DocumentsContext.jsx
import { createContext, useContext, useReducer } from "react";

export const DocumentsContext = createContext();

function documentsReducer(state, action) {
  switch (action.type) {
    case "SET_COMPLETED_DOCUMENTS":
      return action.payload;
    case "COMPLETE_DOCUMENT":
      return { ...state, [action.payload]: true };
    default:
      return state;
  }
}

export const DocumentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentsReducer, {});

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
