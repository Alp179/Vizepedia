import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "./Header";
import BackButton from "./BackButton";
import MobileMenu from "./MobileMenu";
import AnimatedFlag from "./AnimatedFlag";
import { useQuery } from "@tanstack/react-query";
import { fetchUserSelectionsDash } from "../utils/userSelectionsFetch";
import { getCurrentUser } from "../services/apiAuth";
import { AnonymousDataService } from "../utils/anonymousDataService";
import { useUser } from "../features/authentication/useUser";

const StyledAppLayout = styled.div`
  background: var(--color-grey-1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
`;

const Main = styled.main`
  background: var(--color-grey-1);
  padding: 4rem 4.8rem 6.4rem;
  width: 100%; // Genişliği %100 yaparak tam ekran kaplamasını sağlıyoruz
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: space-between;
  flex: 1;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 0;
 
  @media (max-width: 650px) {
    padding: 4rem 1rem;
  }
  @media (max-width: 450px) {
    padding: 4rem 0.5rem;
  }
  @media (max-width: 310px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  padding-top: 50px;
  width: 1200px;
  height: inherit;
  max-width: 100vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  @media (max-width: 1300px) {
    width: 95%;
  }
  @media (max-width: 680px) {
    width: 100%;
    gap: 0;
    margin: 0px;
  }
`;

const MobileMenuContainer = styled.div`
  @media (min-width: 710px) {
    display: none;
  }
`;

function DocumentLayout() {
  const { id: applicationId } = useParams();
  const [userId, setUserId] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  
  // FIXED: Add user type detection like Dashboard
  const { user } = useUser();
  const [userType, setUserType] = useState("loading");
  
  const isAnonymous = applicationId?.startsWith("anonymous-") || 
    (AnonymousDataService.isAnonymousUser() && !user);

  console.log("🔍 DocumentLayout Debug:");
  console.log("applicationId:", applicationId);
  console.log("user:", user);
  console.log("isAnonymous:", isAnonymous);
  console.log("userType:", userType);

  // FIXED: Improved user type detection
  useEffect(() => {
    async function determineUserType() {
      console.log("🔍 DocumentLayout - Determining user type...");
      
      if (user && user.id) {
        console.log("👤 DocumentLayout - User type: authenticated");
        setUserType("authenticated");
        setUserId(user.id);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.id) {
          console.log("👤 DocumentLayout - User type: authenticated (session)");
          setUserType("authenticated");
          setUserId(currentUser.id);
          return;
        }
      } catch (error) {
        console.log("❌ DocumentLayout - Error checking user:", error);
      }

      if (isAnonymous && AnonymousDataService.isAnonymousUser()) {
        console.log("👤 DocumentLayout - User type: anonymous");
        setUserType("anonymous");
        return;
      }

      console.log("👤 DocumentLayout - User type: unknown");
      setUserType("unknown");
    }

    determineUserType();
  }, [user, isAnonymous]);

  // FIXED: Enhanced query to support both user types
  const { data: userSelections, isSuccess: isUserSelectionsSuccess } = useQuery({
    queryKey: ["userSelections", userId, applicationId, userType],
    queryFn: () => {
      console.log("🔄 DocumentLayout - Fetching user selections...");
      console.log("userType:", userType, "userId:", userId, "applicationId:", applicationId);
      
      if (userType === "anonymous") {
        console.log("📄 DocumentLayout - Using AnonymousDataService");
        const anonymousData = AnonymousDataService.convertToSupabaseFormat();
        console.log("📄 DocumentLayout - Anonymous data:", anonymousData);
        return anonymousData;
      } else if (userType === "authenticated" && userId) {
        console.log("📄 DocumentLayout - Using fetchUserSelectionsDash");
        return fetchUserSelectionsDash(userId, applicationId);
      }
      
      console.log("❌ DocumentLayout - No valid query parameters");
      return null;
    },
    // FIXED: Enable query for both authenticated and anonymous users
    enabled: (userType === "authenticated" && !!userId) || 
             (userType === "anonymous" && AnonymousDataService.hasCompletedOnboarding()),
    staleTime: 5 * 60 * 1000,
  });

  // FIXED: Enhanced country code detection
  useEffect(() => {
    console.log("🔄 DocumentLayout - Country code effect triggered");
    console.log("userSelections:", userSelections);
    console.log("isUserSelectionsSuccess:", isUserSelectionsSuccess);
    
    if (isUserSelectionsSuccess && userSelections?.length > 0) {
      const ansCountry = userSelections[0]?.ans_country;
      console.log("🌍 DocumentLayout - Found country:", ansCountry);
      
      if (ansCountry) {
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

        const newCountryCode = countryToCode[ansCountry] || "";
        console.log("🏳️ DocumentLayout - Setting country code:", newCountryCode);
        setCountryCode(newCountryCode);
      }
    } else {
      console.log("⚠️ DocumentLayout - No user selections or not successful");
    }
  }, [userSelections, isUserSelectionsSuccess]);

  console.log("🏳️ DocumentLayout - Final country code:", countryCode);

  return (
    <StyledAppLayout>
      <BackButton />
      <Header />
      <MobileMenuContainer>
        <MobileMenu />
      </MobileMenuContainer>
      <Main>
        <AnimatedFlag countryCode={countryCode} />
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default DocumentLayout;