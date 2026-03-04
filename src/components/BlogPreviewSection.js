"use client";

import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";
import { blogs } from "@/data/blogs";

export default function BlogPreviewSection() {
  const router = useRouter();

  const previewPosts = blogs.slice(0, 3);

  return (
    <section className="home-blog-section">
      <div className="blog-preview-section">
        <div className="blog-preview-header">
          <p className="section-subtitle">A Blog For Wellness</p>
          <h2 className="section-title">Be Glamorous</h2>
        </div>

        <div className="blog-preview-grid">
          {previewPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="blog-preview-footer">
          <button
            className="view-more-btn"
            onClick={() => router.push("/blog")}
          >
            VIEW MORE
          </button>
        </div>
      </div>
    </section>
  );
}
