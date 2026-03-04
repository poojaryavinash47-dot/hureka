"use client";

import { useParams, useRouter } from "next/navigation";
import { blogs } from "@/data/blogs";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const post = blogs.find((b) => b.slug === slug);

  if (!post) {
    return (
      <section className="blog-detail-page">
        <p style={{ padding: 80 }}>Blog not found.</p>
      </section>
    );
  }

  return (
    
    <section className="blog-detail-page">
      <div className="blog-detail-header">
        <button
          className="blog-back-btn"
          onClick={() => router.push("/blog")}
        >
          ← Back to Blog
        </button>

        <span className="blog-category-tag">
          <span className="dot-icon" />
          {post.category}
        </span>
        <h1 className="blog-detail-title">{post.title}</h1>
      </div>

      <div className="blog-detail-hero">
        <img src={post.image} alt={post.title} className="blog-detail-image" />
      </div>

      <div className="blog-detail-body">
        <p>
          {post.description}
        </p>
        <p>
          This is a placeholder body for the blog article. Replace this with
          SEO-friendly, in-depth content about skincare routines, ingredients,
          and product education tailored to your brand.
        </p>
      </div>
    </section>
  );
}
