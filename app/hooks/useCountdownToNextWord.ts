import { useEffect, useState } from "react";

function useCountdownToNextWord() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // prochain minuit

  const initialSeconds = Math.floor(
    (midnight.getTime() - now.getTime()) / 1000,
  );
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  return seconds;
}

export default useCountdownToNextWord;
