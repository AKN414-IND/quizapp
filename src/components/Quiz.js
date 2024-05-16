import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Button,
  Header,
  Menu,
  Progress,
  List,
  Grid,
} from 'semantic-ui-react';

const Quiz = ({ questions, countdownTime, onQuizEnd, showNotification }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [timer, setTimer] = useState(countdownTime);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const scoringQuestionsCount = questions.length - 1;

  const handleTimeOut = useCallback(() => {
    onQuizEnd({
      score,
      correctAnswersCount,
      wrongAnswersCount,
      unansweredCount,
      totalQuestions: scoringQuestionsCount,
    });
  }, [onQuizEnd, score, correctAnswersCount, wrongAnswersCount, unansweredCount, scoringQuestionsCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1);
      else handleTimeOut();
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, handleTimeOut]);

  const handleItemClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (!isLastQuestion) {
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;

      if (isCorrect) {
        setScore(score + 4);
        setCorrectAnswersCount(correctAnswersCount + 1);
      } else if (selectedAnswer !== null) {
        setScore(score - 1);
        setWrongAnswersCount(wrongAnswersCount + 1);
      } else {
        setUnansweredCount(unansweredCount + 1);
      }
    }

    setAnswers(answers.map((ans, idx) => (idx === currentQuestionIndex ? selectedAnswer : ans)));

    if (isLastQuestion) {
      onQuizEnd({
        score,
        correctAnswersCount,
        wrongAnswersCount,
        unansweredCount,
        totalQuestions: scoringQuestionsCount,
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimer(countdownTime);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswer(answers[index]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / scoringQuestionsCount) * 100;

  return (
    <Container>
      <Grid>
        <Grid.Column width={4}>
          <Segment style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
            <List divided relaxed>
              {questions.slice(0, scoringQuestionsCount).map((q, index) => (
                <List.Item key={index}>
                  <Button
                    fluid
                    onClick={() => handleQuestionSelect(index)}
                    active={index === currentQuestionIndex}
                  >
                    {`Question ${index + 1}`}
                  </Button>
                </List.Item>
              ))}
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Progress percent={progressPercentage} indicating />
            <Item.Group divided>
              <Item>
                <Item.Content>
                  <Header as="h1" className="header">{`Question ${currentQuestionIndex + 1} of ${scoringQuestionsCount}`}</Header>
                  <div className="timer">Time left: {Math.floor(timer / 3600)}:{Math.floor((timer % 3600) / 60)}:{timer % 60}</div>
                  <Item.Description>
                    <h3 className="question">{currentQuestion.question}</h3>
                    <Menu vertical fluid>
                      {currentQuestion.options.map((option, i) => (
                        <Menu.Item
                          key={i}
                          name={option}
                          active={selectedAnswer === option}
                          onClick={() => handleItemClick(option)}
                          className="menu-item"
                        >
                          {option}
                        </Menu.Item>
                      ))}
                    </Menu>
                  </Item.Description>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column textAlign="left" width={8}>
                        <Button secondary onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                          Previous
                        </Button>
                      </Grid.Column>
                      <Grid.Column textAlign="right" width={8}>
                        {currentQuestionIndex === questions.length - 1 ? (
                          <Button primary onClick={handleNext} disabled={!selectedAnswer && selectedAnswer !== null}>
                            Submit
                          </Button>
                        ) : (
                          <Button primary onClick={handleNext} disabled={!selectedAnswer && selectedAnswer !== null}>
                            Next
                          </Button>
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

Quiz.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      correct_answer: PropTypes.string,
    })
  ).isRequired,
  countdownTime: PropTypes.number,
  onQuizEnd: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
};

export default Quiz;
