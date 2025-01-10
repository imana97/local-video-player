import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Container className="text-center mt-5">
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/">Go to Home</Link>
    </Container>
  );
};

export default NotFound;
