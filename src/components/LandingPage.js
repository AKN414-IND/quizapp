import React from 'react';
import { Button, Container, Header } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate('/quiz');
  };

  return (
    <Container textAlign="center" style={{ padding: '50px' }}>
      <Header as='h1'>Welcome to the Quiz</Header>
      <Button primary size="huge" onClick={startQuiz}>
        Start
      </Button>
    </Container>
  );
};

export default LandingPage;
