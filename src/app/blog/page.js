"use client";

import HeroBanner from "@/components/HeroBanner";
import BlogCard from "@/components/BlogCard";
import { blogs } from "@/data/blogs";

export default function BlogListingPage() {
  return (
    <>
      <HeroBanner title="BLOG" breadcrumb="Home / Blog" />

      <section className="blog-section">
        <div className="blog-header">
          <p className="section-subtitle">Insights & Tips</p>
          <h2 className="section-title">Beauty & Wellness Journal</h2>
          <p className="blog-intro">
            Expert-backed guides, routines, and ingredient tips to help you
            build a simple, effective skincare ritual.
          </p>
        </div>

        <div className="blog-grid">
          {blogs.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
