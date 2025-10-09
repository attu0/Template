import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./MainNavbar.css"

function MainNavbar() {
  return (
      <Navbar expand="lg" className="navbar-black">
        <Container>
          <Navbar.Brand href="#home" className="color-black">MUDRA</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#test">Test</Nav.Link>
              <Nav.Link href="#link">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand href="#home" className="color-black">Contact Us</Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default MainNavbar;
