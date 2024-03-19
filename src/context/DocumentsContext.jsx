/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

// Belgelerin tamamlanma durumlarını tutacak context
export const DocumentsContext = createContext();

// Belgelerin durumlarını güncelleyecek reducer fonksiyonu
function documentsReducer(state, action) {
  switch (action.type) {
    case "COMPLETE_DOCUMENT":
      return {
        ...state,
        [action.payload]: true,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Context provider, uygulamanın herhangi bir yerinden bu duruma erişim sağlanmasını sağlar
export function DocumentsProvider({ children }) {
  const [state, dispatch] = useReducer(documentsReducer, {});

  // State ve dispatcher'ı sağlayın
  const value = { state, dispatch };
  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

// Custom hook, bu context'i kullanmak için
export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}
