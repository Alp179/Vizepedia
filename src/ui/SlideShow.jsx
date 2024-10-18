import { useState, useEffect } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"; // Apple Cards Carousel bileşenleri
import { fetchVisaBlogs } from "../services/apiBlogs";
import { useNavigate } from "react-router-dom";

// Bloglar için Apple Cards Carousel uyarlaması
export function SlideShow() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await fetchVisaBlogs(); // Blogları alıyoruz
        setBlogs(data);
      } catch (error) {
        console.error("Bloglar yüklenirken hata:", error);
      }
    }
    loadBlogs();
  }, []);

  const cards = blogs.map((blog, index) => (
    <Card
      key={blog.id}
      card={{
        category: blog.category || "Blog",
        title: blog.title,
        src: blog.cover_image || "default-image.jpg",
        content: (
          <div>
            <p>{blog.summary}</p>
          </div>
        ),
      }}
      index={index}
      onClick={() => navigate(`/blog/${blog.slug}`)} // Kart tıklanınca bloga yönlendirir
    />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Vize bloglarıyla tanışın!
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

export default SlideShow;
