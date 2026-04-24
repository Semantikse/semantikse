import { useEffect, useState } from "react";

function useCountdownToNextWord() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const calculateRemaining = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // prochain minuit
      return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };

    setSeconds(calculateRemaining());

    const interval = setInterval(() => {
      setSeconds(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return seconds;
}

export default useCountdownToNextWord;
