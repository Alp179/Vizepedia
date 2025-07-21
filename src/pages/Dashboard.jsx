/* eslint-disable react/prop-types */

import { useEffect, useState, useLayoutEffect } from "react";
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
import OnboardingWarningBanner from "../ui/OnboardingWarningBanner";
import StaticDashboardContent from "../ui/StaticDashboardContent";
import { AnonymousDataService } from "../utils/anonymousDataService";

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
    margin: 20px auto 10px auto;
    justify-content: center;
  }
  @media (max-width: 450px) {
    margin-top: 15px;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

  // User authentication state
  const { user, isLoading: isUserLoading } = useUser();

  // Determine user type safely
  const [userType, setUserType] = useState("loading");
  const isAnonymous =
    applicationId?.startsWith("anonymous-") ||
    AnonymousDataService.isAnonymousUser();
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

  // Determine user type on mount
  useEffect(() => {
    async function determineUserType() {
      if (isBot) {
        setUserType("bot");
        return;
      }

      if (isAnonymous) {
        setUserType("anonymous");
        return;
      }

      if (user) {
        setUserType("authenticated");
        setUserId(user.id);
        return;
      }

      // Check if there's a valid session
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUserType("authenticated");
          setUserId(currentUser.id);
        } else {
          setUserType("new_visitor");
        }
      } catch (error) {
        setUserType("new_visitor");
      }
    }

    if (!isUserLoading) {
      determineUserType();
    }
  }, [user, isUserLoading, isAnonymous, isBot, applicationId]);

  const handleUserConversion = () => {
    setUserType("authenticated");
    navigate("/dashboard");
  };

  // SAFER: More restrictive enabled condition
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
      if (userType === "anonymous") {
        const anonymousData = AnonymousDataService.convertToSupabaseFormat();
        console.log("Anonymous user selections for documents:", anonymousData);
        return anonymousData;
      } else if (userType === "authenticated" && userId) {
        return fetchUserSelectionsDash(userId, applicationId);
      }
      console.log("❌ No query needed, returning null");
      return null;
    },
    // MUCH SAFER: Only enable for specific conditions
    enabled:
      (userType === "authenticated" && !!userId && !!applicationId) ||
      (userType === "anonymous" &&
        AnonymousDataService.hasCompletedOnboarding()),
    staleTime: 5 * 60 * 1000, // 5 dakika cache - ÇOK ÖNEMLİ!
    gcTime: 10 * 60 * 1000, // 10 dakika garbage collection
    refetchOnMount: false, // Mount'ta tekrar fetch etme
    refetchOnWindowFocus: false, // Window focus'ta tekrar fetch etme
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

  // SAFER: Only enable firmLocation query when we have valid data
  const { data: firmLocation, isSuccess: isFirmLocationSuccess } = useQuery({
    queryKey: ["firmLocation", ansCountry],
    queryFn: () => fetchFirmLocation(ansCountry),
    enabled:
      !!ansCountry &&
      (userType === "authenticated" ||
        (userType === "anonymous" &&
          AnonymousDataService.hasCompletedOnboarding())),
  });

  // SAFER: Only enable countryLinks for authenticated users with valid data
  const { data: countryLinks } = useQuery({
    queryKey: ["visaCountryLinks", ansCountry],
    queryFn: () => fetchVisaCountryLinks(ansCountry),
    enabled: !!ansCountry && userType === "authenticated" && !!userId,
  });

  // Load completed documents for authenticated users only
  useEffect(() => {
    if (userType === "authenticated" && userId && applicationId) {
      fetchCompletedDocuments(userId, applicationId).then((data) => {
        const completedDocsMap = data.reduce((acc, doc) => {
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
      });
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
  }, [userType, userId, applicationId, dispatch]);

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

  const documentNames = userSelections
    ? getDocumentsForSelections(userSelections)
    : [];

  // DEBUG: Log document names for troubleshooting
  useEffect(() => {
    if (userType === "anonymous" && userSelections) {
      console.log("=== DOCUMENT DEBUG FOR ANONYMOUS USER ===");
      console.log("User selections:", userSelections);
      console.log(
        "Document names from getDocumentsForSelections:",
        documentNames
      );
      console.log("==========================================");
    }
  }, [userType, userSelections, documentNames]);

  // SAFER: Only query documents when we have valid userSelections and not showing static content
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
    // Bu satırları ekleyin
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Early returns based on user type
  if (userType === "loading" || isUserLoading) {
    return <Spinner />;
  }

  // GÜNCELLEME: Bots ve new visitors için static content + CTA
  if (userType === "bot" || userType === "new_visitor") {
    return (
      <DashboardContainer>
        <StaticDashboardContent />
      </DashboardContainer>
    );
  }

  // GÜNCELLEME: Onboarding tamamlamamış kullanıcılar için warning + static content + CTA
  if (
    (userType === "anonymous" || userType === "authenticated") &&
    (!hasCompletedOnboarding || isUserSelectionsLoading)
  ) {
    if (isUserSelectionsLoading) {
      return <Spinner />;
    }

    return (
      <DashboardContainer>
        <OnboardingWarningBanner />
        <StaticDashboardContent />
      </DashboardContainer>
    );
  }

  // Error loading user selections
  if (isUserSelectionsError) {
    return (
      <DashboardContainer>
        <OnboardingWarningBanner />
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

  const handleStepClick = (step) => {
    setCurrentStep(step);
    navigate(`/summary/${applicationId}`);
  };

  const stepLabels = documents?.map((doc) => doc.docName) || [];
  const hasSponsor = userSelections?.find(
    (selection) => selection.ans_hassponsor === true
  );

  // NORMAL DASHBOARD İÇERİĞİ - Onboarding tamamlamış kullanıcılar için
  return (
    <DashboardContainer>
      {/* Show banners only for authenticated users */}
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
        {/* Desktop view */}
        {!isMobile && (
          <>
            <StepIndicatorWrapper>
              <Heading as="h14">Ülke adı</Heading>
              <StepIndicator
                documents={documents}
                completedDocuments={completedDocuments}
                applicationId={applicationId}
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
            stepLabels={stepLabels}
            currentStep={currentStep}
            handleStepClick={handleStepClick}
            completedDocuments={completedDocuments}
            documents={documents}
            hasSponsor={hasSponsor}
            firmLocation={firmLocation}
            isFirmLocationSuccess={isFirmLocationSuccess}
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
