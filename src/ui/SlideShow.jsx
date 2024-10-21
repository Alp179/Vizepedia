import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BlogLogo from "./BlogLogo";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { fetchVisaBlogs } from "../services/apiBlogs";
import { useNavigate } from "react-router-dom";

const SlideSection = styled.div`
  margin: 100px 0 50px 0;
  padding: 0;
  height: 750px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: var(--color-grey-907);
  @media (max-width: 710px) {
    margin-top: 50px;
    flex-flow: column;
    height: 800px;
  }
`;

const SlideExplanation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin-left: 64px;
  max-width: 450px;
  @media (max-width: 1250px) {
    max-width: 300px;
    margin-left: 40px;
  }
  @media (max-width: 710px) {
    gap: 32px;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    margin-left: 0;
    text-align: center;
  }
`;

const SlideText = styled.p`
  font-weight: 500;
  font-size: 32px;
  background: linear-gradient(180deg, #1500ff 4.17%, #5900ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 1250px) {
    font-size: 28px;
  }
  @media (max-width: 710px) {
    font-size: 26px;
  }
  @media (max-width: 320px) {
    font-size: 22px;
  }
`;

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70%;
  position: relative;
  overflow: hidden;
  @media (max-width: 710px) {
    width: 100%;
  }
`;

const CardsWrapper = styled.div`
  width: 100%;
  display: flex;
  transition: transform 0.5s ease;
  transform: ${({ currentIndex }) => `translateX(-${currentIndex * 325}px)`};
  @media (max-width: 320px) {
    transform: ${({ currentIndex }) => `translateX(-${currentIndex * 280}px)`};
  }
`;

const Card = styled.div`
  width: 305px;
  height: 489px;
  margin: 10px;
  border-radius: 16px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  box-shadow: 0px 4px 24px -1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.4s;
  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 320px) {
    width: 260px;
    height: 520px;
  }
`;

const CardImage = styled.img`
  border-radius: 16px 16px 0px 0px;
  width: 100%;
  height: 305px;
  object-fit: cover;
`;

const CardDate = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 12px;
  margin-left: 20px;
`;

const CardHeading = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: var(--color-grey-600);
  margin-left: 20px;
  margin-top: 5px;
  margin-right: 10px;
`;

const DevaminiGor = styled.div`
  display: flex;
  align-items: center;
  color: #007bff;
  font-weight: bold;
  font-size: 16px;
  position: absolute;
  left: 20px;
  bottom: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  svg {
    margin-left: 5px;
    transition: margin-left 0.2s ease;
  }
  &:hover svg {
    margin-left: 10px;
  }
`;

const Button = styled.button`
  z-index: 3000;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 100%;
  border: none;
  cursor: pointer;
  font-size: 5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  &:hover {
    background-color: #004466;
    color: #00ffa2;
  }
`;

const LeftButton = styled(Button)`
  left: 10px;
`;

const RightButton = styled(Button)`
  right: 10px;
`;

function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const slideContainerRef = useRef(null);
  
  // Mouse and touch states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await fetchVisaBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Bloglar yüklenirken hata oluştu:", error);
      }
    }
    loadBlogs();
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const difference = startX - e.pageX;
      setTranslateX(difference);
    }
  };

  const handleMouseUp = () => {
    if (translateX > 50) {
      handleNextClick();
    } else if (translateX < -50) {
      handlePrevClick();
    }
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const difference = startX - e.touches[0].pageX;
      setTranslateX(difference);
    }
  };

  const handleTouchEnd = () => {
    if (translateX > 50) {
      handleNextClick();
    } else if (translateX < -50) {
      handlePrevClick();
    }
    setIsDragging(false);
    setTranslateX(0);
  };

  return (
    <SlideSection>
      <SlideExplanation>
        <BlogLogo variant="overview" />
        <SlideText>
          Seyahat, lezzet ve kültür maceralarınızda size eşlik edecek ilham
          verici içeriklerle tanışın!
        </SlideText>
      </SlideExplanation>
      <SlideContainer
        ref={slideContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <LeftButton onClick={handlePrevClick}>
          <FiChevronLeft />
        </LeftButton>

        <CardsWrapper currentIndex={currentIndex}>
          {blogs.map((blog) => (
            <Card key={blog.id} onClick={() => handleCardClick(blog.slug)}>
              <CardImage src={blog.cover_image || "default-image.jpg"} />
              <CardDate>
                {new Date(blog.created_at).toLocaleDateString()}
              </CardDate>
              <CardHeading>{blog.title}</CardHeading>
              <DevaminiGor>
                Devamını gör
                <ArrowForwardIcon />
              </DevaminiGor>
            </Card>
          ))}
        </CardsWrapper>

        <RightButton onClick={handleNextClick}>
          <FiChevronRight />
        </RightButton>
      </SlideContainer>
    </SlideSection>
  );
}

export default SlideShow;
