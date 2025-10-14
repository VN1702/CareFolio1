// src/components/Dashboard/WorkoutSurvey.jsx
import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const WorkoutSurvey = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "female",
    weight_kg: "",
    height_cm: "",
    BMI: "",
    fitness_goal: "weight_loss",
    experience_level: "beginner",
    days_per_week: 4,
    time_per_session_min: 45,
    preferred_workout_type: "full_body",
    workout_location: "home",
    condition: [],
    bp_level: "",
    sugar_level_mg_dL: "",
    available_equipment: [],
    rule_based_plan: [],
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (weight && height) {
      return (weight / ((height / 100) ** 2)).toFixed(2);
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      BMI:
        name === "weight_kg" || name === "height_cm"
          ? calculateBMI(
              name === "weight_kg" ? value : formData.weight_kg,
              name === "height_cm" ? value : formData.height_cm
            )
          : formData.BMI,
    });
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const current = new Set(prev[name]);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [name]: Array.from(current) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("workoutSurvey", JSON.stringify(formData, null, 2));
    setLoading(true);
    try {
      // Replace this with your real API endpoint
      const res = await axios.post("http://localhost:5000/api/workout-plan", formData);
      setResponse(res.data);
      alert("Workout plan generated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send data to ML API");
    }
    setLoading(false);
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg">
        <h3 className="text-center mb-4">Workout Survey</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control
                  type="number"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Height (cm)</Form.Label>
                <Form.Control
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fitness Goal</Form.Label>
                <Form.Select
                  name="fitness_goal"
                  value={formData.fitness_goal}
                  onChange={handleChange}
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Experience Level</Form.Label>
                <Form.Select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Days per Week</Form.Label>
                <Form.Control
                  type="number"
                  name="days_per_week"
                  value={formData.days_per_week}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Time per Session (min)</Form.Label>
                <Form.Control
                  type="number"
                  name="time_per_session_min"
                  value={formData.time_per_session_min}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Health Conditions</Form.Label>
                <div>
                  {["diabetes", "hypertension", "none"].map((cond) => (
                    <Form.Check
                      inline
                      key={cond}
                      label={cond}
                      type="checkbox"
                      checked={formData.condition.includes(cond)}
                      onChange={() => handleMultiSelect("condition", cond)}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Blood Pressure</Form.Label>
                <Form.Control
                  type="text"
                  name="bp_level"
                  value={formData.bp_level}
                  onChange={handleChange}
                  placeholder="e.g. 145/95"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sugar Level (mg/dL)</Form.Label>
                <Form.Control
                  type="number"
                  name="sugar_level_mg_dL"
                  value={formData.sugar_level_mg_dL}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Available Equipment</Form.Label>
                <div>
                  {["dumbbells", "treadmill", "resistance band", "none"].map((item) => (
                    <Form.Check
                      inline
                      key={item}
                      label={item}
                      type="checkbox"
                      checked={formData.available_equipment.includes(item)}
                      onChange={() => handleMultiSelect("available_equipment", item)}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Button variant="success" type="submit" className="w-100" disabled={loading}>
                {loading ? "Sending to ML API..." : "Generate Workout Plan"}
              </Button>
            </Col>
          </Row>
        </Form>

        {response && (
          <div className="mt-4">
            <h5>Recommended Plan:</h5>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default WorkoutSurvey;
