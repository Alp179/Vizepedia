const initialState = {
  country: "",
  purpose: "",
  profession: "",
  vehicle: "",
  kid: "",
  accommodation: "",
  hasSponsor: null, // Yeni alan: Sponsor var mı? (true/false)
  sponsorProfession: "", // Yeni alan: Sponsorun mesleği
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
    case "SET_HAS_SPONSOR":
      return { ...state, hasSponsor: action.payload }; // Sponsor var mı alanını güncelle
    case "SET_SPONSOR_PROFESSION":
      return { ...state, sponsorProfession: action.payload }; // Sponsorun mesleğini güncelle
    default:
      return state;
  }
}

export { userSelectionsReducer, initialState };
