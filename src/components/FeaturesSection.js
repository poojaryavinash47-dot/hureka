export default function FeaturesSection() {
  const features = [
    {
      icon: "🌿",
      title: "Clean Ingredients",
      desc: "Carefully selected ingredients that are gentle and effective.",
    },
    {
      icon: "🛡️",
      title: "Trusted Performance",
      desc: "Dermatologically tested for safe daily use.",
    },
    {
      icon: "🌱",
      title: "Environment Friendly",
      desc: "Eco-conscious formulas that respect nature.",
    },
    {
      icon: "🧪",
      title: "Chemical Free",
      desc: "Free from harmful chemicals and toxins.",
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">
        Enhance Beauty With Hureka
      </h2>

      <div className="features-grid">
        {features.map((f, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}