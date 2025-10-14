const AboutSection = () => {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="fw-bold mb-4 text-primary">About CareFolio</h2>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: "800px" }}>
          CareFolio bridges the gap between fitness and clinical care.
          Using <b>Machine Learning</b> and <b>Blockchain</b>, it provides
          secure, intelligent, and personalized daily wellness plans for users
          managing serious health conditions.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
