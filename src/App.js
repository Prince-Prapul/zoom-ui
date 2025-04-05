import React, { useState } from 'react';
import './App.css';
import Quiz from './components/Quiz';
import InputForm from './components/InputForm';
import axios from 'axios';

function App() {
  const [meetingId, setMeetingId] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctness, setCorrectness] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const mockQuizData = {
    title: "Mock Quiz",
    questions: [
      {
        question: "What is the primary function of Amazon ECR?",
        options: [
          "To manage serverless functions directly.",
          "To securely store and manage container images.",
          "To deploy Lambda functions without containerization.",
          "To provide free, unlimited storage for Docker images.",
        ],
        correctAnswer: "To securely store and manage container images.",
      },
      {
        question: "Where is the Lambda function code stored?",
        options: [
          "In an S3 bucket.",
          "Directly within the Lambda function.",
          "In a Docker image stored in Amazon ECR.",
          "In a local Docker repository.",
        ],
        correctAnswer: "In a Docker image stored in Amazon ECR.",
      }
    ],
  };

  const handleStartQuiz = async () => {
    // Allow fallback to mock data
    if (meetingId === "mock") {
      setQuizData(mockQuizData);
      setQuizStarted(true);
      setCorrectness(Array(mockQuizData.questions.length).fill(null));
      setUserAnswers(Array(mockQuizData.questions.length).fill(null));
      setSubmitted(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/quiz/${meetingId}`);
      const realQuizData = {
        title: `Quiz for Meeting ${meetingId}`,
        questions: response.data.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
        })),
      };

      setQuizData(realQuizData);
      setQuizStarted(true);
      setCorrectness(Array(realQuizData.questions.length).fill(null));
      setUserAnswers(Array(realQuizData.questions.length).fill(null));
      setSubmitted(false);
    } catch (error) {
      console.error("❌ Failed to load quiz:", error);
      alert("Failed to load quiz. Please check your meeting ID or try again.");
    }
  };

  const handleAnswer = (questionIndex, selectedAnswer) => {
    if (submitted) return;
    const newAnswers = [...userAnswers];
    if (newAnswers[questionIndex] !== null) return;
    newAnswers[questionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    const newCorrectness = quizData.questions.map((question, index) =>
      userAnswers[index] === question.correctAnswer
    );
    setCorrectness(newCorrectness);
    setSubmitted(true);
  };

  const handleRestartQuiz = () => {
    setQuizData(null);
    setQuizStarted(false);
    setUserAnswers([]);
    setCorrectness([]);
    setSubmitted(false);
  };

  const calculateScore = () => {
    return correctness.filter(Boolean).length;
  };

  return (
    <div className="App">
      <h1>QuizBot for Zoom</h1>
      {!quizStarted ? (
        <InputForm meetingId={meetingId} setMeetingId={setMeetingId} onStartQuiz={handleStartQuiz} />
      ) : quizData ? (
        <Quiz
          quizData={quizData}
          userAnswers={userAnswers}
          handleAnswer={handleAnswer}
          correctness={correctness}
          calculateScore={calculateScore}
          onRestartQuiz={handleRestartQuiz}
          submitted={submitted}
          handleSubmitQuiz={handleSubmitQuiz}
        />
      ) : null}
    </div>
  );
}

export default App;
