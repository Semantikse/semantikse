import { WordScoreSchema } from "@/app/utils/cemantixApi";
import { useEffect, useState } from "react";

const FETCH_WINNER_COUNT_INTERVAL_S = 5;

function useCemantixApi() {
  const [winnerCount, setWinnerCount] = useState(0);

  const fetchWinnerCount = () =>
    fetch("/api/winner-count").then(async (response) => {
      const newWinnerCount = await response.json();

      setWinnerCount((prev) => Math.max(prev ?? 0, newWinnerCount));
    });

  const submitWord = async (word: string) => {
    const response = await fetch("/api/word", {
      method: "POST",
      body: JSON.stringify({
        word,
      }),
    });

    return WordScoreSchema.parse(await response.json());
  };

  useEffect(() => {
    fetchWinnerCount();

    const interval = setInterval(
      fetchWinnerCount,
      FETCH_WINNER_COUNT_INTERVAL_S * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return {
    winnerCount,
    submitWord,
  };
}

export default useCemantixApi;
