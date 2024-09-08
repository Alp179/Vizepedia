import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogBySlug, fetchRelatedBlogs } from "../services/apiBlogs";
import Spinner from "../ui/Spinner";
import styled, { keyframes } from "styled-components";

// Fade-in animasyonu tanımlıyoruz
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

// Stil bileşenlerini oluşturuyoruz
const BlogDetailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 40px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlogContentWrapper = styled.div`
  flex: 2;
  position: relative;
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const BlogDate = styled.p`
  font-size: 1rem;
  color: #777;
  margin-bottom: 30px;
`;

const BlogContent = styled.div`
  line-height: 1.8;
  font-size: 2.1rem;
  color: #444;
  img {
    max-width: 100%;
    border-radius: 10px;
    margin: 20px 0;
  }
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: -20px;
  left: 0;
  background-color: rgba(0, 128, 0, 0.7); /* Kategori rengi */
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const RelatedBlogsWrapper = styled.div`
  flex: 1;
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
`;

const RelatedBlogTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const SmallRelatedBlogCard = styled(Link)`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  text-decoration: none;
  color: inherit;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Eklenmesi gereken transition */
  animation: ${fadeInUp} 0.5s ease both; /* Fade-in animasyonu */

  &:hover {
    transform: translateY(-10px); /* Hover'da yukarı kaydırma efekti */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Hover ile birlikte shadow artışı */
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
`;

const RelatedBlogInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RelatedBlogDate = styled.span`
  font-size: 0.8rem;
  color: #999;
`;

const RelatedBlogTitleSmall = styled.h4`
  font-size: 1rem;
  color: #333;
  margin: 5px 0;
`;

function BlogDetail() {
  const { slug } = useParams();
  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlogBySlug(slug),
  });

  const relatedTags = blog?.tags || "";
  const { data: relatedBlogs } = useQuery({
    queryKey: ["relatedBlogs", relatedTags],
    queryFn: () => fetchRelatedBlogs(relatedTags),
    enabled: !!relatedTags.length,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Blog içeriği yüklenirken bir hata oluştu.</p>;

  return (
    <BlogDetailContainer>
      <BlogContentWrapper>
        <CategoryBadge>{blog.category}</CategoryBadge>
        <GlassContainer>
          <BlogTitle>{blog.title}</BlogTitle>
          <BlogDate>
            {new Date(blog.created_at).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </BlogDate>
          {blog.cover_image && <img src={blog.cover_image} alt={blog.title} />}
          <BlogContent dangerouslySetInnerHTML={{ __html: blog.content }} />
        </GlassContainer>
      </BlogContentWrapper>

      <RelatedBlogsWrapper>
        <RelatedBlogTitle>Bunları Da Beğenebilirsiniz</RelatedBlogTitle>
        {relatedBlogs &&
          relatedBlogs.length > 0 &&
          relatedBlogs.map((relatedBlog) => (
            <SmallRelatedBlogCard
              to={`/blog/${relatedBlog.slug}`}
              key={relatedBlog.id}
            >
              <RelatedBlogImage
                src={relatedBlog.cover_image}
                alt={relatedBlog.title}
              />
              <RelatedBlogInfo>
                <RelatedBlogDate>
                  {new Date(relatedBlog.created_at).toLocaleDateString(
                    "tr-TR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </RelatedBlogDate>
                <RelatedBlogTitleSmall>
                  {relatedBlog.title}
                </RelatedBlogTitleSmall>
              </RelatedBlogInfo>
            </SmallRelatedBlogCard>
          ))}
      </RelatedBlogsWrapper>
    </BlogDetailContainer>
  );
}

export default BlogDetail;
