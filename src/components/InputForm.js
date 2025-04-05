import React, { useState, useEffect } from 'react';
import zoomLogo from '../zoom-logo.png'; // Import the Zoom logo (replace with your path)

function InputForm({ meetingId, setMeetingId, onStartQuiz }) {
  const [displayedGreeting, setDisplayedGreeting] = useState('');
  const fullGreeting = "Welcome to QuizBot! Please enter the Meeting ID to begin.";
  const typingSpeed = 0; // Adjust for typing speed (milliseconds per character)

  useEffect(() => {
    let charIndex = 0;
    const timer = setInterval(() => {
      if (charIndex < fullGreeting.length) {
        setDisplayedGreeting(fullGreeting.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div>
      <img src={zoomLogo} alt="Zoom Logo" className="zoom-logo" />
      {/* <h1 className="app-title">QuizBot for Zoom</h1> */}
      <p className="greeting">{displayedGreeting}</p>
      <label htmlFor="meetingId">Enter Meeting ID:</label>
      <input
        type="text"
        id="meetingId"
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
      />
      <button onClick={onStartQuiz} disabled={!meetingId}>Start Quiz</button>
    </div>
  );
}

export default InputForm;