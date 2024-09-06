import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../services/apiBlogs";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Yeni kartlar için animasyon tanımlıyoruz
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BlogContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 80px auto;
  padding: 20px;
  position: relative;
`;

const BlogHeader = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 60px ;
`;

const CategoriesWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
  position: relative;
`;

const CategoriesContainer = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.3s ease-in-out;
`;

const CategoryColumn = styled.div`
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BlogItem = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const LargeBlogItem = styled(BlogItem)`
  height: 350px;
`;

const SmallBlogItem = styled(BlogItem)`
  height: 120px;
  display: flex;
  align-items: center;
  gap: 10px;

  // Yeni kartların animasyonlu olarak görünmesini sağlıyoruz
  animation: ${fadeInUp} 0.5s ease both;
`;

const CategoryLabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  z-index: 2;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const SmallBlogImage = styled.img`
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const BlogContent = styled.div`
  padding: 10px;
`;

const SmallBlogContent = styled.div`
  flex: 1;
`;

const BlogTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const BlogExcerpt = styled.p`
  font-size: 0.9rem;
  margin-bottom: 10px;
  color: #666;
`;

const BlogDate = styled.span`
  font-size: 0.8rem;
  color: #999;
`;

const ContinueReading = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #007bff;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 10px;
  text-decoration: none;

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

const ArrowButton = styled.button`
  position: absolute;
  top: 40%; /* Butonu büyük kartların ortasına kaydırıyoruz */
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }

  &.left {
    left: -20px;
  }

  &.right {
    right: -20px;
  }
`;

const LoadMoreButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  margin: 40px auto;
  display: block;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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

  const containerRef = useRef(null);

  // Her kategori için küçük kartların sayısını yönetmek için state tutuyoruz
  const [visibleCounts, setVisibleCounts] = useState({});

  const initializeVisibleCounts = (categories) => {
    const initialCounts = {};
    categories.forEach((category) => {
      initialCounts[category] = 3;
    });
    setVisibleCounts(initialCounts);
  };

  if (isLoading) return <p>Yükleniyor...</p>;
  if (isError) return <p>Bloglar yüklenirken bir hata oluştu.</p>;

  // Blogları kategoriye göre gruplama
  const groupedBlogs = blogs.reduce((acc, blog) => {
    (acc[blog.category] = acc[blog.category] || []).push(blog);
    return acc;
  }, {});

  // İlk yükleme sırasında visibleCounts'u başlatma
  if (Object.keys(visibleCounts).length === 0) {
    initializeVisibleCounts(Object.keys(groupedBlogs));
  }

  const handleLoadMore = () => {
    setVisibleCounts((prevCounts) => {
      const updatedCounts = {};
      Object.keys(prevCounts).forEach((category) => {
        updatedCounts[category] = prevCounts[category] + 3;
      });
      return updatedCounts;
    });
  };

  const handleScroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 300; // Kaydırma miktarı
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (direction === "left") {
      if (container.scrollLeft <= 0) {
        container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    } else if (direction === "right") {
      if (container.scrollLeft >= maxScrollLeft) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Herhangi bir kategoride 3'ten fazla blog varsa "Daha Fazla Göster" butonunu göster
  const showLoadMoreButton = Object.keys(groupedBlogs).some(
    (category) => groupedBlogs[category].length > visibleCounts[category]
  );

  return (
    <BlogContainer>
      <BlogHeader>Başlayın Keşfedin Vize Alın</BlogHeader>
      <BlogHeader>Seyahat Edin</BlogHeader>
      <ArrowButton className="left" onClick={() => handleScroll("left")}>
        {"<"}
      </ArrowButton>
      <CategoriesWrapper ref={containerRef}>
        <CategoriesContainer>
          {Object.keys(groupedBlogs).map((category) => {
            const [latestBlog, ...otherBlogs] = groupedBlogs[category];
            const visibleCount = visibleCounts[category];

            return (
              <CategoryColumn key={category}>
                <LargeBlogItem>
                  <Link to={`/blog/${latestBlog.slug}`}>
                    <CategoryLabel>{category}</CategoryLabel>
                    {latestBlog.cover_image && (
                      <BlogImage
                        src={latestBlog.cover_image.trim()}
                        alt={latestBlog.title}
                      />
                    )}
                    <BlogContent>
                      <BlogDate>
                        {new Date(latestBlog.created_at).toLocaleDateString(
                          "tr-TR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </BlogDate>
                      <BlogTitle>{latestBlog.title}</BlogTitle>
                      <BlogExcerpt>
                        {latestBlog.content.substring(0, 50)}...
                      </BlogExcerpt>
                    </BlogContent>
                  </Link>
                  <ContinueReading to={`/blog/${latestBlog.slug}`}>
                    Devamını Gör
                    <ArrowForwardIcon />
                  </ContinueReading>
                </LargeBlogItem>
                {otherBlogs.slice(0, visibleCount).map((blog) => (
                  <SmallBlogItem key={blog.id}>
                    <Link to={`/blog/${blog.slug}`}>
                      {blog.cover_image && (
                        <SmallBlogImage
                          src={blog.cover_image.trim()}
                          alt={blog.title}
                        />
                      )}
                      <SmallBlogContent>
                        <BlogDate>
                          {new Date(blog.created_at).toLocaleDateString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </BlogDate>
                        <BlogTitle>{blog.title}</BlogTitle>
                      </SmallBlogContent>
                    </Link>
                  </SmallBlogItem>
                ))}
              </CategoryColumn>
            );
          })}
        </CategoriesContainer>
      </CategoriesWrapper>

      {/* Eğer herhangi bir kategoride 3'ten fazla blog varsa, "Daha Fazla Göster" butonunu göster */}
      {showLoadMoreButton && (
        <LoadMoreWrapper>
          <LoadMoreButton onClick={handleLoadMore}>
            Daha Fazla Göster
          </LoadMoreButton>
        </LoadMoreWrapper>
      )}

      <ArrowButton className="right" onClick={() => handleScroll("right")}>
        {">"}
      </ArrowButton>
    </BlogContainer>
  );
}

export default BlogHome;
