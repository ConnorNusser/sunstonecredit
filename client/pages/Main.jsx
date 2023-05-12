import { Col, Container, Navbar, NavbarBrand, Row } from 'react-bootstrap';
import Cities from '../components/Cities';
import { useEffect } from 'react';
import axios from 'axios';

export default Main = () => {
  useEffect(() => {
    axios.get('/api/health').then((data) => console.log(data));
  }, []);
  return (
    <Container>
      <Navbar bg="dark" variant="dark">
        <Container>
          <NavbarBrand>Sunshine Corp</NavbarBrand>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col>Main content</Col>
        </Row>
        <Cities />
      </Container>
    </Container>
  );
};
