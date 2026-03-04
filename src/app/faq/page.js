"use client";

import HeroBanner from "@/components/HeroBanner";
import { useState } from "react";
import "@/styles/faq.css";

const faqs = [
  {
    question: "What is Hureka?",
    answer:
      "Hureka is a wellness supplement brand focused on joint care, bone health, immunity and overall wellbeing.",
  },
  {
    question: "Are Hureka supplements safe to use daily?",
    answer:
      "Yes, our supplements are formulated with high quality ingredients and recommended daily dosages.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Most people notice improvements within 3–6 weeks of consistent use.",
  },
  {
    question: "Can I take multiple supplements together?",
    answer:
      "Yes, but always consult a healthcare professional if you have medical conditions.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "Yes, we provide delivery across India.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <>
      <HeroBanner title="FAQ" breadcrumb="Home / FAQ" />

      <section className="faq-page">
        <div className="faq-container">
        <h1 className="faq-heading">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Everything you need to know about Hureka supplements, usage, and delivery.
        </p>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`faq-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-arrow">▾</span>
                </button>

                <div className="faq-answer-wrapper">
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </section>
    </>
  );
}
