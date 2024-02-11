/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { userSelectionsReducer, initialState } from "./userSelectionsReducer";

// Context'i oluştur
const UserSelectionsContext = createContext();

// Provider componentini oluştur
function UserSelectionsProvider({ children }) {
  const [state, dispatch] = useReducer(userSelectionsReducer, initialState);

  return (
    <UserSelectionsContext.Provider value={{ state, dispatch }}>
      {children}
    </UserSelectionsContext.Provider>
  );
}

export { UserSelectionsProvider, UserSelectionsContext };
