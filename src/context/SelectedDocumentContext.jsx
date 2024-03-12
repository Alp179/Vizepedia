/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const SelectedDocumentContext = createContext();

export const useSelectedDocument = () => useContext(SelectedDocumentContext);

export const SelectedDocumentProvider = ({ children }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <SelectedDocumentContext.Provider
      value={{ selectedDocument, setSelectedDocument }}
    >
      {children}
    </SelectedDocumentContext.Provider>
  );
};
