import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MealSurvey = () => {
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    age: 28,
    height_cm: 175,
    weight_kg: 72,
    meals_per_day: 3,
    has_diabetes: 0,
    has_hypertension: 0,
    sugar_level: 100,
    sleep_hours: 6.5,
    stress_level: 4,
    bmr: 1700,
    tdee: 2300,
    systolic_bp: 120,
    diastolic_bp: 80,
    gender_male: 1,
    fitness_goal_weight_gain: 0,
    fitness_goal_weight_loss: 1,
    activity_level_moderate: 0,
    activity_level_sedentary: 1,
    diet_type_nonveg: 1,
    diet_type_vegan: 0,
    diet_type_vegetarian: 0,
    preferred_cuisine_Continental: 0,
    preferred_cuisine_Indian: 1,
    preferred_cuisine_Mediterranean: 0,
  });

  const [mealPlan, setMealPlan] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, user_id: user?.id || null };
      const response = await axios.post("http://127.0.0.1:5000/predict_meal", payload);
      setMealPlan(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch meal plan. Check backend connection.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e6f8ef, #f9fcf8)", paddingTop: "6rem", fontFamily: "'Poppins', sans-serif" }}>
      <Container-fluid>
        <h2 className="text-center fw-bold mb-4 text-primary">Meal Survey 🍽️</h2>

        <Form className="p-4 shadow-lg bg-white rounded-4" onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Personal Info */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} />
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
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} />
              </Form.Group>
            </Col>

            {/* Health Info */}
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Has Diabetes"
                name="has_diabetes"
                checked={formData.has_diabetes === 1}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Has Hypertension"
                name="has_hypertension"
                checked={formData.has_hypertension === 1}
                onChange={handleChange}
              />
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Sugar Level</Form.Label>
                <Form.Control type="number" name="sugar_level" value={formData.sugar_level} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Blood Pressure (Systolic)</Form.Label>
                <Form.Control type="number" name="systolic_bp" value={formData.systolic_bp} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mt-1">
                <Form.Label>Blood Pressure (Diastolic)</Form.Label>
                <Form.Control type="number" name="diastolic_bp" value={formData.diastolic_bp} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Sleep Hours</Form.Label>
                <Form.Control type="number" step="0.1" name="sleep_hours" value={formData.sleep_hours} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Stress Level (1-5)</Form.Label>
                <Form.Control type="number" min="1" max="5" name="stress_level" value={formData.stress_level} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>BMR</Form.Label>
                <Form.Control type="number" name="bmr" value={formData.bmr} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mt-1">
                <Form.Label>TDEE</Form.Label>
                <Form.Control type="number" name="tdee" value={formData.tdee} onChange={handleChange} />
              </Form.Group>
            </Col>

            {/* Gender */}
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Male"
                name="gender_male"
                checked={formData.gender_male === 1}
                onChange={handleChange}
              />
            </Col>

            {/* Fitness Goal */}
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Weight Gain Goal"
                name="fitness_goal_weight_gain"
                checked={formData.fitness_goal_weight_gain === 1}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Weight Loss Goal"
                name="fitness_goal_weight_loss"
                checked={formData.fitness_goal_weight_loss === 1}
                onChange={handleChange}
              />
            </Col>

            {/* Activity Level */}
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Moderate Activity"
                name="activity_level_moderate"
                checked={formData.activity_level_moderate === 1}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Sedentary"
                name="activity_level_sedentary"
                checked={formData.activity_level_sedentary === 1}
                onChange={handleChange}
              />
            </Col>

            {/* Diet */}
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Non-Veg"
                name="diet_type_nonveg"
                checked={formData.diet_type_nonveg === 1}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Vegan"
                name="diet_type_vegan"
                checked={formData.diet_type_vegan === 1}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Vegetarian"
                name="diet_type_vegetarian"
                checked={formData.diet_type_vegetarian === 1}
                onChange={handleChange}
              />
            </Col>

            {/* Preferred Cuisine */}
            <Col md={8}>
              <Form.Label>Preferred Cuisine</Form.Label>
              <div>
                <Form.Check inline label="Continental" name="preferred_cuisine_Continental" type="checkbox" checked={formData.preferred_cuisine_Continental === 1} onChange={handleChange} />
                <Form.Check inline label="Indian" name="preferred_cuisine_Indian" type="checkbox" checked={formData.preferred_cuisine_Indian === 1} onChange={handleChange} />
                <Form.Check inline label="Mediterranean" name="preferred_cuisine_Mediterranean" type="checkbox" checked={formData.preferred_cuisine_Mediterranean === 1} onChange={handleChange} />
              </div>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit" style={{ backgroundColor: "#4facfe", border: "none", padding: "0.8rem 2rem", fontWeight: "600", borderRadius: "0.5rem" }}>
              Submit & Generate Meal Plan 🚀
            </Button>
          </div>
        </Form>

        {/* Display Meal Plan */}
        {mealPlan && (
          <div className="mt-5">
            <h4 className="text-center text-success mb-4">Recommended Meals</h4>
            <Row className="g-4 justify-content-center">
              {Object.entries(mealPlan).map(([mealType, details], index) => (
                <Col md={5} lg={4} key={index}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Card className="shadow-lg p-3 rounded-4">
                      <Card.Title className="fw-bold text-primary text-center">{mealType}</Card.Title>
                      <Card.Text>{Array.isArray(details) ? details.map((item, i) => <div key={i}>{item}</div>) : details}</Card.Text>
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

export default MealSurvey;

