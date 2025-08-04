/* eslint-disable react/prop-types */
import { useState, useLayoutEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getDocumentsForSelections } from "../utils/documentsFilter";
import { fetchDocumentDetails } from "../utils/documentFetch";
import supabase from "../services/supabase";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import StepIndicator from "../ui/StepIndicator";
import FirmMap from "../ui/FirmMap";
import AnimatedFlag from "../ui/AnimatedFlag";
import MobileCarousel from "../ui/MobileCarousel";

// Styled components (Dashboard.jsx'den kopyalandı)
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

const PublicDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 710);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 710);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Demo senaryo için sabit veriler
  const demoUserSelections = useMemo(() => [
    {
      id: "demo-application",
      created_at: new Date().toISOString(),
      ans_country: "Almanya",
      ans_purpose: "Turistik",
      ans_profession: "Öğrenci", 
      ans_vehicle: "Uçak",
      ans_kid: "Hayir",
      ans_accommodation: "Otel",
      ans_hassponsor: true,
      ans_sponsor_profession: "Çalışan",
      has_appointment: false,
      has_filled_form: false
    }
  ], []);

  // Demo için document names'i hesapla
  const documentNames = useMemo(() => {
    return getDocumentsForSelections(demoUserSelections);
  }, [demoUserSelections]);

  // Supabase'den firm location bilgisini çek
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

  const { data: firmLocation, isSuccess: isFirmLocationSuccess } = useQuery({
    queryKey: ["firmLocation", "Almanya"],
    queryFn: () => fetchFirmLocation("Almanya"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Document details'i çek
  const {
    data: documents,
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
  } = useQuery({
    queryKey: ["documentDetails", documentNames],
    queryFn: () => fetchDocumentDetails(documentNames),
    enabled: !!documentNames.length,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Demo için completed documents (boş object - hiçbir belge tamamlanmamış)
  const completedDocuments = {};

  // Created at tarihini formatla
  const createdAt = new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isDocumentsLoading) {
    return <Spinner />;
  }

  if (isDocumentsError) {
    return <div>Error loading demo data.</div>;
  }

  return (
    <DashboardContainer>
      {/* Almanya bayrağı */}
      <AnimatedFlag countryCode="de" />

      {/* Created at tarihi */}
      <CustomRow type="horizontal">
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
      </CustomRow>

      <DashboardItems>
        {!isMobile && (
          <>
            <StepIndicatorWrapper>
              <Heading as="h14">Demo Vize Başvurusu</Heading>
              <StepIndicator
                documents={documents}
                completedDocuments={completedDocuments}
                applicationId="demo-application"
                userSelections={demoUserSelections}
                userType="demo"
                isLoading={isDocumentsLoading}
                isError={isDocumentsError}
                onDocumentClick={handleDocumentClick}
                onContinue={handleContinue}
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
            applicationId="demo-application"
            userSelections={demoUserSelections}
            userType="demo"
            isLoading={isDocumentsLoading}
            isError={isDocumentsError}
          />
        )}
      </DashboardItems>
    </DashboardContainer>
  );
};

export default PublicDashboard;