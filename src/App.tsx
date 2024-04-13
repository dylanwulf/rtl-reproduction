import { useEffect, useRef, useState } from 'react';
import './App.css';

const doPayment = () =>
  new Promise<string>((resolve) => {
    window.setTimeout(resolve, 5000, 'success');
  });

const getTimeRemainingMessage = (timeRemainingMs: number) => {
  const secondsRemaining = Math.ceil(timeRemainingMs / 1000);
  const minutesToDisplay = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0');
  const secondsToDisplay = (secondsRemaining % 60).toString().padStart(2, '0');
  return `Time Remaining: ${minutesToDisplay}:${secondsToDisplay}`;
};

const useTimer = (updateStatus: (newStatus: string) => void) => {
  // refs are necessary to ensure that setInterval is calling the latest callbacks
  const updateStatusRef = useRef(updateStatus);
  useEffect(() => {
    updateStatusRef.current = updateStatus;
  });

  const [endTimestamp, setEndTimestamp] = useState<number | null>(null); // null if timer is not active

  const startTimer = (timeLimitMs: number) => {
    setEndTimestamp(Date.now() + timeLimitMs);
    updateStatusRef.current(getTimeRemainingMessage(timeLimitMs));
  };

  const stopTimer = () => {
    setEndTimestamp(null);
  };

  useEffect(() => {
    if (endTimestamp !== null) {
      const intervalId = window.setInterval(() => {
        const milliSecondsRemaining = endTimestamp - Date.now();
        if (milliSecondsRemaining <= 0) {
          stopTimer();
          updateStatusRef.current('Timed Out');
        } else {
          updateStatusRef.current(
            getTimeRemainingMessage(milliSecondsRemaining)
          );
        }
      }, 1000);

      return () => {
        window.clearInterval(intervalId);
      };
    }
    return undefined;
  }, [endTimestamp]);

  return { startTimer, stopTimer };
};

function App() {
  const [status, setStatus] = useState('Ready');

  const { startTimer, stopTimer } = useTimer(setStatus);

  return (
    <>
      <div className="card">
        <div>{status}</div>
        <button
          onClick={() => {
            startTimer(120000);
            doPayment().then(() => {
              stopTimer();
              setStatus('Payment Successful');
            });
          }}
        >
          Begin Payment
        </button>
      </div>
    </>
  );
}

export default App;
