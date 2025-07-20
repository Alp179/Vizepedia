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
import { useParams } from "react-router-dom";
import { AnonymousDataService } from "../utils/anonymousDataService";

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
  const { user, userType } = useUser();
  const userId = user?.id;
  const { id: applicationId } = useParams();

  // SAFE: Only make API calls for authenticated users with valid data
  const {
    data: userAnswers,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["userSelectionsAtMainNav", userId],
    queryFn: () => fetchUserSelectionsNav(userId),
    // CRITICAL: Only enable for authenticated users with real userId
    enabled:
      !!userId &&
      userType === "authenticated" &&
      userId !== "anonymous" &&
      !AnonymousDataService.isBotUser(),
    retry: 1, // Reduce retries to minimize 400 errors
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Handle different user types safely
  useEffect(() => {
    if (userType === "bot" || userType === "new_visitor") {
      // For bots and new visitors, set empty applications
      console.log("📋 VisaApplicationContext: No applications for", userType);
      dispatch({ type: "SET_APPLICATIONS", payload: [] });
      return;
    }

    if (userType === "anonymous") {
      // For anonymous users, try to get data from localStorage
      const anonymousData = AnonymousDataService.getUserAnswers();
      if (anonymousData && anonymousData.length > 0) {
        console.log("📋 VisaApplicationContext: Using anonymous data");
        dispatch({ type: "SET_APPLICATIONS", payload: anonymousData });
      } else {
        dispatch({ type: "SET_APPLICATIONS", payload: [] });
      }
      return;
    }

    if (userType === "authenticated" && isSuccess && userAnswers) {
      console.log("📋 VisaApplicationContext: Using authenticated data");
      dispatch({ type: "SET_APPLICATIONS", payload: userAnswers });
    }
  }, [userAnswers, isSuccess, userType]);

  // SAFE: Only refetch for authenticated users
  useEffect(() => {
    if (applicationId && userType === "authenticated" && userId) {
      console.log(
        "🔄 VisaApplicationContext: Refetching for application ID change"
      );
      refetch();
    }
  }, [applicationId, userType, userId, refetch]);

  const fetchFirmLocationData = async (country) => {
    try {
      const location = await fetchFirmLocation(country);
      setFirmLocation(location);
    } catch (error) {
      console.error("Error fetching firm location:", error);
      setFirmLocation(null);
    }
  };

  // SAFE: Only refresh for authenticated users
  const refreshApplications = async () => {
    if (userType === "authenticated" && userId) {
      console.log("🔄 VisaApplicationContext: Refreshing applications");
      await refetch();
    } else if (userType === "anonymous") {
      // For anonymous users, reload from localStorage
      const anonymousData = AnonymousDataService.getUserAnswers();
      if (anonymousData) {
        dispatch({ type: "SET_APPLICATIONS", payload: anonymousData });
      }
    } else {
      console.log("📋 VisaApplicationContext: No refresh needed for", userType);
    }
  };

  // SAFE: Provide appropriate data based on user type
  const contextValue = {
    applications: state.applications,
    dispatch,
    firmLocation,
    fetchFirmLocation: fetchFirmLocationData,
    refreshApplications,
    // Add user type info for components that need it
    userType,
    isAuthenticated: userType === "authenticated",
    canMakeAPIRequests: userType === "authenticated" && !!userId,
  };

  return (
    <VisaApplicationContext.Provider value={contextValue}>
      {children}
    </VisaApplicationContext.Provider>
  );
};

export const useVisaApplications = () => useContext(VisaApplicationContext);
