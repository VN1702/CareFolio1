import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section
      className="py-5 text-center"
      style={{
        background: "linear-gradient(135deg, #d6f5e5, #f1fff7)",
      }}
    >
      <div className="container">
        <h2 className="fw-bold text-primary mb-3">
          Ready to Take Control of Your Health?
        </h2>
        <p className="lead text-secondary mb-4">
          Join CareFolio today and unlock smart, secure, and personalized wellness.
        </p>
        <Link to="/register" className="btn btn-success btn-lg px-5">
          Register Now
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
