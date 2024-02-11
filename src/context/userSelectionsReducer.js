// src/context/userSelectionsReducer.js
const initialState = {
  country: "",
  purpose: "",
  profession: "",
  vehicle: "",
  kid: "",
  accommodation: "",
};

function userSelectionsReducer(state, action) {
  switch (action.type) {
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "SET_PURPOSE":
      return { ...state, purpose: action.payload };
    case "SET_PROFESSION":
      return { ...state, profession: action.payload };
    case "SET_VEHICLE":
      return { ...state, vehicle: action.payload };
    case "SET_KID":
      return { ...state, kid: action.payload };
    case "SET_ACCOMMODATION":
      return { ...state, accommodation: action.payload };
    default:
      return state;
  }
}

export { userSelectionsReducer, initialState };
