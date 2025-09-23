/* eslint-disable react/prop-types */
import styled from "styled-components";
import BlogSearchCards from "../ui/BlogSearchCards";
import SEO from "../components/SEO";
import JsonLd from "../components/JsonLd";
import { Link } from "react-router-dom";

const SearchResultsContainer = styled.div`
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

const SearchHeader = styled.h1`
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

const SearchTerm = styled.span`
  font-weight: 700;
  color: var(--color-brand-600);
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 600px;
  
  h3 {
    font-size: 1.5rem;
    color: var(--color-grey-916);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--color-grey-600);
    margin-bottom: 1.5rem;
  }
  
  .suggestions {
    margin-top: 1.5rem;
    
    h4 {
      font-size: 1.1rem;
      color: var(--color-grey-916);
      margin-bottom: 0.8rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        margin-bottom: 0.5rem;
        
        a {
          color: var(--color-brand-600);
          text-decoration: none;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const ResultCount = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--color-grey-500);
  margin-bottom: 2rem;
  font-weight: 500;
`;

const BackToBlog = styled.div`
  text-align: center;
  margin-top: 2rem;
  
  a {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: var(--color-brand-600);
    color: white;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.3s ease;
    
    &:hover {
      background: var(--color-brand-700);
    }
  }
`;

function BlogSearchResults({ blogs, query }) {
  return (
    <>
      <SEO
        title={`"${query}" Arama Sonuçları - Vizepedia Blog`}
        description={`"${query}" için arama sonuçları. Vize başvurusu süreçleri, seyahat ipuçları ve güncel vize haberleri.`}
        keywords={`blog, arama, ${query}, vize blog, seyahat ipuçları, vize haberleri, Vizepedia`}
        url={`https://www.vizepedia.com/blog?q=${encodeURIComponent(query)}`}
        noindex={true}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: `"${query}" Arama Sonuçları`,
          description: `"${query}" için Vizepedia blog arama sonuçları.`,
        }}
      />

      <SearchResultsContainer>
        <SearchHeader>
          Arama Sonuçları: <SearchTerm>&ldquo;{query}&rdquo;</SearchTerm>
        </SearchHeader>
        
        <ResultCount>
          {blogs.length} sonuç bulundu
        </ResultCount>

        {blogs.length > 0 ? (
          <>
            <BlogSearchCards blogs={blogs} query={query} />
            <BackToBlog>
              <Link to="/blog">Tüm Blog Yazılarına Dön</Link>
            </BackToBlog>
          </>
        ) : (
          <NoResults>
            <h3>Sonuç Bulunamadı</h3>
            <p>
              &ldquo;<strong>{query}</strong>&rdquo; için sonuç bulunamadı. Lütfen farklı
              bir anahtar kelime deneyin.
            </p>
            <div className="suggestions">
              <h4>Önerilen Aramalar:</h4>
              <ul>
                <li><Link to="/blog?q=vize">vize</Link></li>
                <li><Link to="/blog?q=seyahat">seyahat</Link></li>
                <li><Link to="/blog?q=schengen">schengen</Link></li>
                <li><Link to="/blog?q=amerika">amerika</Link></li>
                <li><Link to="/blog?q=turist">turist</Link></li>
              </ul>
            </div>
            <BackToBlog>
              <Link to="/blog">Tüm Blog Yazılarını Görüntüle</Link>
            </BackToBlog>
          </NoResults>
        )}
      </SearchResultsContainer>
    </>
  );
}

export default BlogSearchResults;