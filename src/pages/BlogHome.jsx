import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "../services/apiBlogs";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Logo from "../ui/Logo";

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
  margin: 50px auto;
  padding: 20px;
  position: relative;
  @media (max-width: 1300px) {
    width: 90%;
  }
  @media (max-width: 550px) {
    margin-top: 0;
  }
`;

const Divider = styled.div`
  max-width: 1400px;
  width: 90%;
  height: 1px;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--color-grey-904);
`;

const BlogHeader = styled.h1`
  font-weight: 100;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-bottom: 20px;
  font-size: 72px;
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
  @media (max-width: 370px) {
    font-size: 20px;
  }
  @media (max-width: 320px) {
    font-size: 17px;
  }
`;

const CategoriesWrapper = styled.div`
  margin-top: 100px;
  display: flex;
  overflow-x: hidden;
  position: relative;
  @media (max-width: 550px) {
    margin-top: 30px;
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 910px) {
    gap: 10px;
  }
`;

const CategoryColumn = styled.div`
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 910px) {
    flex: 0 0 250px;
  }
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
  display: flex;
  flex-direction: column;
  height: 360px;
  background: var(--color-grey-909);
`;

const SmallBlogItem = styled(BlogItem)`
  height: 120px;
  display: flex;
  align-items: center;
  background: var(--color-grey-909);

  // Yeni kartların animasyonlu olarak görünmesini sağlıyoruz
  animation: ${fadeInUp} 0.5s ease both;
`;

const CategoryLabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--color-grey-911);
  color: var(--color-grey-600);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
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
  margin-right: auto;
  margin-bottom: auto;
  border-radius: 8px;
`;

const BlogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
`;

const SmallBlogContent = styled.div`
  gap: 8px;
  margin: 4px 4px 0 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BlogTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--color-grey-600);
  @media (max-width: 910px) {
    font-size: 13px;
  }
`;

const BlogExcerpt = styled.p`
  max-height: 0px;
  font-size: 12px;
  color: var(--color-grey-600);
  @media (max-width: 910px) {
    font-size: 11px;
  }
`;

const BlogDate = styled.span`
  font-size: 11px;
  color: #999;
`;

const ContinueReading = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #007bff;
  font-weight: bold;
  font-size: 11px;
  position: absolute;
  bottom: 1%;
  left: 5%;
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
  margin: -10px;
  top: 41%; /* Butonu büyük kartların ortasına kaydırıyoruz */
  transform: translateY(-50%);
  background-color: var(--color-grey-905);
  color: var(--color-grey-910);
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
  @media (max-width: 610px) {
    margin: 0;
  }

  &:hover {
    background-color: #004466;
    color: #00ffa2;
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
  font-size: 18px;
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
      initialCounts[category] = window.innerWidth <= 910 ? 2 : 3 ;
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
    // Ekran genişliği 910px'in altında ise scrollAmount 250 olacak, aksi halde 300 olacak
    const scrollAmount = window.innerWidth <= 910 ? 260 : 320; 
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
    <>
      <BlogContainer>
        <BlogHeader>Başlayın Keşfedin Vize Alın</BlogHeader>
        <BlogHeader>
          <strong>Seyahat Edin</strong>
        </BlogHeader>
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
                      <Link
                        style={{ display: "flex", margin: "0 auto auto 0" }}
                        to={`/blog/${blog.slug}`}
                      >
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
                      <ContinueReading to={`/blog/${latestBlog.slug}`}>
                        Devamını Gör
                        <ArrowForwardIcon />
                      </ContinueReading>
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

      <Divider />

      <div className="bulten-abone">
        <div
          className="bulten-responsive"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <div className="bulten-header">Bültenimize Abone ol</div>
          <div className="bulten-subtext">
            Vize duyuruları ve en son blog yazılarımızdan ilk sizin haberiniz
            olsun. Hemen abone olun!
          </div>
        </div>
        <div
          className="bulten-inputvelogo"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "flex-end",
          }}
        >
          <Logo variant="bulten" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div className="bulten-input">
              <img src="images/mail-image.png" />
              <input className="bulten-mail" />
            </div>
            <button className="bulten-abone-buton">Abone ol</button>
          </div>
        </div>
      </div>

      <div className="footer">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "34px",
          }}
        >
          <div className="footer-header">
            Vize başvurusu yapmak hiç bu kadar kolay olmamıştı.
          </div>
          <div className="ceper">
            <div className="footer-buton">Hemen başlayın</div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div
          className="footer-wrap"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            maxWidth: "80%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Logo variant="footer" />
          <div style={{ display: "flex", gap: "30px" }}>
            <div className="footer-links">Ana Sayfa</div>
            <div className="footer-links">Hakkında</div>
            <div className="footer-links">Blog</div>
          </div>
          <div style={{ display: "flex", gap: "25px" }}>
            <img src="images/linkedin.png" />
            <img src="images/Facebook.png" />
            <img src="images/Instagram.png" />
            <img src="images/Youtube.png" />
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogHome;
