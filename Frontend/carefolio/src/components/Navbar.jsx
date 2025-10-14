import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const AppNavbar = () => {
  return (
    <Navbar expand="lg" bg="light" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">CareFolio</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button as={Link} to="/register" variant="primary">
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
