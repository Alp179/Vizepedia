/* eslint-disable react/prop-types */

import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../services/apiBlogs";
import styled from "styled-components";
import Footer from "../ui/Footer";
import MailerLiteForm from "../ui/MailerLiteForm";
import { lazy, Suspense } from "react";
import VectorOk from "../ui/VectorOk";
import BlogCardsMain from "../ui/BlogCardsMain";
import SearchBar from "../ui/SearchBar";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import BlogSearchResults from "./BlogSearchResults";

// Lazy load SlideShow
const SlideShow = lazy(() => import("../ui/SlideShow"));

// All your existing styled components remain the same...
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
  margin: 0 auto 30px;
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
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 10px rgba(0, 0, 0, 0.3);
  font-weight: 100;
  color: var(--color-grey-916);
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-bottom: 20px;
  font-size: 72px;
  line-height: 1.1;
  letter-spacing: -0.5px;
  position: relative;
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

const BlogSubheader = styled.h2`
  font-weight: 700;
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 12px rgba(0, 0, 0, 0.3);
  color: var(--color-grey-916);
  text-align: center;
  margin: 0 auto 10px;
  font-size: 42px;
  @media (max-width: 660px) {
    font-size: 28px;
  }
`;

const StrongText = styled.strong`
  font-weight: 700;
  position: relative;
  text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5), 0px 0px 12px rgba(0, 0, 0, 0.3);

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
  console.log("BlogHome rendered");
  const navigate = useNavigate();
  const { search } = useLocation();
  const q = useMemo(() => new URLSearchParams(search).get("q") || "", [search]);

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allBlogs"],
    queryFn: fetchAllBlogs,
    staleTime: 60_000,
  });

  const filtered = useMemo(() => {
    if (!blogs) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return blogs;

    return blogs.filter((b) => {
      // Tags alanını güvenli bir şekilde işle
      const tagsText = Array.isArray(b.tags)
        ? b.tags.join(" ")
        : typeof b.tags === "string"
        ? b.tags
        : "";

      // Aranacak alanları birleştir
      const searchableText = [b.title || "", b.summary || "", tagsText]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(needle);
    });
  }, [blogs, q]);

  // Determine which list to use for ItemList schema
  const listForSchema = q ? filtered : blogs;

  if (isLoading) {
    return <LoadingSpinner />;
  }

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

  // Eğer arama parametresi varsa, BlogSearchResults bileşenini göster
  if (q) {
    // En güncel blogları tarihe göre sırala
    const latestBlogs = [...blogs].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return (
      <BlogSearchResults blogs={filtered} query={q} latestBlogs={latestBlogs} />
    );
  }

  // Normal blog ana sayfası
  return (
    <>
      {/* UPDATED SEO COMPONENT - Always uses canonical /blog URL */}
      <SEO
        title="Vizepedia Blog – Güncel Vize Rehberi Yazıları"
        description="Vize başvurusu süreçleri, seyahat ipuçları ve güncel vize haberlerini bulabileceğiniz Vizepedia blog sayfası."
        keywords="blog, vize blog, seyahat ipuçları, vize haberleri, Vizepedia"
        url="https://www.vizepedia.com/blog"
        noindex={Boolean(q)} // q varsa noindex
        image="/logo.png"
      />

      {/* WebSite + SearchAction */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://www.vizepedia.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.vizepedia.com/blog?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* Blog schema */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Vizepedia Blog",
          url: "https://www.vizepedia.com/blog",
          description:
            "Vize başvuruları, seyahat ipuçları ve güncel vize haberleri.",
        }}
      />

      {/* ItemList schema - sadece arama yokken göster */}
      {!q && Array.isArray(listForSchema) && listForSchema.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: listForSchema.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://www.vizepedia.com/blog/${post.slug}`,
              name: post.title,
            })),
          }}
        />
      )}

      <BlogContainer>
        <HeaderveOk>
          <BlogHeaders>
            <BlogHeader>Başlayın Keşfedin Vize Alın</BlogHeader>
            <BlogSubheader>
              <StrongText>Seyahat Edin</StrongText>
            </BlogSubheader>
          </BlogHeaders>
          <VectorOk variant="blogpage" aria-hidden="true" />

          <SearchBar
            initialValue={q}
            onSearch={(value) => {
              const params = new URLSearchParams(search);
              if (value) params.set("q", value);
              else params.delete("q");
              navigate(`/blog?${params.toString()}`, { replace: false });
            }}
            ariaLabel="Bloglarda ara"
          />
        </HeaderveOk>

        <BlogCardsMain blogs={filtered} />
      </BlogContainer>

      <Divider />

      {/* Lazy loaded SlideShow */}
      <Suspense fallback={null}>
        <SlideShow />
      </Suspense>

      <MailerLiteForm />

      <Footer />
    </>
  );
}

export default BlogHome;
