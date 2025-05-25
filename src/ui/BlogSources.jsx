/* eslint-disable react/prop-types */
import styled from "styled-components";

// Kaynak Bölümü Stilleri
const SourcesSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 4rem 4rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }

  @media (max-width: 1400px) {
    max-width: 1200px;
  }

  @media (max-width: 1024px) {
    padding: 2.5rem 3.5rem 3.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0 2rem; /* Mobilde padding azaltıldı */
  }

  @media (max-width: 480px) {
    padding: 1rem 0 1.5rem;
  }
`;

const SourcesHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1.2rem; /* Mobilde header spacing azaltıldı */
  }
`;

const SourcesTitle = styled.h3`
  font-size: 1.9rem;
  font-weight: 700;
  color: var(--color-grey-600);
  margin-bottom: 0.8rem;
  letter-spacing: -0.02em;

`;

const SourcesSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-600);
  opacity: 0.7;
  font-weight: 400;
  
`;

// Desktop Grid - Orijinal tasarım
const SourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;

  @media (max-width: 768px) {
    display: none; /* Mobilde grid gizlenir */
  }
`;

// Mobile Container - Gap artırıldı
const MobileSourcesContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem; /* 0.6rem'den 1.2rem'e */
    justify-content: center;
  }
`;

// Desktop Source Card - Orijinal tasarım
const SourceCard = styled.a`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.8rem;
  text-decoration: none;
  color: var(--color-grey-600);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0071e3, transparent);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::before {
      transform: translateX(0);
    }

    .source-icon {
      transform: scale(1.1);
      color: #0071e3;
    }

    .source-text {
      color: #fff;
    }
  }
`;

// Mobile Source Link - Kompakt pill tasarım (100% büyütülmüş)
const MobileSourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem; /* 0.4rem'den 0.8rem'e */
  padding: 1rem 1.6rem; /* 0.5rem 0.8rem'den 1rem 1.6rem'e */
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem; /* 1rem'den 2rem'e */
  text-decoration: none;
  color: var(--color-grey-600);
  font-size: 1.5rem; /* 0.75rem'den 1.5rem'e */
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  max-width: 280px; /* 140px'den 280px'e */

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(0, 113, 227, 0.3);
    color: #fff;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.4rem; /* 0.4rem 0.7rem'den 0.8rem 1.4rem'e */
    font-size: 1.4rem; /* 0.7rem'den 1.4rem'e */
    max-width: 240px; /* 120px'den 240px'e */
  }
`;

// Mobile ikon - 100% büyütülmüş
const MobileSourceIcon = styled.div`
  width: 28px; /* 14px'den 28px'e */
  height: 28px; /* 14px'den 28px'e */
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    color: #0071e3;
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    width: 24px; /* 12px'den 24px'e */
    height: 24px; /* 12px'den 24px'e */
  }
`;

// Mobile domain text - kısaltılmış
const MobileSourceText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
`;

const SourceIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 0.6rem;
  background: rgba(0, 113, 227, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    color: #0071e3;
    transition: all 0.3s ease;
  }
`;

const SourceContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SourceDomain = styled.div`
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-grey-600);
  margin-bottom: 0.3rem;
  word-break: break-all;
  transition: color 0.3s ease;
`;

const SourceUrl = styled.div`
  font-size: 0.85rem;
  color: var(--color-grey-600);
  opacity: 0.6;
  word-break: break-all;
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
    "Courier New", monospace;
`;

// Kaynak linklerini parse etme fonksiyonu
const parseSources = (sourcesString) => {
  if (!sourcesString || sourcesString.trim() === "") return [];

  return sourcesString
    .split(",")
    .map((source) => source.trim())
    .filter((source) => source.length > 0)
    .map((source) => {
      // URL'yi temizle ve doğrula
      let cleanUrl = source;
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = "https://" + cleanUrl;
      }

      // Domain adını çıkar
      try {
        const url = new URL(cleanUrl);
        const domain = url.hostname.replace("www.", "");
        const shortUrl =
          url.hostname +
          url.pathname.slice(0, 30) +
          (url.pathname.length > 30 ? "..." : "");
        // Mobile için daha uzun domain (24 karakter)
        const mobileDomain =
          domain.length > 24 ? domain.slice(0, 24) + "..." : domain;
        return {
          url: cleanUrl,
          domain: domain,
          shortUrl: shortUrl,
          mobileDomain: mobileDomain,
        };
      } catch (error) {
        const shortSource =
          source.length > 24 ? source.slice(0, 24) + "..." : source;
        return {
          url: source,
          domain: "Kaynak Linki",
          shortUrl: source.length > 40 ? source.slice(0, 40) + "..." : source,
          mobileDomain: shortSource,
        };
      }
    });
};

function BlogSources({ sourcesString }) {
  const sources = parseSources(sourcesString);

  // Kaynak yoksa component'i render etme
  if (sources.length === 0) {
    return null;
  }

  return (
    <SourcesSection>
      <SourcesHeader>
        <SourcesTitle>Kaynaklar</SourcesTitle>
        <SourcesSubtitle>
          Bu makale hazırlanırken faydalanılan kaynak linkler
        </SourcesSubtitle>
      </SourcesHeader>

      {/* Desktop Grid */}
      <SourcesGrid>
        {sources.map((source, index) => (
          <SourceCard
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SourceIcon className="source-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </SourceIcon>

            <SourceContent>
              <SourceDomain className="source-text">
                {source.domain}
              </SourceDomain>
              <SourceUrl>{source.shortUrl}</SourceUrl>
            </SourceContent>
          </SourceCard>
        ))}
      </SourcesGrid>

      {/* Mobile Horizontal Layout */}
      <MobileSourcesContainer>
        {sources.map((source, index) => (
          <MobileSourceLink
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MobileSourceIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </MobileSourceIcon>
            <MobileSourceText>{source.mobileDomain}</MobileSourceText>
          </MobileSourceLink>
        ))}
      </MobileSourcesContainer>
    </SourcesSection>
  );
}

export default BlogSources;
