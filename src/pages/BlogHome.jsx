/* eslint-disable react/prop-types */

import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../services/apiBlogs";
import styled from "styled-components";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import SlideShow from "../ui/SlideShow";
import VectorOk from "../ui/VectorOk";
import BlogCardsMain from "../ui/BlogCardsMain";
import SearchBar from "../ui/SearchBar"; // Yeni SearchBar komponentini import ediyoruz
import SEO from "../components/SEO";

// BlogContainer ve diğer stiller
const BlogContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 60px auto;
  padding: 120px 50px 30px;
  position: relative;

  @media (max-width: 1300px) {
    width: 95%;
    padding: 120px 30px 20px;
  }
  @media (max-width: 550px) {
    margin-top: 20px;
    padding: 100px 15px 20px;
  }
`;

const Divider = styled.div`
  max-width: 1400px;
  width: 95%;
  height: 1px;
  margin: 40px auto;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-grey-904),
    transparent
  );
`;

const BlogHeaders = styled.div`
  margin-bottom: -30px;

  @media (max-width: 910px) {
    margin-bottom: -20px;
  }
  @media (max-width: 810px) {
    margin-bottom: -10px;
  }
`;

const HeaderveOk = styled.div`
  margin: 0 auto 30px; /* Reduced bottom margin to bring SearchBar closer */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 550px) {
    margin-bottom: 40px;
  }
  @media (max-width: 435px) {
    margin-bottom: 30px;
  }
`;

const BlogHeader = styled.h1`
  /* Keep original text color but enhance with shadows */
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 10px rgba(0, 0, 0, 0.3);
  font-weight: 100;
  color: var(--color-grey-916); /* Restore original color */
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-bottom: 20px;
  font-size: 72px;
  line-height: 1.1;
  letter-spacing: -0.5px;
  position: relative;

  /* Optional: add a very subtle outline to increase edge definition */
  -webkit-text-stroke: 0.2px rgba(0, 0, 0, 0.2);

  @media (max-width: 1300px) {
    font-size: 60px;
  }
  @media (max-width: 910px) {
    font-size: 52px;
  }
  @media (max-width: 810px) {
    font-size: 42px;
    margin-bottom: 10px;
  }
  @media (max-width: 660px) {
    font-size: 36px;
  }
  @media (max-width: 550px) {
    font-size: 32px;
  }
  @media (max-width: 485px) {
    font-size: 28px;
  }
  @media (max-width: 435px) {
    font-size: 24px;
  }
  @media (max-width: 390px) {
    font-size: 22px;
  }
  @media (max-width: 365px) {
    font-size: 20px;
  }
  @media (max-width: 320px) {
    font-size: 18px;
  }
`;

// For the "Seyahat Edin" text - keep original strong styling with subtle enhancements
const StrongText = styled.strong`
  font-weight: 700;
  position: relative;

  /* Add just enough shadow to make it stand out without changing its appearance */
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 12px rgba(0, 0, 0, 0.3);

  /* Optional: add a semi-transparent background to increase contrast with gradient behind */
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }
`;

// Yükleme göstergesi
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;

  &:after {
    content: "";
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid var(--color-grey-905);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Hata mesajı bileşeni
const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  margin: 30px 0;

  h3 {
    color: #d32f2f;
    margin-bottom: 10px;
  }

  p {
    color: var(--color-grey-600);
  }
`;

function BlogHome() {
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allBlogs"],
    queryFn: fetchAllBlogs,
  });

  // Yükleme durumunda iskelet göster
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Hata durumunda hata mesajı göster
  if (isError) {
    return (
      <ErrorMessage>
        <h3>Üzgünüz!</h3>
        <p>
          Bloglar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
      </ErrorMessage>
    );
  }

  return (
    <>
      <SEO
        title="Vizepedia Blog – Güncel Vize Rehberi Yazıları"
        description="Vize başvurusu süreçleri, seyahat ipuçları ve güncel vize haberlerini bulabileceğiniz Vizepedia blog sayfası."
        keywords="blog, vize blog, seyahat ipuçları, vize haberleri, Vizepedia"
        url="https://www.vizepedia.com/blog"
      />
      <BlogContainer>
        <HeaderveOk>
          <BlogHeaders>
            <BlogHeader>Başlayın Keşfedin Vize Alın</BlogHeader>
            <BlogHeader>
              <StrongText>Seyahat Edin</StrongText>
            </BlogHeader>
          </BlogHeaders>
          <VectorOk variant="blogpage" />

          {/* SearchBar komponenti VectorOk'tan sonra, başlığın hemen altında yer alıyor */}
          <SearchBar />
        </HeaderveOk>

        {/* BlogCardsMain komponenti blog verilerini props olarak alıyor */}
        <BlogCardsMain blogs={blogs} />
      </BlogContainer>

      <Divider />

      <SlideShow />

      <MailerLiteForm />

      <Footer />
    </>
  );
}

export default BlogHome;
