import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import axios from "axios";

const WorkoutSurvey = () => {
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    age: 40,
    gender: "female",
    weight_kg: 75,
    height_cm: 165,
    BMI: 27.55,
    fitness_goal: "weight_loss",
    experience_level: "beginner",
    days_per_week: 4,
    time_per_session_min: 45,
    preferred_workout_type: "full_body",
    workout_location: "home",
    condition: ["diabetes", "hypertension"],
    bp_level: "145/95",
    sugar_level_mg_dL: 160,
    available_equipment: ["dumbbells", "treadmill"],
  });

  const [workoutPlan, setWorkoutPlan] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, user_id: user?.id || null };
      const response = await axios.post("http://127.0.0.1:5000/predict_workout", payload);
      setWorkoutPlan(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch workout plan. Check backend connection.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "6rem", fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg, #e6f0ff, #f0f9ff)" }}>
      <Container-fluid>
        <h2 className="text-center fw-bold mb-4 text-primary">Workout Survey 🏋️‍♀️</h2>

        <Form className="p-4 shadow-lg bg-white rounded-4" onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Height (cm)</Form.Label>
                <Form.Control type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>BMI</Form.Label>
                <Form.Control type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Fitness Goal</Form.Label>
                <Form.Control type="text" name="fitness_goal" value={formData.fitness_goal} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Experience Level</Form.Label>
                <Form.Control type="text" name="experience_level" value={formData.experience_level} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Days per Week</Form.Label>
                <Form.Control type="number" name="days_per_week" value={formData.days_per_week} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Time per Session (min)</Form.Label>
                <Form.Control type="number" name="time_per_session_min" value={formData.time_per_session_min} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Workout Type</Form.Label>
                <Form.Control type="text" name="preferred_workout_type" value={formData.preferred_workout_type} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Workout Location</Form.Label>
                <Form.Control type="text" name="workout_location" value={formData.workout_location} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Health Conditions (comma separated)</Form.Label>
                <Form.Control type="text" name="condition" value={formData.condition.join(", ")} onChange={(e) => setFormData({ ...formData, condition: e.target.value.split(",").map(c => c.trim()) })} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>BP Level</Form.Label>
                <Form.Control type="text" name="bp_level" value={formData.bp_level} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Sugar Level (mg/dL)</Form.Label>
                <Form.Control type="number" name="sugar_level_mg_dL" value={formData.sugar_level_mg_dL} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Available Equipment (comma separated)</Form.Label>
                <Form.Control type="text" value={formData.available_equipment.join(", ")} onChange={(e) => setFormData({ ...formData, available_equipment: e.target.value.split(",").map(eq => eq.trim()) })} />
              </Form.Group>
            </Col>

            <Col md={12} className="text-center mt-4">
              <Button type="submit" style={{ backgroundColor: "#43e97b", border: "none", padding: "0.8rem 2rem", fontWeight: "600", borderRadius: "0.5rem" }}>
                Submit & Generate Workout Plan 🚀
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Display Workout Plan */}
        {workoutPlan && workoutPlan.rule_based_plan && (
          <div className="mt-5">
            <h4 className="text-center text-success mb-4">Recommended Workouts</h4>
            <Row className="g-4 justify-content-center">
              {workoutPlan.rule_based_plan.map((w, i) => (
                <Col md={5} lg={4} key={i}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card className="shadow-lg p-3 rounded-4">
                      <Card.Title className="fw-bold text-primary text-center">{w.name}</Card.Title>
                      <Card.Text>
                        Type: {w.type} <br />
                        Sets: {w.sets || "-"} <br />
                        Reps: {w.reps || "-"} <br />
                        Duration: {w.duration || "-"} <br />
                        Intensity: {w.intensity || "-"}
                      </Card.Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container-fluid>
    </div>
  );
};

export default WorkoutSurvey;
