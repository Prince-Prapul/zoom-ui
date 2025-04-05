import React, { useState, useEffect } from 'react';
import './App.css';
import Quiz from './components/Quiz';
import InputForm from './components/InputForm';

function App() {
  const [meetingId, setMeetingId] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctness, setCorrectness] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const mockQuizData = {
      title: "Meeting Highlights Quiz",
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
          question: "In the provided context, where is the Lambda function code, along with its dependencies and scripts, stored?",
          options: [
            "In an S3 bucket.",
            "Directly within the Lambda function.",
            "In a Docker image stored in Amazon ECR.",
            "In a local Docker repository.",
          ],
          correctAnswer: "In a Docker image stored in Amazon ECR.",
        },
        {
          question: "What is the limitation of Amazon ECR's free tier regarding storage?",
          options: [
            "It limits the number of Docker images stored.",
            "It restricts the number of private repositories.",
            "It allows only 500 MB of storage per month for private repositories.",
            "It only allows public repositories.",
          ],
          correctAnswer: "It allows only 500 MB of storage per month for private repositories.",
        },
        {
          question: "How much will the project's ECR storage cost approximately, considering the given requirements and pricing?",
          options: ["$0.00 (because it's under the free tier)", "$10.00", "$2.00", "$20.00"],
          correctAnswer: "$2.00",
        },
        {
          question: "The project uses PyTorch, a machine learning platform. Why is ECR necessary in this context?",
          options: [
            "PyTorch requires ECR for model training.",
            "ECR simplifies the deployment of PyTorch models as container images.",
            "ECR is needed to store PyTorch datasets.",
            "It only allows public repositories.",
          ],
          correctAnswer: "ECR simplifies the deployment of PyTorch models as container images.",
        },
      ],
    };

    setQuizData(mockQuizData);
    setCorrectness(Array(mockQuizData.questions.length).fill(null));
    setUserAnswers(Array(mockQuizData.questions.length).fill(null));
    setSubmitted(false);
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
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
      ) : (
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
      )}
    </div>
  );
}

export default App;