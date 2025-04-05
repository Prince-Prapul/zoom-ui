import React from 'react';

function Results({ quizData, userAnswers, onRestartQuiz }) {
  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="quiz-results">
      <h2>Quiz Completed!</h2>
      <p>You scored {calculateScore()} out of {quizData.questions.length}</p>
      <button onClick={onRestartQuiz} className="restart-button">Restart Quiz</button>
      <div className="detailed-feedback">
        {quizData.questions.map((question, index) => (
          <div key={index} className="question-feedback">
            <p><strong>Q:</strong> {question.question}</p>
            <p>Your Answer: <span className={userAnswers[index] === question.correctAnswer ? 'correct-answer' : 'incorrect-answer'}>
              {userAnswers[index] || "Not Answered"}
            </span></p>
            <p>Correct Answer: <span className="correct-answer">{question.correctAnswer}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;
