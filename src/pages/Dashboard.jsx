/* eslint-disable react/prop-types */
import { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/apiAuth";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import StepIndicator from "../ui/StepIndicator";
import { useNavigate, useParams } from "react-router-dom";
import { useDocuments } from "../context/DocumentsContext";
import { fetchCompletedDocuments } from "../utils/supabaseActions";
import styled from "styled-components";
import supabase from "../services/supabase";
import SignupForm from "../features/authentication/SignupForm";
import ModalSignup from "../ui/ModalSignup";
import FirmMap from "../ui/FirmMap";
import AnimatedFlag from "../ui/AnimatedFlag";
import MobileCarousel from "../ui/MobileCarousel";
import VisaCheckModal from "../ui/VisaCheckModal";
import VisaStatusBanner from "../ui/VisaStatusBanner";
import { useUser } from "../features/authentication/useUser";
import StaticDashboardContent from "../ui/StaticDashboardContent";
import { AnonymousDataService } from "../utils/anonymousDataService";
import SEO from "../components/SEO";

// Styled components
const CreatedAtContainer = styled.div`
  font-size: 1.5rem;
  color: var(--color-grey-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  z-index: 3000;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
  padding: 6px 12px;
  border-radius: 6px;

  @media (max-width: 710px) {
    padding: 4px 8px;
  }
`;

const CustomRow = styled(Row)`
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 3000;
  margin: 25px auto 10px 0;

  @media (max-width: 1550px) {
    margin-left: -100px;
  }
  padding: 0;
  @media (max-width: 710px) {
    margin: 60px auto 10px auto;
    justify-content: center;
  }
`;

const DashboardContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 710px) {
    height: auto;
    min-height: auto;
    width: 100%;
    margin-left: auto;
    flex-flow: column;
    justify-content: flex-start;
    margin-right: auto;
    padding-top: 10px;
    background: linear-gradient(
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0) 60%
    );
    align-items: stretch;
    gap: 16px;
  }
`;

const BannersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: calc(100% - 40px);
  max-width: 800px;
  padding: 0;
  align-self: flex-start;

  @media (max-width: 1550px) {
    margin-left: -100px;
  }

  @media (max-width: 1200px) {
    width: calc(100vw - 400px);
  }

  @media (max-width: 900px) {
    width: 500px;
  }

  @media (max-width: 710px) {
    margin: 60px auto 0 auto;
    width: 450px;
  }
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const UyeDevam = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 248.6px;
  height: 89px;
  background: #004466;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.11);
  border-radius: 24px;
  border: 2px solid #00ffa2;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
  outline: none;
  margin: 10px auto 0 auto;

  @media (max-width: 710px) {
    width: 220px;
    height: 75px;
    font-size: 16px;
  }

  @media (max-width: 450px) {
    width: 200px;
    height: 65px;
    font-size: 15px;
  }

  &:hover {
    background-color: #00ffa2;
    color: #004466;
    transform: translateY(-3px);
    box-shadow: 0px 25px 50px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const StepIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;

  @media (max-width: 1450px) {
    margin-bottom: 40px;
  }

  @media (max-width: 710px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const InfoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 710px) {
    gap: 12px;
  }
`;

const DashboardItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 10;

  @media (max-width: 710px) {
    position: relative;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: -8px;
  }
`;

const DashboardInfoSection = styled.div`
  max-width: 900px;
  margin: 50px 0 50px 50px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  
  @media (max-width: 1550px) {
    margin-left: -80px;
  }
  
  @media (max-width: 1000px) {
  margin: 100px 0px 100px -150px;
  }
  
  @media (max-width: 710px) {
    margin: 100px 16px 24px;
    padding: 0;
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 28px 32px;
  border: 1px solid rgba(0, 68, 102, 0.15);
  box-shadow: 0 4px 24px rgba(0, 68, 102, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #004466 0%, #00ffa2 100%);
  }
  
  @media (max-width: 768px) {
    padding: 20px 24px;
    border-radius: 16px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 68, 102, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(0, 68, 102, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 68, 102, 0.05);
    border-color: rgba(0, 255, 162, 0.2);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: linear-gradient(135deg, #004466 0%, #00ffa2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 255, 162, 0.2);
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 20px;
  }
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h4`
  font-size: 17px;
  font-weight: 700;
  color: #004466;
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
  
  strong {
    color: #004466;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AnonymousWarning = styled.div`
  max-width: 900px;
  margin: 0 0 32px 50px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  
  @media (max-width: 1550px) {
    margin-left: -80px;
  }
  
  @media (max-width: 1000px) {
    margin-left: -150px;
  }
  
  @media (max-width: 710px) {
    margin: 0 16px 24px;
    padding: 0;
  }
`;

const WarningCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 152, 0, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px 28px;
  border: 2px solid rgba(255, 193, 7, 0.3);
  box-shadow: 0 4px 20px rgba(255, 193, 7, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #FFC107 0%, #FF9800 100%);
  }
  
  @media (max-width: 768px) {
    padding: 20px 24px;
    border-radius: 12px;
    flex-direction: column;
    gap: 12px;
  }
`;

const WarningIcon = styled.div`
  width: 56px;
  height: 56px;
  min-width: 56px;
  background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    min-width: 48px;
    font-size: 24px;
  }
`;

const WarningContent = styled.div`
  flex: 1;
`;

const WarningTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #D97706;
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const WarningText = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #92400E;
  margin: 0;
  
  strong {
    color: #B45309;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const WhatToDo = styled.h4`

  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
 
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Section3 = styled.div`
`;

const Dashboard = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

  const { user, isLoading: isUserLoading } = useUser();

  const [userType, setUserType] = useState("loading");
  const isAnonymous =
    applicationId?.startsWith("anonymous-") ||
    (AnonymousDataService.isAnonymousUser() && !user);
  const isBot = AnonymousDataService.isBotUser();

  const {
    state: { completedDocuments },
    dispatch,
  } = useDocuments();
  const [countryCode, setCountryCode] = useState("");

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 710);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function determineUserType() {
      console.log("🔍 Determining user type...");

      if (isBot) {
        console.log("👤 User type: bot");
        setUserType("bot");
        return;
      }

      if (user && user.id) {
        console.log("👤 User type: authenticated (user found)");
        setUserType("authenticated");
        setUserId(user.id);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.id) {
          console.log("👤 User type: authenticated (session found)");
          setUserType("authenticated");
          setUserId(currentUser.id);
          return;
        }
      } catch (error) {
        console.log("❌ Error checking current user:", error);
      }

      if (isAnonymous && AnonymousDataService.isAnonymousUser()) {
        console.log("👤 User type: anonymous");
        setUserType("anonymous");
        return;
      }

      console.log("👤 User type: new_visitor");
      setUserType("new_visitor");
    }

    if (!isUserLoading) {
      determineUserType();
    }
  }, [user, isUserLoading, isAnonymous, isBot, applicationId]);

  useEffect(() => {
    console.log("🔍 Checking URL redirect for anonymous user...");

    if (
      userType === "anonymous" &&
      !applicationId &&
      AnonymousDataService.hasCompletedOnboarding()
    ) {
      const anonymousId = AnonymousDataService.getConsistentApplicationId();
      console.log(
        "🔗 Redirecting anonymous user to:",
        `/dashboard/${anonymousId}`
      );
      navigate(`/dashboard/${anonymousId}`, { replace: true });
    }
  }, [userType, applicationId, navigate]);

  const handleUserConversion = async () => {
    console.log("🔄 User conversion started");
    setUserType("authenticated");

    try {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.id) {
        setUserId(currentUser.id);

        let newApplicationId = null;
        let retryCount = 0;
        const maxRetries = 5;

        while (!newApplicationId && retryCount < maxRetries) {
          try {
            const { data: recentApps, error: recentError } = await supabase
              .from("userAnswers")
              .select("id, created_at")
              .eq("userId", currentUser.id)
              .gte("created_at", new Date(Date.now() - 10000).toISOString())
              .order("created_at", { ascending: false })
              .limit(1);

            if (!recentError && recentApps && recentApps.length > 0) {
              newApplicationId = recentApps[0].id;
              break;
            }

            const { data: latestApps, error: latestError } = await supabase
              .from("userAnswers")
              .select("id, created_at")
              .eq("userId", currentUser.id)
              .order("created_at", { ascending: false })
              .limit(1);

            if (!latestError && latestApps && latestApps.length > 0) {
              newApplicationId = latestApps[0].id;
              break;
            }

            if (retryCount < maxRetries - 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            retryCount++;
          } catch (fetchError) {
            console.error(`❌ Fetch attempt ${retryCount + 1} failed:`, fetchError);
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        if (newApplicationId) {
          try {
            const completedDocs = await fetchCompletedDocuments(
              currentUser.id,
              newApplicationId
            );
            if (completedDocs && completedDocs.length > 0) {
              const completedDocsMap = completedDocs.reduce((acc, doc) => {
                if (!acc[newApplicationId]) {
                  acc[newApplicationId] = {};
                }
                acc[newApplicationId][doc.document_name] = true;
                return acc;
              }, {});

              dispatch({
                type: "SET_COMPLETED_DOCUMENTS",
                payload: completedDocsMap,
              });
            }
          } catch (docsError) {
            console.error("⚠️ Error loading completed documents:", docsError);
          }

          window.location.href = `/dashboard/${newApplicationId}`;
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ User conversion error:", error);
      navigate("/dashboard");
    }
  };

  const {
    data: userSelections,
    isSuccess: isUserSelectionsSuccess,
    isLoading: isUserSelectionsLoading,
    isError: isUserSelectionsError,
    refetch: refetchUserSelections,
  } = useQuery({
    queryKey: ["userSelections", userId, applicationId, userType],
    queryFn: () => {
      if (userType === "anonymous") {
        const anonymousData = AnonymousDataService.convertToSupabaseFormat();
        return anonymousData;
      } else if (userType === "authenticated" && userId) {
        return fetchUserSelectionsDash(userId, applicationId);
      }
      return null;
    },
    enabled:
      (userType === "authenticated" && !!userId) ||
      (userType === "anonymous" &&
        AnonymousDataService.hasCompletedOnboarding()),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const ansCountry = userSelections?.[0]?.ans_country;

  async function fetchFirmLocation(country) {
    const { data, error } = await supabase
      .from("visa_firm_locations")
      .select("*")
      .eq("country", country)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async function fetchVisaCountryLinks(country) {
    const { data, error } = await supabase
      .from("visa_country_links")
      .select("*")
      .eq("country", country)
      .single();

    if (error) {
      console.error("Error fetching visa country links:", error);
      return null;
    }

    return data;
  }

  const { data: firmLocation, isSuccess: isFirmLocationSuccess } = useQuery({
    queryKey: ["firmLocation", ansCountry],
    queryFn: () => fetchFirmLocation(ansCountry),
    enabled:
      !!ansCountry &&
      (userType === "authenticated" ||
        (userType === "anonymous" &&
          AnonymousDataService.hasCompletedOnboarding())),
  });

  const { data: countryLinks } = useQuery({
    queryKey: ["visaCountryLinks", ansCountry],
    queryFn: () => fetchVisaCountryLinks(ansCountry),
    enabled: !!ansCountry && userType === "authenticated" && !!userId,
  });

  useEffect(() => {
    if (userType === "authenticated" && userId) {
      const realApplicationId = userSelections?.[0]?.id;

      if (realApplicationId) {
        fetchCompletedDocuments(userId, realApplicationId)
          .then((data) => {
            if (data && data.length > 0) {
              const completedDocsMap = data.reduce((acc, doc) => {
                if (!acc[realApplicationId]) {
                  acc[realApplicationId] = {};
                }
                acc[realApplicationId][doc.document_name] = true;
                return acc;
              }, {});

              dispatch({
                type: "SET_COMPLETED_DOCUMENTS",
                payload: completedDocsMap,
              });
            } else {
              dispatch({
                type: "SET_COMPLETED_DOCUMENTS",
                payload: {},
              });
            }
          })
          .catch((error) => {
            console.error("❌ Error fetching completed documents:", error);
          });
      }
    } else if (userType === "anonymous" && applicationId) {
      const anonymousCompletedDocs =
        AnonymousDataService.fetchCompletedDocuments(applicationId);

      const completedDocsMap = anonymousCompletedDocs.reduce((acc, doc) => {
        if (!acc[applicationId]) {
          acc[applicationId] = {};
        }
        acc[applicationId][doc.document_name] = true;
        return acc;
      }, {});

      dispatch({
        type: "SET_COMPLETED_DOCUMENTS",
        payload: completedDocsMap,
      });
    }
  }, [userType, userId, userSelections, applicationId, dispatch]);

  useEffect(() => {
    if (isUserSelectionsSuccess && userSelections?.length > 0) {
      const countryToCode = {
        Almanya: "de",
        Avusturya: "at",
        Belçika: "be",
        Çekya: "cz",
        Danimarka: "dk",
        Estonya: "ee",
        Finlandiya: "fi",
        Fransa: "fr",
        Yunanistan: "gr",
        Macaristan: "hu",
        İzlanda: "is",
        İtalya: "it",
        Letonya: "lv",
        Litvanya: "lt",
        Lüksemburg: "lu",
        Malta: "mt",
        Hollanda: "nl",
        Norveç: "no",
        Polonya: "pl",
        Portekiz: "pt",
        Slovakya: "sk",
        Slovenya: "si",
        İspanya: "es",
        İsveç: "se",
        İsviçre: "ch",
        Lihtenştayn: "li",
        Rusya: "ru",
        ABD: "us",
        Çin: "cn",
        BAE: "ae",
        Avustralya: "au",
        Birleşik_Krallık: "gb",
        Hırvatistan: "hr",
      };

      setCountryCode(countryToCode[ansCountry] || "");

      const rawDate = userSelections[0]?.created_at;

      if (rawDate) {
        const createdAtDate = new Date(rawDate);
        if (!isNaN(createdAtDate.getTime())) {
          const formattedDate = createdAtDate.toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setCreatedAt(formattedDate);
        }
      }
    }
  }, [userSelections, isUserSelectionsSuccess, ansCountry]);

  const hasCompletedOnboarding = userSelections && userSelections.length > 0;

  const documentNames = useMemo(() => {
    return userSelections ? getDocumentsForSelections(userSelections) : [];
  }, [userSelections]);

  const {
    data: documents,
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
  } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled:
      !!documentNames.length &&
      (userType === "authenticated" ||
        (userType === "anonymous" &&
          AnonymousDataService.hasCompletedOnboarding())),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // ============================================
  // EARLY RETURNS - HER BİRİNDE SEO VAR
  // ============================================

  if (userType === "loading" || isUserLoading) {
    return <Spinner />;
  }

  if (userType === "bot" || userType === "new_visitor") {
    return (
      <>
        <SEO
          title="Kontrol Paneli – Vizepedia"
          description="Vize başvurularınızı ve belgelerinizi tek bir yerden yönetin."
          keywords="kontrol paneli, vize başvuru, vize belgeleri, Vizepedia"
          url="/dashboard" // Relative - normalizeUrl düzeltecek
          noindex={false} 
        />
        <DashboardContainer>
          <StaticDashboardContent />
        </DashboardContainer>
      </>
    );
  }

  if (
    (userType === "anonymous" || userType === "authenticated") &&
    (!hasCompletedOnboarding || isUserSelectionsLoading)
  ) {
    if (isUserSelectionsLoading) {
      return <Spinner />;
    }

    return (
      <>
        <SEO
          title="Kontrol Paneli – Vizepedia"
          description="Vize başvurularınızı ve belgelerinizi tek bir yerden yönetin."
          keywords="kontrol paneli, vize başvuru, vize belgeleri, Vizepedia"
          url="/dashboard"
          noindex={false} // ✗ Onboarding tamamlanmamış
        />
        <DashboardContainer>
          <StaticDashboardContent />
        </DashboardContainer>
      </>
    );
  }

  if (isUserSelectionsError) {
    return (
      <>
        <SEO
          title="Kontrol Paneli – Vizepedia"
          description="Vize başvurularınızı ve belgelerinizi tek bir yerden yönetin."
          keywords="kontrol paneli, vize başvuru, vize belgeleri, Vizepedia"
          url="/dashboard"
          noindex={true} // ✗ Hata sayfası indekslenmesin
        />
        <DashboardContainer>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--color-red-700)",
            }}
          >
            Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
          </div>
          <StaticDashboardContent />
        </DashboardContainer>
      </>
    );
  }

  if (isDocumentsLoading) {
    return <Spinner />;
  }

  if (isDocumentsError) {
    return (
      <>
        <SEO
          title="Kontrol Paneli – Vizepedia"
          description="Vize başvurularınızı ve belgelerinizi tek bir yerden yönetin."
          url="/dashboard"
          noindex={true}
        />
        <div>Error loading data.</div>
      </>
    );
  }

  // ============================================
  // ANA DASHBOARD RETURN - AUTHENTICATED USER
  // ============================================
  return (
    <>
      <SEO
        title="Kontrol Paneli – Vizepedia"
        description="Vize başvurularınızı ve belgelerinizi tek bir yerden yönetin."
        keywords="kontrol paneli, vize başvuru, vize belgeleri, Vizepedia"
        url="/dashboard" // Relative - normalizeUrl düzeltecek
        noindex={true} // ✗ Kullanıcı paneli Google'da görünmesin
      />
      <DashboardContainer>
        {isUserSelectionsSuccess &&
          userSelections?.length > 0 &&
          userType === "authenticated" && (
            <BannersContainer>
              {userSelections[0].has_appointment === false && (
                <VisaStatusBanner
                  type="appointment"
                  applicationId={applicationId}
                  userId={userId}
                  countryLinks={countryLinks}
                  onSuccess={() => refetchUserSelections()}
                />
              )}
              {userSelections[0].has_filled_form === false && (
                <VisaStatusBanner
                  type="form"
                  applicationId={applicationId}
                  userId={userId}
                  countryLinks={countryLinks}
                  onSuccess={() => refetchUserSelections()}
                />
              )}
            </BannersContainer>
          )}

        <AnimatedFlag countryCode={countryCode} />
        

        <CustomRow type="horizontal">
          {createdAt && (
            <CreatedAtContainer style={{ zIndex: "3000" }}>
              <span
                role="img"
                aria-label="calendar"
                style={{
                  marginRight: "6px",
                  fontSize: isMobile ? "0.95rem" : "1.1rem",
                }}
              >
                📆
              </span>{" "}
              {createdAt}
            </CreatedAtContainer>
          )}
        </CustomRow>

        <DashboardItems>
          {!isMobile && (
            <>
            
              <StepIndicatorWrapper>
                <Heading as="h14">Ülke adı</Heading>
                <StepIndicator
                  documents={documents}
                  completedDocuments={completedDocuments}
                  applicationId={applicationId}
                  userSelections={userSelections}
                  userType={userType}
                  isLoading={isDocumentsLoading}
                  isError={isDocumentsError}
                />
              </StepIndicatorWrapper>

              <InfoContainerWrapper>
                <Heading as="h14">Başvuru adresi</Heading>
                {isFirmLocationSuccess && firmLocation && (
                  <FirmMap firmLocation={firmLocation} />
                )}
              </InfoContainerWrapper>
            </>
          )}

          {isMobile && (
            <MobileCarousel
              completedDocuments={completedDocuments}
              documents={documents}
              firmLocation={firmLocation}
              isFirmLocationSuccess={isFirmLocationSuccess}
              applicationId={applicationId}
              userSelections={userSelections}
              userType={userType}
              isLoading={isDocumentsLoading}
              isError={isDocumentsError}
            />
          )}
        </DashboardItems>

        

        {userType === "anonymous" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: isMobile ? "-20px" : "20px",
            }}
          >
            {/* Anonim Kullanıcı Uyarısı - Sadece anonymous user için */}
{userType === "anonymous" && hasCompletedOnboarding && (
  <AnonymousWarning>
    <WarningCard>
      <WarningIcon>⚠️</WarningIcon>
      <WarningContent>
        <WarningTitle>Seçimleriniz Kaydedilmedi</WarningTitle>
        <WarningText>
          Misafir olarak devam ediyorsunuz. Seçimleriniz ve ilerlemeniz <strong>tarayıcınızda geçici olarak</strong> saklanıyor. 
          Tarayıcı geçmişini temizlerseniz veya farklı bir cihazdan erişirseniz <strong>tüm verileriniz kaybolacak</strong>. 
          Üye olun ve başvuru sürecinize her zaman her yerden erişin!
        </WarningText>
        <ModalSignup>
              <ModalSignup.Open opens="signUpForm">
               
                  <UyeDevam>Üye Olarak Devam et</UyeDevam>
                
              </ModalSignup.Open>
              <ModalSignup.Window name="signUpForm">
                <SignupForm onSuccess={handleUserConversion} />
              </ModalSignup.Window>
            </ModalSignup>
      </WarningContent>
    </WarningCard>
  </AnonymousWarning>
)}
            
          </div>
        )}

        {(userType === "authenticated" || userType === "anonymous") && 
 hasCompletedOnboarding && documents?.length > 0 && (
  
  <DashboardInfoSection>
    <Section3>
    <WhatToDo>Şimdi Ne Yapacağım?</WhatToDo>
    <InfoCard>
      <InfoGrid>
        <InfoBox>
          <InfoIcon>📋</InfoIcon>
          <InfoContent>
            <InfoTitle>Belgelerinizi Hazırlayın</InfoTitle>
            <InfoText>
              Vize başvurunuz için <strong>{documents.length} belge</strong> gerekiyor. 
              Her belgeyi hazırladığınızda işaretleyin ve ilerlemenizi takip edin.
            </InfoText>
          </InfoContent>
        </InfoBox>
        
        <InfoBox>
          <InfoIcon>📍</InfoIcon>
          <InfoContent>
            <InfoTitle>Başvuru Merkezine Gidin</InfoTitle>
            <InfoText>
              Tüm belgeleri topladıktan sonra, aşağıdaki haritada gösterilen{" "}
              <strong>başvuru merkezine</strong> randevunuzla gidin.
            </InfoText>
          </InfoContent>
        </InfoBox>
      </InfoGrid>
    </InfoCard>
    </Section3>
  </DashboardInfoSection>
)}

        {userType === "authenticated" && userId && applicationId && (
          <VisaCheckModal userId={userId} applicationId={applicationId} />
        )}
      </DashboardContainer>
    </>
  );
};

export default Dashboard;