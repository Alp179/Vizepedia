// hooks/useGoogleAnalytics.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GoogleAnalytics } from "../utils/googleAnalytics";

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    GoogleAnalytics.trackPageView(location.pathname + location.search);
  }, [location]);

  return {
    trackEvent: GoogleAnalytics.trackEvent,
    trackPageView: GoogleAnalytics.trackPageView,
  };
};
