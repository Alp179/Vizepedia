import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogBySlug, fetchRelatedBlogs } from "../services/apiBlogs";
import Spinner from "../ui/Spinner";
import { Link } from "react-router-dom";

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

  const relatedTags = blog?.tags || [];
  const { data: relatedBlogs } = useQuery({
    queryKey: ["relatedBlogs", relatedTags],
    queryFn: () => fetchRelatedBlogs(relatedTags),
    enabled: !!relatedTags.length,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Blog içeriği yüklenirken bir hata oluştu.</p>;

  return (
    <div>
      <h1>{blog.title}</h1>
      {blog.cover_image_url && (
        <img src={blog.cover_image_url} alt={blog.title} />
      )}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {relatedBlogs && relatedBlogs.length > 0 && (
        <div className="related-blogs">
          <h2>Benzer Yazılar</h2>
          {relatedBlogs.map((relatedBlog) => (
            <div key={relatedBlog.id} className="related-blog-item">
              <Link to={`/blog/${relatedBlog.slug}`}>
                <h3>{relatedBlog.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
