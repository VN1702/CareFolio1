const FeaturesSection = () => {
  const features = [
    {
      title: "Get Custom Meals 🍱",
      desc: "AI-generated meal plans tailored to your goals, health, and preferences.",
    },
    {
      title: "Personalized Workouts 🏋️‍♀️",
      desc: "Smart, adaptive workout suggestions based on your fitness level.",
    },
    {
      title: "Track Daily Progress 📈",
      desc: "Monitor attendance, completed tasks, and your wellness score.",
    },
    {
      title: "Expert Care 👩‍⚕️",
      desc: "Connect with verified health experts for guidance and feedback.",
    },
  ];

  return (
    <section id="features" className="py-5">
      <div className="container-fluid text-center">
        <h2 className="fw-bold mb-5 text-primary">Features</h2>
        <div className="row">
          {features.map((f, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm border-0 effect-hover-lift ">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{f.title}</h5>
                  <p className="card-text text-secondary">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
