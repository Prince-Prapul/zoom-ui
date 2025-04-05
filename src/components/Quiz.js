
import React from 'react';

function Quiz({
  quizData,
  userAnswers,
  handleAnswer,
  correctness,
  calculateScore,
  onRestartQuiz,
  submitted,
  handleSubmitQuiz,
}) {
  return (
    <div className="quiz-container">
      <h2>{quizData.title}</h2>

      {quizData.questions.map((question, index) => {
        const selected = userAnswers[index];
        const isCorrect = correctness[index];

        return (
          <div key={index} className="question-container">
            <h3>{question.question}</h3>
            <div className="options-container">
              {question.options.map((option, optionIndex) => {
                const isSelected = selected === option;
                const isCorrectOption = isSelected && isCorrect;
                const isIncorrectOption = isSelected && !isCorrect;

                let buttonClassName = "option-button";
                if (isSelected) buttonClassName += " selected";
                if (submitted && isCorrectOption) buttonClassName += " correct";
                if (submitted && isIncorrectOption) buttonClassName += " incorrect";

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswer(index, option)}
                    className={buttonClassName}
                    disabled={selected !== null || submitted}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="results-feedback">
                <p>Your Answer: <span className={isCorrect ? 'correct-answer' : 'incorrect-answer'}>
                  {selected || "Not Answered"}
                </span></p>
                <p>Correct Answer: <span className="correct-answer">{question.correctAnswer}</span></p>
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div className="submit-section">
          <button onClick={handleSubmitQuiz} className="submit-button">
            Submit Quiz
          </button>
        </div>
      )}

      {submitted && (
        <div className="quiz-results">
          <h2>Quiz Completed!</h2>
          <p>You scored {calculateScore()} out of {quizData.questions.length}</p>
          <button onClick={onRestartQuiz} className="restart-button">Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default Quiz;