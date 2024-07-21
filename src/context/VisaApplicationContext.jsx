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
      return action.payload;
    case "ADD_NEW_APPLICATION":
      return [...state, action.payload];
    case "REMOVE_APPLICATION":
      return state.filter((application) => application.id !== action.payload);
    case "UPDATE_APPLICATION":
      return state.map((application) =>
        application.id === action.payload.id
          ? { ...application, ...action.payload.changes }
          : application
      );
    case "DELETE_APPLICATION":
      return state.filter((application) => application.id !== action.payload);
    default:
      return state;
  }
};

export const VisaApplicationProvider = ({ children }) => {
  const [applications, dispatch] = useReducer(visaApplicationReducer, []);
  const [firmLocation, setFirmLocation] = useState(null);
  const { user } = useUser(); // Kullanıcı bilgilerini useUser hook'undan al
  const userId = user?.id;

  const { data: userAnswers, isSuccess } = useQuery({
    queryKey: ["userSelectionsAtMainNav", userId],
    queryFn: () => fetchUserSelectionsNav(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (isSuccess && userAnswers) {
      // Yanıtları başarıyla çektiysek, başvuruları güncelle
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
        applications,
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
