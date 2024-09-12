import { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import Logo from "./Logo";
import DarkModeToggle from "./DarkModeToggle";
import { useQuery } from "@tanstack/react-query";
import { searchBlogs } from "../services/apiBlogs";
import { useNavigate } from "react-router-dom";

const StyledHeader = styled.header`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  padding: 20px;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const HeaderContents = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 910px) {
    width: 90%;
  }
  @media (max-width: 550px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const InputAndDarkToggleContainer = styled.div`
  margin-left: auto;
  display: flex;
  gap: 4px;
  @media (max-width: 1300px) {
    align-self: flex-end;
  }
  @media (max-width: 550px) {
    gap: 0;
  }
`;

const BlogInput = styled.input`
  height: 44px;
  width: 256px;
  border: 2px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: 20px;
  background: transparent;
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  @media (max-width: 1300px) {
    width: 200px;
    height: 36px;
  }
  @media (max-width: 910px) {
    width: 160px;
  }
  @media (max-width: 710px) {
    width: 120px;
    font-size: 12px;
  }
  @media (max-width: 550px) {
    width: 75px;
    padding-left: 8px;
  }
`;

const SearchResultsContainer = styled.div`
  position: absolute;
  top: 65px;
  right: 10%;
  width: 350px;
  max-height: 300px; /* Maksimum yüksekliği 300 piksel olarak ayarladık */
  overflow-x: hidden;
  overflow-y: auto; /* Taşan içeriğin scroll ile erişilebilir olmasını sağladık */
  background: var(--color-grey-912);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 2999;
  display: ${({ show }) => (show ? "block" : "none")};

  @media (max-width: 910px) {
    width: 200px;
    padding: 8px;
  }

  /* Scrollbar görünümünü özelleştiriyoruz */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const SmallRelatedBlogCard = styled.div`
  align-items: center;
  display: flex;
  gap: 10px;
  width: 100%;
  height: 100px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  z-index: 2999;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Kartlar arasına ince bir çizgi ekliyoruz */

  @media (max-width: 910px) {
    height: 90px;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const RelatedBlogImage = styled.img`
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  @media (max-width: 910px) {
    width: 60px;
    height: 48px;
  }
`;

const RelatedBlogInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RelatedBlogTitleSmall = styled.h4`
  font-size: 13px;
  color: var(--color-grey-600);
  margin: 5px 0;
  @media (max-width: 910px) {
    font-size: 11px;
  }
`;

function BlogHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();

  const {
    data: filteredBlogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchBlogs", searchTerm],
    queryFn: () => (searchTerm.length >= 3 ? searchBlogs(searchTerm) : []),
    enabled: searchTerm.length >= 3,
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBlogClick = (slug) => {
    setShowSearchResults(false);
    navigate(`/blog/${slug}`);
  };

  return (
    <StyledHeader>
      <HeaderContents>
        <Logo variant="blogpage2" />
        <Logo variant="blogpage1" />

        <InputAndDarkToggleContainer>
          <BlogInput
            ref={searchInputRef}
            type="text"
            placeholder="Bloglarda ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(true);
            }}
          />
          <DarkModeToggle />
        </InputAndDarkToggleContainer>
        <SearchResultsContainer
          show={filteredBlogs.length > 0 && showSearchResults}
          ref={searchResultsRef}
        >
          {isLoading && <p>Yükleniyor...</p>}
          {isError && <p>Bir hata oluştu.</p>}
          {filteredBlogs.map((blog) => (
            <SmallRelatedBlogCard
              key={blog.id}
              onClick={() => handleBlogClick(blog.slug)}
            >
              <RelatedBlogImage src={blog.cover_image} alt={blog.title} />
              <RelatedBlogInfo>
                <RelatedBlogTitleSmall>{blog.title}</RelatedBlogTitleSmall>
              </RelatedBlogInfo>
            </SmallRelatedBlogCard>
          ))}
        </SearchResultsContainer>
      </HeaderContents>
    </StyledHeader>
  );
}

export default BlogHeader;
