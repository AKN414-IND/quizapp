import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Quiz from './components/Quiz';
import LandingPage from './components/LandingPage';
import NotificationPage from './components/NotificationPage';
import questions from './questions.json'; // Assume you have your questions here

const App = () => {
  const [quizEnded, setQuizEnded] = useState(false);
  const [report, setReport] = useState(null);
  const [remainingQuestions, setRemainingQuestions] = useState(questions.length - 1);

  const handleQuizEnd = (result) => {
    setReport(result);
    setQuizEnded(true);
  };

  const handleShowNotification = (remainingQuestions) => {
    setRemainingQuestions(remainingQuestions);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={
          !quizEnded ? (
            <Quiz questions={questions} countdownTime={10800} onQuizEnd={handleQuizEnd} showNotification={handleShowNotification} />
          ) : (
            <div className="report">
              <h1>Quiz Report</h1>
              <p>Total Questions: {report.totalQuestions}</p>
              <p>Correct Answers: {report.correctAnswersCount}</p>
              <p>Wrong Answers: {report.wrongAnswersCount}</p>
              <p>Unanswered: {report.unansweredCount}</p>
              <p>Total Score: {report.score}</p>
            </div>
          )
        } />
        <Route path="/notification" element={<NotificationPage totalQuestions={questions.length - 1} remainingQuestions={remainingQuestions} />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
