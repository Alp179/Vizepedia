/* eslint-disable react/prop-types */
import { useEffect, useState, useLayoutEffect, useMemo } from "react"; // useMemo eklendi
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

// Styled components remain the same...
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

const Ceper = styled.div`
  margin-top: 20px;
  margin-left: 20vw;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 283px;
  height: 127px;
  border: 3px solid #00ffa2;
  filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.11));
  border-radius: 82px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;

  @media (max-width: 1300px) {
    margin-left: 12vw;
  }

  @media (max-width: 900px) {
    margin-left: 1vw;
  }

  @media (max-width: 710px) {
    position: relative;
    margin: 0 auto;
    margin-top: 10px;
    transform: scale(0.85);
    height: 110px;
    width: 260px;
  }

  @media (max-width: 450px) {
    transform: scale(0.75);
    height: 100px;
    width: 240px;
  }

  &:hover {
    border-color: #004466;
    transform: scale(1.03);

    @media (max-width: 710px) {
      transform: scale(0.9);
    }

    @media (max-width: 450px) {
      transform: scale(0.8);
    }
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
  border-radius: 49px;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
  border: none;
  outline: none;

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

const Dashboard = () => {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

  // User authentication state
  const { user, isLoading: isUserLoading } = useUser();

  // Determine user type safely
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

  // Enhanced user type detection with priority for authenticated users
  useEffect(() => {
    async function determineUserType() {
      console.log("🔍 Determining user type...");
      console.log("isBot:", isBot);
      console.log("isAnonymous:", isAnonymous);
      console.log("user:", user);
      console.log("applicationId:", applicationId);

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

  // YENI: Anonim kullanıcı için otomatik URL yönlendirmesi
  useEffect(() => {
    console.log("🔍 Checking URL redirect for anonymous user...");
    console.log("userType:", userType);
    console.log("applicationId:", applicationId);
    console.log(
      "hasCompletedOnboarding:",
      AnonymousDataService.hasCompletedOnboarding()
    );

    // Anonim kullanıcı ve URL'de applicationId yoksa yönlendir
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
    console.log("🔄 User conversion started - forcing authenticated state");
    
    setUserType("authenticated");
  
    try {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.id) {
        setUserId(currentUser.id);
        console.log("✅ User conversion complete:", currentUser.email);
  
        // ENHANCED: Try multiple strategies to find the application
        let newApplicationId = null;
        let retryCount = 0;
        const maxRetries = 5;
  
        while (!newApplicationId && retryCount < maxRetries) {
          try {
            console.log(`🔍 Attempt ${retryCount + 1}: Fetching user applications...`);
            
            // Strategy 1: Check for very recent applications (last 10 seconds)
            const { data: recentApps, error: recentError } = await supabase
              .from("userAnswers")
              .select("id, created_at")
              .eq("userId", currentUser.id)
              .gte("created_at", new Date(Date.now() - 10000).toISOString())
              .order("created_at", { ascending: false })
              .limit(1);
  
            if (!recentError && recentApps && recentApps.length > 0) {
              newApplicationId = recentApps[0].id;
              console.log("✅ Found recent application:", newApplicationId);
              break;
            }
  
            // Strategy 2: Get latest application overall
            const { data: latestApps, error: latestError } = await supabase
              .from("userAnswers")
              .select("id, created_at")
              .eq("userId", currentUser.id)
              .order("created_at", { ascending: false })
              .limit(1);
  
            if (!latestError && latestApps && latestApps.length > 0) {
              newApplicationId = latestApps[0].id;
              console.log("✅ Found latest application:", newApplicationId);
              break;
            }
  
            // Wait before retry
            if (retryCount < maxRetries - 1) {
              console.log(`⏳ No application found, waiting 1s before retry...`);
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
          console.log("🎯 Navigating to application:", newApplicationId);
          
          // Load completed documents for the new application
          try {
            const completedDocs = await fetchCompletedDocuments(currentUser.id, newApplicationId);
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
  
          // Navigate with application ID
          window.location.href = `/dashboard/${newApplicationId}`;
        } else {
          console.log("⚠️ No application found after migration, redirecting to general dashboard");
          navigate("/dashboard");
        }
      } else {
        console.log("❌ User conversion failed - no user found");
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
      console.log("🔄 Query function called for user selections");
      console.log(
        "userType:",
        userType,
        "userId:",
        userId,
        "applicationId:",
        applicationId
      );

      if (userType === "anonymous") {
        const anonymousData = AnonymousDataService.convertToSupabaseFormat();
        console.log("Anonymous user selections for documents:", anonymousData);
        return anonymousData;
      } else if (userType === "authenticated" && userId) {
        console.log("Fetching authenticated user selections");
        return fetchUserSelectionsDash(userId, applicationId);
      }
      console.log("❌ No query needed, returning null");
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

  // Supabase queries - only for authenticated users
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
    console.log("🔄 Completed documents useEffect triggered");
    console.log(
      "userType:",
      userType,
      "userId:",
      userId,
      "applicationId:",
      applicationId
    );
    console.log("userSelections:", userSelections);

    if (userType === "authenticated" && userId) {
      // FIXED: Use real application ID from userSelections
      const realApplicationId = userSelections?.[0]?.id;

      if (realApplicationId) {
        console.log(
          "🔄 Fetching completed documents with real ID:",
          realApplicationId
        );
        fetchCompletedDocuments(userId, realApplicationId)
          .then((data) => {
            console.log("📋 Raw completed documents from Supabase:", data);

            if (data && data.length > 0) {
              const completedDocsMap = data.reduce((acc, doc) => {
                if (!acc[realApplicationId]) {
                  acc[realApplicationId] = {};
                }
                acc[realApplicationId][doc.document_name] = true;
                return acc;
              }, {});

              console.log(
                "✅ Formatted completed documents map:",
                completedDocsMap
              );

              dispatch({
                type: "SET_COMPLETED_DOCUMENTS",
                payload: completedDocsMap,
              });
              console.log(
                "✅ Context updated with completed documents for real ID:",
                realApplicationId
              );
            } else {
              console.log(
                "⚠️ No completed documents found in Supabase for application:",
                realApplicationId
              );

              // ENHANCED: Check if this is a fresh migration - clear old anonymous data from context
              dispatch({
                type: "SET_COMPLETED_DOCUMENTS",
                payload: {}, // Clear any stale anonymous data
              });
            }
          })
          .catch((error) => {
            console.error("❌ Error fetching completed documents:", error);
          });
      } else {
        console.log("⚠️ No real application ID found in userSelections");
      }
    } else if (userType === "anonymous" && applicationId) {
      console.log(
        "🔄 Loading anonymous completed documents for:",
        applicationId
      );

      // Anonymous user logic (unchanged)
      const anonymousCompletedDocs =
        AnonymousDataService.fetchCompletedDocuments(applicationId);
      console.log("📋 Anonymous completed documents:", anonymousCompletedDocs);

      const completedDocsMap = anonymousCompletedDocs.reduce((acc, doc) => {
        if (!acc[applicationId]) {
          acc[applicationId] = {};
        }
        acc[applicationId][doc.document_name] = true;
        return acc;
      }, {});

      console.log("✅ Anonymous completed documents map:", completedDocsMap);

      dispatch({
        type: "SET_COMPLETED_DOCUMENTS",
        payload: completedDocsMap,
      });
    } else {
      console.log(
        "⚠️ No valid user type or application ID for completed documents"
      );
    }
  }, [userType, userId, userSelections, applicationId, dispatch]);

  // ENHANCED: Add separate debug effect to monitor context changes
  useEffect(() => {
    console.log("🔍 Completed documents context changed:");
    console.log("Current completedDocuments:", completedDocuments);

    if (userSelections && userSelections.length > 0) {
      const realAppId = userSelections[0].id;
      console.log("Real application ID:", realAppId);
      console.log(
        "Completed docs for real app ID:",
        completedDocuments[realAppId]
      );
    }
  }, [completedDocuments, userSelections]);

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

  // Check user state
  const hasCompletedOnboarding = userSelections && userSelections.length > 0;

  // FIXED: Use useMemo for documentNames to prevent unnecessary re-renders
  const documentNames = useMemo(() => {
    return userSelections ? getDocumentsForSelections(userSelections) : [];
  }, [userSelections]);

  // ENHANCED DEBUG: Show user type in debug logs
  useEffect(() => {
    if (userSelections) {
      console.log(`=== DOCUMENT DEBUG FOR ${userType.toUpperCase()} USER ===`);
      console.log("User selections:", userSelections);
      console.log(
        "Document names from getDocumentsForSelections:",
        documentNames
      );
      console.log("User type:", userType);
      console.log("User ID:", userId);
      console.log("==========================================");
    }
  }, [userType, userSelections, documentNames, userId]);

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

  // Early returns based on user type
  if (userType === "loading" || isUserLoading) {
    return <Spinner />;
  }

  if (userType === "bot" || userType === "new_visitor") {
    return (
      <DashboardContainer>
        <StaticDashboardContent />
      </DashboardContainer>
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
      <DashboardContainer>
        <StaticDashboardContent />
      </DashboardContainer>
    );
  }

  if (isUserSelectionsError) {
    return (
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
    );
  }

  if (isDocumentsLoading) {
    return <Spinner />;
  }

  if (isDocumentsError) {
    return <div>Error loading data.</div>;
  }

  return (
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

        {/* Mobile carousel view */}
        {isMobile && (
          <MobileCarousel
            completedDocuments={completedDocuments}
            documents={documents}
            firmLocation={firmLocation}
            isFirmLocationSuccess={isFirmLocationSuccess}
            // FIXED: Added missing props for authenticated users
            applicationId={applicationId}
            userSelections={userSelections}
            userType={userType}
            isLoading={isDocumentsLoading}
            isError={isDocumentsError}
          />
        )}
      </DashboardItems>

      {/* Show signup button for anonymous users */}
      {userType === "anonymous" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: isMobile ? "-20px" : "20px",
          }}
        >
          <ModalSignup>
            <ModalSignup.Open opens="signUpForm">
              <Ceper>
                <UyeDevam>Üye Olarak Devam et</UyeDevam>
              </Ceper>
            </ModalSignup.Open>
            <ModalSignup.Window name="signUpForm">
              <SignupForm onSuccess={handleUserConversion} />
            </ModalSignup.Window>
          </ModalSignup>
        </div>
      )}

      {/* Show VisaCheckModal only for authenticated users */}
      {userType === "authenticated" && userId && applicationId && (
        <VisaCheckModal userId={userId} applicationId={applicationId} />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
