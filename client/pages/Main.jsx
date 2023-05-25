import { Col, Container, Navbar, NavbarBrand, Row, Button } from 'react-bootstrap';
import Cities from '../components/Cities';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default Main = () => {
  const [infoLookup, setInfoLookup] = useState('');
  const handleLookup = () => {

  }
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
      <div>
      <Row width={'12rem'}>
      <input placeholder='Search for cities or a month to provide insights' width='12rem' value={infoLookup} onChange={(e) => setInfoLookup(e.target.value)}/>
      <Button size='sm' onClick={handleLookup}>Search</Button>
      </Row>
      <Cities/>
      </div>
      </Container>
    </Container>
  );
};
