import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const AppNavbar = () => {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="shadow-sm"
      style={{
        background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
        padding: "0.8rem 0",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontWeight: "700",
            fontSize: "1.8rem",
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          CareFolio
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ borderColor: "#fff" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link
              as={Link}
              to="/"
              style={{
                color: location.pathname === "/" ? "#fff" : "#e0f7ff",
                fontWeight: "500",
              }}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard"
              style={{
                color:
                  location.pathname === "/dashboard" ? "#fff" : "#e0f7ff",
                fontWeight: "500",
              }}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/login"
              style={{
                color:
                  location.pathname === "/login" ? "#fff" : "#e0f7ff",
                fontWeight: "500",
              }}
            >
              Login
            </Nav.Link>

            {/* Register Button */}
            <Button
              as={Link}
              to="/register"
              style={{
                backgroundColor: "#fff",
                color: "#0077b6",
                fontWeight: "600",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.8rem",
                border: "none",
                transition: "all 0.3s ease",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f0f0f0";
                e.target.style.color = "#005b96";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.color = "#0077b6";
              }}
            >
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;


