import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

const App: React.FC = () => {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Vite React App</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1>Welcome to Vite + React + TypeScript + Bootstrap</h1>
      </Container>
    </div>
  );
};

export default App;
