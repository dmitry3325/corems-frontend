import { Link } from 'react-router-dom';

import AppLayout from '@/app/layout/AppLayout';
import { ROUTE_HOME } from '@/app/Router';
import { Button, Container } from 'react-bootstrap';

const NotFound = () => {
  return (
    <AppLayout>
      <Container className="page-not-found">
        <h1 className="title">404</h1>
        <h3>The Page you're looking for is not found.</h3>
        <Link to={ROUTE_HOME}>
          <Button className="btn btn-primary" size="lg" type="button">Go Back</Button>
        </Link>
      </Container>
    </AppLayout>
  );

}

export default NotFound;