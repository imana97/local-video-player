import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Video from './pages/Video';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Vite React App</Navbar.Brand>
          <Nav className="me-auto">
            {!isAuthenticated && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {!isAuthenticated && <Nav.Link as={Link} to="/register">Register</Nav.Link>}
          </Nav>
          <Nav className="ms-auto">
            {isAuthenticated && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<PrivateRoute component={Main} />} />
          <Route path="/video" element={<PrivateRoute component={Video} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
};

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default App;
