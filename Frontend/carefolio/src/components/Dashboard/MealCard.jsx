// src/components/Dashboard/MealCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MealCard = ({ title, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/survey");
  };

  return (
    <Card className="shadow-sm my-3" style={{ cursor: "pointer" }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="success" onClick={handleClick}>
          Take Health Survey
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MealCard;
