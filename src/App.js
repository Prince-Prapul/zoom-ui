import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [meetingContext, setMeetingContext] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isZoomSdkReady, setIsZoomSdkReady] = useState(false);

  useEffect(() => {
    // Initialize the Zoom Apps SDK (or mock it for local development)
    let sdkReady = false; // Flag to prevent multiple calls to setIsZoomSdkReady

    if (window.zoomSdk) {
      window.zoomSdk.init({
        onZoomAppReady: () => {
          if (!sdkReady) {
            sdkReady = true;
            window.zoomSdk.getMeetingContext().then((context) => {
              setMeetingContext(context);
              setIsZoomSdkReady(true);
            });
          }
        },
      });
    } else {
      console.warn("Zoom Apps SDK not available. Using mock for local development.");
      // Mock the zoomSdk and its functions for local development
      window.zoomSdk = {
        init: ({ onZoomAppReady }) => {
          if (!sdkReady) {
            sdkReady = true;
            setTimeout(() => {
              // Mock getMeetingContext() to return a dummy meetingId
              window.zoomSdk.getMeetingContext = () => Promise.resolve({ meetingId: "MOCK_MEETING_ID" });
              onZoomAppReady(); // Trigger the callback
            }, 100);
          }
        },
        getMeetingContext: () => Promise.resolve({ meetingId: "MOCK_MEETING_ID" }), // Mocked
      };
      window.zoomSdk.init({
        onZoomAppReady: () => {
          if (!sdkReady) {
            sdkReady = true;
            setIsZoomSdkReady(true);
            setMeetingContext({ meetingId: "MOCK_MEETING_ID" });
          }
        },
      });
    }
  }, []);

  const fetchQuiz = async () => {
    if (!meetingContext?.meetingId) {
      setError('Meeting ID not available.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const backendUrl = 'http://localhost:8000/generate_mcq'; // Your backend URL
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. During this process, light energy is converted into chemical energy, which is stored in the form of glucose. Carbon dioxide and water are used as raw materials, and oxygen is released as a byproduct. Photosynthesis typically occurs in the chloroplasts of plant cells.',  // Placeholder text! Replace with actual transcript fetching
          num_questions: 2,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || `Failed to fetch quiz: ${response.status}`);
      }

      const quizData = await response.json();
      setQuiz(quizData);
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setScore(0);
    } catch (err) {
      setError(err.message);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    if (selectedAnswer === quiz[currentQuestionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedAnswer(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    if (currentQuestionIndex === quiz.length - 1) {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Only show the "Generate Quiz" button AFTER the SDK is ready
  if (!isZoomSdkReady) {
    return <div>Initializing Zoom App...</div>;
  }

  if (!quiz) {
    return (
      <div className="App">
        <h1>QuizBot for Zoom</h1>
        {meetingContext?.meetingId && <p>Meeting ID: {meetingContext.meetingId}</p>}
        <button onClick={fetchQuiz}>Generate Quiz</button>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];

  if (showResults) {
    return (
      <div className="App">
        <h2>Quiz Results</h2>
        <p>Your Score: {score} / {quiz.length}</p>
        <button onClick={handleRestartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h2>Question {currentQuestionIndex + 1} / {quiz.length}</h2>
      <p>{currentQuestion.question}</p>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => handleAnswerSelect(option)}
              className={selectedAnswer === option ? 'selected' : ''}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleNextQuestion} disabled={!selectedAnswer}>
        Next
      </button>
    </div>
  );
}

export default App;