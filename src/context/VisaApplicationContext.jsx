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
import { useParams } from "react-router-dom"; // URL değişikliklerini takip etmek için

const VisaApplicationContext = createContext();

const visaApplicationReducer = (state, action) => {
  switch (action.type) {
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload };

    case "ADD_NEW_APPLICATION":
      return {
        ...state,
        applications: [...state.applications, action.payload],
      };

    case "REMOVE_APPLICATION":
    case "DELETE_APPLICATION":
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
  const { id: applicationId } = useParams(); // URL'deki başvuru ID'sini al

  const {
    data: userAnswers,
    isSuccess,
    refetch, // Yeniden fetch etmek için
  } = useQuery({
    queryKey: ["userSelectionsAtMainNav", userId],
    queryFn: () => fetchUserSelectionsNav(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (isSuccess && userAnswers) {
      dispatch({ type: "SET_APPLICATIONS", payload: userAnswers });
    }
  }, [userAnswers, isSuccess, dispatch]);

  // 📌 URL değiştiğinde veya yeni başvuru eklendiğinde başvuruları güncelle
  useEffect(() => {
    if (applicationId) {
      refetch();
    }
  }, [applicationId]); // URL değiştiğinde çalıştır

  const fetchFirmLocationData = async (country) => {
    const location = await fetchFirmLocation(country);
    setFirmLocation(location);
  };

  // 📌 Yeni başvuru eklendiğinde kullanılacak fonksiyon
  const refreshApplications = async () => {
    await refetch();
  };

  return (
    <VisaApplicationContext.Provider
      value={{
        applications: state.applications,
        dispatch,
        firmLocation,
        fetchFirmLocation: fetchFirmLocationData,
        refreshApplications, // MainNav'ın güncellenmesi için kullanılacak
      }}
    >
      {children}
    </VisaApplicationContext.Provider>
  );
};

export const useVisaApplications = () => useContext(VisaApplicationContext);
