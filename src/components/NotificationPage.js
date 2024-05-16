import React from 'react';
import { Button, Container, Header } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const NotificationPage = ({ totalQuestions, remainingQuestions }) => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate('/quiz');
  };

  return (
    <Container textAlign="center" style={{ padding: '50px' }}>
      <Header as='h1'>Quiz Notification</Header>
      <p>You have {remainingQuestions} out of {totalQuestions} questions remaining.</p>
      <Button primary size="huge" onClick={startQuiz}>
        Continue Quiz
      </Button>
    </Container>
  );
};

export default NotificationPage;
