import React from "react";
import { Container, Card, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const navigate = useNavigate();

  // Placeholder user data (replace with API / auth context later)
  const user = {
    id: 1,
    name: "Varsha K.N.",
    email: "varsha@example.com",
    profile_pic: "https://i.pravatar.cc/150?img=5",
    daily_progress: {
      attendance: 80, // %
      tasks_completed: 6,
      total_tasks: 8,
      meal_survey_completed: 1, // 1 = yes, 0 = no
      workout_survey_completed: 0, // 1 = yes, 0 = no
    },
  };

  const cardStyle = {
    cursor: "pointer",
    borderRadius: "1rem",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    minHeight: "180px",
  };

  // Helper function to render survey completion status
  const renderSurveyStatus = (completed) =>
    completed ? <span className="text-success fw-bold">Completed ✅</span> : <span className="text-danger fw-bold">Pending ❌</span>;

  return (
    <div style={{ minHeight: "100vh", padding: "6rem 2rem", background: "#f9faff", fontFamily: "'Poppins', sans-serif" }}>
      <Container>
        <h2 className="text-center mb-4 text-primary fw-bold">Welcome, {user.name}!</h2>

        {/* Profile Card */}
        <Card className="shadow-lg p-4 mb-5 text-center">
          <Card.Img
            variant="top"
            src={user.profile_pic}
            alt="Profile"
            style={{ width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 1rem auto" }}
          />
          <Card.Title className="fw-bold">{user.name}</Card.Title>
          <Card.Text>Email: {user.email}</Card.Text>
          <Card.Text>User ID: {user.id}</Card.Text>
        </Card>

        {/* Dashboard Cards */}
        <Row className="g-4">
          {/* Meal Survey */}
          <Col xs={12} sm={6} md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card style={cardStyle} className="text-center p-3" onClick={() => navigate("/meal", { state: { user } })}>
                <Card.Title>🍽️ Meal Plan</Card.Title>
                <Card.Text>Take the survey & get personalized meals</Card.Text>
                <Button variant="primary">Start Survey</Button>
              </Card>
            </motion.div>
          </Col>

          {/* Workout Survey */}
          <Col xs={12} sm={6} md={6} lg={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card style={cardStyle} className="text-center p-3" onClick={() => navigate("/workout-survey", { state: { user } })}>
                <Card.Title>🏋️ Workout Plan</Card.Title>
                <Card.Text>Fill the survey & get your workout routine</Card.Text>
                <Button variant="success">Start Survey</Button>
              </Card>
            </motion.div>
          </Col>

          {/* Daily Progress */}
          <Col xs={12} sm={12} md={12} lg={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card style={cardStyle} className="p-3">
                <Card.Title className="text-center">📊 Daily Progress</Card.Title>
                <Card.Text className="mb-2">
                  Attendance: <strong>{user.daily_progress.attendance}%</strong>
                </Card.Text>
                <ProgressBar now={user.daily_progress.attendance} label={`${user.daily_progress.attendance}%`} className="mb-3" />

                <Card.Text>
                  Tasks Completed:{" "}
                  <strong>
                    {user.daily_progress.tasks_completed}/{user.daily_progress.total_tasks}
                  </strong>
                </Card.Text>
                <ProgressBar
                  now={(user.daily_progress.tasks_completed / user.daily_progress.total_tasks) * 100}
                  label={`${Math.round((user.daily_progress.tasks_completed / user.daily_progress.total_tasks) * 100)}%`}
                  className="mb-3"
                />

                <Card.Text>
                  Meal Survey: {renderSurveyStatus(user.daily_progress.meal_survey_completed)}
                </Card.Text>
                <Card.Text>
                  Workout Survey: {renderSurveyStatus(user.daily_progress.workout_survey_completed)}
                </Card.Text>
              </Card>
            </motion.div>
          </Col>

          {/* Expert Care */}
          <Col xs={12} sm={12} md={12} lg={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card style={cardStyle} className="text-center p-3">
                <Card.Title>🩺 Expert Care</Card.Title>
                <Card.Text>Receive personalized advice from doctors</Card.Text>
                <Button variant="danger">Consult Expert</Button>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserDashboard;
