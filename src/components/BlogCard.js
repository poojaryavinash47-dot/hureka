"use client";

import { useRouter } from "next/navigation";

export default function BlogCard({ post }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${post.slug}`);
  };

  const handleReadMore = (e) => {
    e.stopPropagation();
    router.push(`/blog/${post.slug}`);
  };

  return (
    <article className="blog-card" onClick={handleClick}>
      <div className="blog-image-wrapper">
        <img src={post.image} alt={post.title} className="blog-image" />
      </div>

      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-category-tag">
            <span className="dot-icon" />
            {post.category}
          </span>
        </div>

        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-description">{post.description}</p>

        <button className="blog-readmore" onClick={handleReadMore}>
          READ MORE
        </button>
      </div>
    </article>
  );
}
