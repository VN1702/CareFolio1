import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DashboardCards = ({ user }) => {
  const navigate = useNavigate();

  const cardStyle = {
    cursor: "pointer",
    borderRadius: "1rem",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    minHeight: "180px",
  };

  return (
    <Row className="g-4 mt-4">
      <Col md={6} lg={3}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card style={cardStyle} onClick={() => navigate("/meal", { state: { user } })} className="text-center p-3">
            <Card.Title>🍽️ Meal Plan</Card.Title>
            <Card.Text>Take the survey & get personalized meals</Card.Text>
            <Button variant="primary">Start Survey</Button>
          </Card>
        </motion.div>
      </Col>

      <Col md={6} lg={3}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card style={cardStyle} onClick={() => navigate("/workout-survey", { state: { user } })} className="text-center p-3">
            <Card.Title>🏋️ Workout Plan</Card.Title>
            <Card.Text>Fill the survey & get your workout routine</Card.Text>
            <Button variant="success">Start Survey</Button>
          </Card>
        </motion.div>
      </Col>

      <Col md={6} lg={3}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card style={cardStyle} className="text-center p-3">
            <Card.Title>📊 Daily Progress</Card.Title>
            <Card.Text>Track attendance & completed tasks</Card.Text>
            <Button variant="warning">View Progress</Button>
          </Card>
        </motion.div>
      </Col>

      <Col md={6} lg={3}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card style={cardStyle} className="text-center p-3">
            <Card.Title>🩺 Expert Care</Card.Title>
            <Card.Text>Receive personalized advice from doctors</Card.Text>
            <Button variant="danger">Consult Expert</Button>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default DashboardCards;
