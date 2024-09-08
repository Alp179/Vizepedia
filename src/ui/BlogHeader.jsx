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
  padding: 2.5rem 4.8rem;
  z-index: 2990;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const HeaderContents = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
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
`;

const SearchResultsContainer = styled.div`
  position: absolute;
  top: 90px;
  width: 100%;
  max-width: 500px;
  max-height: 300px; /* Maksimum yüksekliği 300 piksel olarak ayarladık */
  overflow-y: auto; /* Taşan içeriğin scroll ile erişilebilir olmasını sağladık */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 100;
  display: ${({ show }) => (show ? "block" : "none")};

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
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Kartlar arasına ince bir çizgi ekliyoruz */

  &:hover {
    text-decoration: underline;
  }
`;

const RelatedBlogImage = styled.img`
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const RelatedBlogInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RelatedBlogTitleSmall = styled.h4`
  font-size: 1rem;
  color: #333;
  margin: 5px 0;
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
        <Logo variant="mainpage" />
        <Logo variant="blogpage1" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            position: "relative",
          }}
        >
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
        </div>
      </HeaderContents>
    </StyledHeader>
  );
}

export default BlogHeader;
