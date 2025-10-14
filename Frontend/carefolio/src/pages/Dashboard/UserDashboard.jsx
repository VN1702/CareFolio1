import React from 'react';
import PropTypes from 'prop-types'; // Recommended for component prop validation
import { Link } from 'react-router-dom'; // Assuming a React Router is used for navigation

// --- Helper Component for Feature Cards ---
// This makes the dashboard code cleaner and the cards reusable/easier to style
const FeatureCard = ({ title, description, linkTo, iconClass }) => (
  <div className="col-lg-4 col-md-6 mb-4">
    <div className="card h-100 border-0 shadow-lg transition-hover">
      <div className="card-body p-4">
        {/* Optional Icon for visual appeal */}
        {iconClass && <i className={`${iconClass} text-primary fs-3 mb-3 d-block`}></i>}

        <h5 className="card-title fw-semibold text-dark mb-2">{title}</h5>
        <p className="card-text text-muted mb-3">{description}</p>

        {/* Call to action link */}
        <Link to={linkTo} className="btn btn-sm btn-outline-primary stretched-link">
          View Details
        </Link>
      </div>
    </div>
  </div>
);

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkTo: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
};
// ------------------------------------------

const UserDashboard = ({ userName = 'User' }) => {
  // Array of features to make the dashboard dynamic and easy to extend
  const features = [
    {
      title: "Personalized Meals",
      description: "Get AI-generated daily meal plans and recipes tailored to your dietary needs and preferences.",
      linkTo: "/meals",
      iconClass: "bi bi-egg-fried" // Example using Bootstrap Icons
    },
    {
      title: "Workout Plans",
      description: "Smart exercise recommendations, progress tracking, and custom routines to achieve your fitness goals.",
      linkTo: "/workouts",
      iconClass: "bi bi-activity"
    },
    {
      title: "Health Metrics",
      description: "Monitor key health data, view trends, and get insights into your overall well-being.",
      linkTo: "/metrics",
      iconClass: "bi bi-graph-up"
    }
  ];

  return (
    <div className="container-fluid mt-4 mt-lg-5">
      {/* Personalized Welcome Message */}
      <h2 className="fw-bold text-primary mb-1">
        Hello, {userName}!
      </h2>
      <p className="lead text-secondary mb-5">
        Welcome to your personalized CareFolio Dashboard. Let's check on your health progress.
      </p>

      {/* Feature Grid */}
      <div className="row g-4 justify-content-center">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            linkTo={feature.linkTo}
            iconClass={feature.iconClass}
          />
        ))}
      </div>
      
      {/* A section for quick actions or recent activity */}
      <div className="mt-5 pt-3 border-top">
        <h3 className="h4 text-secondary mb-3">Quick Actions</h3>
        <div className="d-flex flex-wrap gap-2">
            <Link to="/log-activity" className="btn btn-secondary">Log Activity</Link>
            <Link to="/settings" className="btn btn-outline-secondary">Update Preferences</Link>
        </div>
      </div>

    </div>
  );
};

// Define prop types for the main component as well
UserDashboard.propTypes = {
  userName: PropTypes.string,
};

export default UserDashboard;
