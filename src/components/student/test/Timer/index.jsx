import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Timer({ initialDuration, onComplete, onUpdate }) {
  const [seconds, setSeconds] = useState(initialDuration);

  useEffect(() => {
    let interval;

    if (seconds !== null && seconds > 0) {
      interval = setInterval(() => {
        const newSeconds = seconds - 1;
        setTimeout(() => onUpdate(newSeconds), 0); // Defer the update
        setSeconds(newSeconds);
      }, 1000);
    } else if (seconds === 0) {
      onComplete();
    }

    return () => clearInterval(interval);
  }, [seconds, onComplete, onUpdate]);

  const formatTime = (timeInSeconds) => {
    console.log(timeInSeconds, "time insecondes")
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  return (
    <div className="float-right pl-5 w200 user-select-none ">
      <h5 className="font-xs mb-0 fw-600">Test Ends in</h5>
      <p className="font-xxl mb-0 fw-600">{formatTime(seconds)}</p>
    </div>
  );
}

Timer.propTypes = {
  initialDuration: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  // formatTime: PropTypes.func.isRequired,
};

export default Timer;
