import { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import DarkModeToggle from "./DarkModeToggle";
import { useQuery } from "@tanstack/react-query";
import { searchBlogs } from "../services/apiBlogs";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

const BlogLogo = styled.img`
  cursor: pointer;
  transition: filter 0.5s ease, transform 0.5s ease; /* Renk ve dönüşüm animasyonu */

  &:hover {
    filter: ${(props) =>
      props.isDarkMode
        ? "hue-rotate(280deg)"  /* Dark Mode: Renk tonu değişimi */
        : "hue-rotate(360deg)"};
  }
  position: absolute;
  top: 50%;
  left: 50%;
  width: 165px;
  transform: translate(-50%, -50%);
  height: auto;
  flex-shrink: 0;
  @media (max-width: 1300px) {
    width: 140px;
  }
  @media (max-width: 1050px) {
    transform: ${({ isHovered, isActive }) =>
      isHovered || isActive
        ? "translate(-120%, -50%)"
        : "translate(-50%, -50%)"};
  }
  @media (max-width: 910px) {
    width: 120px;
  }
  @media (max-width: 710px) {
    width: 100px;
  }
  @media (max-width: 470px) {
    transform: ${({ isHovered, isActive }) =>
      isHovered || isActive
        ? "translate(-150%, -50%)"
        : "translate(-50%, -50%)"};
  }
  @media (max-width: 380px) {
    transform: ${({ isHovered, isActive }) =>
      isHovered || isActive
        ? "translate(-170%, -50%)"
        : "translate(-50%, -50%)"};
    width: 80px;
  }
  @media (max-width: 300px) {
    transform: ${({ isHovered, isActive }) =>
      isHovered || isActive
        ? "translate(-170%, -50%)"
        : "translate(-50%, -50%)"};
  }
`;

const Logo = styled.img`
  cursor: pointer;
  transition: filter 0.5s ease, transform 0.5s ease; /* Renk ve dönüşüm animasyonu */

  &:hover {
    filter: brightness(0) invert(0.4); /* Logo hoverlandığında beyaza döner */
  }
  width: 165px;
  transform: translate(0, 0);
  height: auto;
  flex-shrink: 0;
  @media (max-width: 1300px) {
    width: 140px;
    position: relavite;
  }
  @media (max-width: 910px) {
    width: 120px;
  }
  @media (max-width: 710px) {
    width: 75px;
  }
  @media (max-width: 470px) {
    transform: ${({ isHovered, isActive }) =>
      isHovered || isActive ? "translate(-150%, 0%)" : "translate(0%, 0%)"};
  }
  @media (max-width: 380px) {
    width: 60px;
  }
`;

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

const BlogInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ isActive }) => (isActive ? "300px" : "40px")};
  height: 40px;
  background-color: ${({ theme }) =>
    theme === "dark" ? "var(--color-grey-900)" : "var(--color-grey-300)"};
  border-radius: 50px;
  padding: 5px;
  @media (max-width: 780px) {
    font-size: 14px;
    width: ${({ isActive }) => (isActive ? "250px" : "40px")};
  }
  @media (max-width: 650px) {
    width: ${({ isActive }) => (isActive ? "200px" : "40px")};
  }
  @media (max-width: 470px) {
    width: ${({ isActive }) => (isActive ? "180px" : "30px")};
    height: 30px;
  }
  transition: width 0.4s ease, background-color 0.4s ease;
  box-shadow: ${({ theme }) =>
    theme === "dark"
      ? "0px 4px 8px rgba(255, 255, 255, 0.2)"
      : "var(--shadow-sm)"};

  &:focus-within,
  &:hover {
    width: 300px;
    @media (max-width: 780px) {
      width: 250px;
    }
    @media (max-width: 650px) {
      width: 200px;
    }
    @media (max-width: 470px) {
      width: 180px;
    }
    @media (max-width: 350px) {
      width: 140px;
    }
    background-color: ${({ theme }) =>
      theme === "dark" ? "var(--color-grey-800)" : "var(--color-white)"};
    box-shadow: ${({ theme }) =>
      theme === "dark"
        ? "0px 4px 8px rgba(255, 255, 255, 0.2)"
        : "0px 4px 8px rgba(0, 0, 0, 0.2)"};
  }
`;

const BlogInput = styled.input`
  height: 100%;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  padding: 0 25px; /* Padding'i artırdık */
  font-size: 16px;
  @media (max-width: 470px) {
    font-size: 13px;
  }
  @media (max-width: 350px) {
    font-size: 12px;
  }
  color: ${({ theme }) =>
    theme === "dark" ? "var(--color-white)" : "var(--color-grey-900)"};

  &::placeholder {
    color: ${({ theme }) =>
      theme === "dark" ? "var(--color-grey-500)" : "var(--color-grey-500)"};
    opacity: 1;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  font-size: 1.5rem;
  color: ${({ theme }) =>
    theme === "dark" ? "var(--color-white)" : "var(--color-grey-600)"};
  cursor: pointer;
  opacity: ${({ isActive }) => (isActive ? 0 : 1)};
  visibility: ${({ isActive }) => (isActive ? "hidden" : "visible")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  display: ${({ isActive }) => (isActive ? "none" : "block")};
  @media (max-width: 470px) {
    left: 7px;
  }
`;

const ArrowIcon = styled.div`
  position: absolute;
  right: 10px;
  font-size: 1.5rem;
  color: ${({ theme }) =>
    theme === "dark" ? "var(--color-white)" : "var(--color-grey-600)"};
  cursor: pointer;
  display: ${({ isActive }) => (isActive ? "block" : "none")};
`;

const SearchResultsContainer = styled.div`
  position: absolute;
  top: 65px;
  right: 10%;
  width: 350px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--color-grey-912);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 2999;
  display: ${({ show }) => (show ? "block" : "none")};

  @media (max-width: 910px) {
    width: 320px;
    padding: 8px;
  }
  @media (max-width: 780px) {
    width: 280px;
  }
  @media (max-width: 650px) {
    width: 250px;
  }
  @media (max-width: 470px) {
    width: 200px;
    top: 53px;
  }

  &::-webkit-scrollbar {
    width: 12px;
    @media (max-width: 780px) {
      width: 10px;
    }
    @media (max-width: 470px) {
      width: 8px;
    }
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-54);
    border-radius: 10px;
    border: 3px solid var(--color-grey-2);
    @media (max-width: 470px) {
      border: 2px solid var(--color-grey-2);
    }
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  @media (max-width: 650px) {
    height: 80px;
  }
  @media (max-width: 470px) {
    height: 70px;
    gap: 8px;
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
  @media (max-width: 650px) {
    width: 80px;
    height: 65px;
  }
  @media (max-width: 470px) {
    width: 70px;
    height: 60px;
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
  @media (max-width: 780px) {
    font-size: 12px;
  }
  @media (max-width: 470px) {
    font-size: 10px;
  }
`;

function BlogHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const searchInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const handleLogoClick = () => {
    navigate("/mainpage");
  };
  const handleBlogLogoClick = () => {
    navigate("/blog");
  };

  const srcBlog = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-darkmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWRhcmttb2RlLnBuZyIsImlhdCI6MTcyODE0MTExNSwiZXhwIjo0NDI4OTY5NjM1NTE1fQ.DJfCjO8CPxbxmTwr9wacpvI3XFBcmFvjO-jvWVQfp9k&t=2024-10-05T15%3A11%3A56.016Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vblog-lightmode.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZibG9nLWxpZ2h0bW9kZS5wbmciLCJpYXQiOjE3MjgxNDExMzIsImV4cCI6MzU2NDk2OTYzNTUzMn0.o5K7iHOeB2PbLuq24iVqbukYV2MLEjOXbCfECMLj20w&t=2024-10-05T15%3A12%3A13.053Z";

  const srcLogo = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/Varl_k_20_light_8x.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL1Zhcmxfa18yMF9saWdodF84eC5wbmciLCJpYXQiOjE3MjA5ODI4MjQsImV4cCI6NjgwNzk1NTYyNH0.q3TYM9XCjpsVsD7gQxFaQfRHTKqxhjHwLDzagSY1YY8&t=2024-07-14T18%3A47%3A05.607Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/Varl_k_20_8x.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL1Zhcmxfa18yMF84eC5wbmciLCJpYXQiOjE3MjA5ODIzNjUsImV4cCI6NzU2ODI3NTE2NX0.uo2NgeaGhKZjiNKp5qq4ikIZTlDCkRCZ21ENwcwldLE&t=2024-07-14T18%3A39%3A25.590Z";
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
        setSearchTerm(""); // Search bar'ı temizle
        setIsActive(false); // Search bar'ı küçült
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm]);

  const handleSearchClick = () => {
    setIsActive(true);
    searchInputRef.current.focus();
  };

  const handleBlogClick = (slug) => {
    setShowSearchResults(false);
    navigate(`/blog/${slug}`);
  };

  return (
    <StyledHeader>
      <HeaderContents>
        <Logo
          onClick={handleLogoClick}
          src={srcLogo}
          isHovered={isHovered}
          isActive={isActive}
        />
        <BlogLogo
          onClick={handleBlogLogoClick}
          src={srcBlog}
          isHovered={isHovered}
          isActive={isActive}
        />

        <InputAndDarkToggleContainer>
          <BlogInputWrapper isActive={isActive}>
            <SearchIcon isActive={isActive} onClick={handleSearchClick}>
              🔍
            </SearchIcon>
            <BlogInput
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              ref={searchInputRef}
              type="text"
              placeholder="Bloglarda ara..."
              value={searchTerm}
              isActive={isActive}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsActive(true);
                setShowSearchResults(true);
              }}
            />
            <ArrowIcon isActive={isActive}>➡️</ArrowIcon>
          </BlogInputWrapper>
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
