/* eslint-disable react/prop-types */
import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "../features/authentication/useUser";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsNav } from "../utils/userSelectionsFetch";
import { fetchFirmLocation } from "../services/apiVisaApplications";

const VisaApplicationContext = createContext();

const visaApplicationReducer = (state, action) => {
  switch (action.type) {
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload }; // State'i objeye çevirip "applications" anahtarı ile güncelledik
    case "ADD_NEW_APPLICATION":
      return { ...state, applications: [...state.applications, action.payload] };
    case "REMOVE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter(
          (application) => application.id !== action.payload
        ),
      };
    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications.map((application) =>
          application.id === action.payload.id
            ? { ...application, ...action.payload.changes }
            : application
        ),
      };
    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter(
          (application) => application.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const VisaApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visaApplicationReducer, {
    applications: [],
  });
  const [firmLocation, setFirmLocation] = useState(null);
  const { user } = useUser();
  const userId = user?.id;

  const { data: userAnswers, isSuccess } = useQuery({
    queryKey: ["userSelectionsAtMainNav", userId],
    queryFn: () => fetchUserSelectionsNav(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (isSuccess && userAnswers) {
      // Başvuruları güncelle
      dispatch({ type: "SET_APPLICATIONS", payload: userAnswers });
    }
  }, [userAnswers, isSuccess, dispatch]);

  const fetchFirmLocationData = async (country) => {
    const location = await fetchFirmLocation(country);
    setFirmLocation(location);
  };

  return (
    <VisaApplicationContext.Provider
      value={{
        applications: state.applications,
        dispatch,
        firmLocation,
        fetchFirmLocation: fetchFirmLocationData,
      }}
    >
      {children}
    </VisaApplicationContext.Provider>
  );
};

export const useVisaApplications = () => useContext(VisaApplicationContext);