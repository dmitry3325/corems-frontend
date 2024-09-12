import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import { ROUTE_HOME, ROUTE_LOGIN, ROUTE_USER, ROUTE_FEATURES, ROUTE_PRICING } from '@/app/Router';
import { RootState } from '@/app/Store';
import { useAppSelector } from '@/app/Hooks';

const AppHeader = () => {
  const auth = useAppSelector((state: RootState) => state.auth);

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-4" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to={ROUTE_HOME}>CoreMs</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTE_FEATURES}>Features</Nav.Link>
            <Nav.Link as={Link} to={ROUTE_PRICING}>Pricing</Nav.Link>
          </Nav>
          <Nav>
            {auth.isAuthenticated ? <Nav.Link as={Link} to={ROUTE_USER}>{auth.fullName}</Nav.Link> : <Nav.Link as={Link} to={ROUTE_LOGIN}>Login</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};


export default AppHeader;