// src/components/Dashboard/UserSurvey.jsx
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const UserSurvey = () => {
  const [formData, setFormData] = useState({
    age: "",
    height_cm: "",
    weight_kg: "",
    meals_per_day: "",
    has_diabetes: 0,
    has_hypertension: 0,
    sugar_level: "",
    sleep_hours: "",
    stress_level: "",
    bmr: "",
    tdee: "",
    systolic_bp: "",
    diastolic_bp: "",
    gender_male: 1,
    fitness_goal_weight_gain: 0,
    fitness_goal_weight_loss: 0,
    activity_level_moderate: 0,
    activity_level_sedentary: 0,
    diet_type_nonveg: 0,
    diet_type_vegan: 0,
    diet_type_vegetarian: 0,
    preferred_cuisine_Continental: 0,
    preferred_cuisine_Indian: 0,
    preferred_cuisine_Mediterranean: 0,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? e.target.checked ? 1 : 0 : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userSurvey", JSON.stringify(formData, null, 2));
    alert("Survey data saved successfully!");
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg">
        <h3 className="text-center mb-4">Health Survey</h3>
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
                <Form.Label>Sleep Hours</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="sleep_hours"
                  value={formData.sleep_hours}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stress Level (1-5)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  name="stress_level"
                  value={formData.stress_level}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Diet Type</Form.Label>
                <Form.Select
                  name="diet_type"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      diet_type_nonveg: val === "nonveg" ? 1 : 0,
                      diet_type_vegan: val === "vegan" ? 1 : 0,
                      diet_type_vegetarian: val === "vegetarian" ? 1 : 0,
                    });
                  }}
                >
                  <option value="">Select</option>
                  <option value="nonveg">Non-Veg</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Button variant="success" type="submit" className="w-100">
                Save Survey Data
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default UserSurvey;
