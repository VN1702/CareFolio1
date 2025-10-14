import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="d-flex align-items-center justify-content-center text-center"
      style={{
        height: "100vh",
        width:"100%", // changed from minHeight to height
        background: "linear-gradient(135deg, #e6f8ef, #f9fcf8)",
        paddingTop: "70px", // matches navbar height
        overflow: "hidden",
        margin: 0, // ensures no default margin
      }}
    >
      <div className="container">
        <h1 className="fw-bold display-4 text-primary">
          Smarter Health, Secured with CareFolio 💙
        </h1>
        <p className="lead mt-3 text-secondary">
          Personalized wellness powered by AI. Protected by blockchain.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg mt-4 px-5 py-2">
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

