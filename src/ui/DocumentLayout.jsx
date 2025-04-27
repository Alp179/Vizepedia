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

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const { data: userSelections, isSuccess: isUserSelectionsSuccess } = useQuery({
    queryKey: ["userSelections", userId, applicationId],
    queryFn: () => fetchUserSelectionsDash(userId, applicationId),
    enabled: !!userId && !!applicationId,
  });

  useEffect(() => {
    if (isUserSelectionsSuccess && userSelections?.length > 0) {
      const ansCountry = userSelections[0]?.ans_country;
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

        setCountryCode(countryToCode[ansCountry] || "");
      }
    }
  }, [userSelections, isUserSelectionsSuccess]);

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