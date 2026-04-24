"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { HeroSection } from "@/app/components/molecules/HeroSection";
import { HintMarket } from "@/app/components/molecules/HintMarket";
import { WinnerSection } from "@/app/components/molecules/WinnerSection";
import Words, { WordEntry } from "@/app/components/molecules/Words";
import useCemantixApi from "@/app/hooks/useCemantixApi";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "cemantix_progress";
const LOCAL_STORAGE_STREAK_KEY = "cemantix_streak";
const LOCAL_STORAGE_RECORDS_KEY = "cemantix_records";

type WinStats = {
  guesses: number;
  duration: number;
  place: number;
  hints: number;
};

type Progress = {
  date: string;
  words: WordEntry[];
  hints: number;
  won: boolean;
  firstWordTs: number | null;
  winTs: number | null;
  wonStats: WinStats | null;
};

type Records = {
  guesses?: number;
  duration?: number;
  place?: number;
  hints?: number;
};

type Streak = {
  flammeCount: number;
  lastWinDate: string | null;
  stars: number;
};

const INITIAL_PROGRESS: Progress = {
  date: "",
  words: [],
  hints: 0,
  won: false,
  firstWordTs: null,
  winTs: null,
  wonStats: null,
};

const INITIAL_STREAK: Streak = {
  flammeCount: 0,
  lastWinDate: null,
  stars: 0,
};

const getCurrentDateString = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
};

export default function Home() {
  const remainingSeconds = useCountdownToNextWord();
  const { winnerCount, submitWord } = useCemantixApi();

  const [currentWord, setCurrentWord] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHintMarketOpen, setIsHintMarketOpen] = useState(false);
  const [scrapedHints, setScrapedHints] = useState<string[]>([]);

  const [progress, setProgress, progressLoaded] = useLocalStorage<Progress>(
    LOCAL_STORAGE_KEY,
    INITIAL_PROGRESS,
  );
  const [bestRecords, setBestRecords] = useLocalStorage<Records>(
    LOCAL_STORAGE_RECORDS_KEY,
    {},
  );
  const [streak, setStreak, streakLoaded] = useLocalStorage<Streak>(
    LOCAL_STORAGE_STREAK_KEY,
    INITIAL_STREAK,
  );

  const {
    words: testedWords,
    hints: unlockedHints,
    won: isWon,
    firstWordTs: firstWordTimestamp,
    wonStats: winStats,
  } = progress;
  const { flammeCount, lastWinDate, stars: starsCount } = streak;

  useEffect(() => {
    fetch("/api/hints")
      .then((res) => res.json())
      .then((data) => {
        if (data.hints) {
          setScrapedHints(data.hints);
        }
      })
      .catch((err) => console.error("Erreur récupération indices:", err));
  }, []);

  // Reset de la progression quand on change de jour
  useEffect(() => {
    if (!progressLoaded) return;
    const today = getCurrentDateString();
    if (progress.date !== today) {
      setProgress({ ...INITIAL_PROGRESS, date: today });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded]);

  // Streak cassée si le dernier succès date de plus d'un jour
  useEffect(() => {
    if (!streakLoaded) return;
    if (!streak.lastWinDate) return;
    const today = getCurrentDateString();
    const diffDays = Math.round(
      Math.abs(
        new Date(today).getTime() - new Date(streak.lastWinDate).getTime(),
      ) /
        (1000 * 60 * 60 * 24),
    );
    if (diffDays > 1) {
      setStreak((s) => ({ ...s, flammeCount: 0 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakLoaded]);

  const onSubmitWord = async () => {
    if (!currentWord.trim()) return;

    try {
      const score = await submitWord(currentWord);

      if (
        score.error ||
        score.degree === undefined ||
        score.percentage === undefined
      ) {
        setErrorMessage("Ce mot n'est pas reconnu");
        return;
      }

      setErrorMessage("");

      const now = Date.now();
      const today = getCurrentDateString();
      const isVictory = score.percentage === 100 || score.degree === 100;
      const earnedStars = Math.round((score.percentage / 100) * 5) * 10;

      const alreadyTested = testedWords.some(
        (w) => w.label.toLowerCase() === currentWord.toLowerCase(),
      );
      const newWords = alreadyTested
        ? testedWords
        : [
            ...testedWords,
            {
              label: currentWord,
              temp: score.degree as number,
              percentage: score.percentage as number,
            },
          ];
      const newFirstWordTs = firstWordTimestamp ?? now;

      let newWinStats: WinStats | null = winStats;
      if (isVictory) {
        newWinStats = {
          guesses: newWords.length,
          duration: Math.floor((now - newFirstWordTs) / 1000),
          place: winnerCount ?? 0,
          hints: unlockedHints,
        };
      }

      setProgress((p) => ({
        ...p,
        words: newWords,
        firstWordTs: newFirstWordTs,
        won: isVictory || p.won,
        winTs: isVictory ? now : p.winTs,
        wonStats: newWinStats,
      }));

      if (isVictory && newWinStats) {
        const stats = newWinStats;
        setBestRecords((prev) => ({
          guesses:
            !prev.guesses || stats.guesses < prev.guesses
              ? stats.guesses
              : prev.guesses,
          duration:
            !prev.duration || stats.duration < prev.duration
              ? stats.duration
              : prev.duration,
          place:
            !prev.place || stats.place < prev.place ? stats.place : prev.place,
          hints:
            !prev.hints || stats.hints < prev.hints ? stats.hints : prev.hints,
        }));

        setStreak((s) => ({
          ...s,
          stars: s.stars + earnedStars,
          ...(s.lastWinDate !== today
            ? { flammeCount: s.flammeCount + 1, lastWinDate: today }
            : {}),
        }));
      } else {
        setStreak((s) => ({ ...s, stars: s.stars + earnedStars }));
      }

      setCurrentWord("");
    } catch (e) {
      console.error("Erreur lors de la soumission du mot:", e);
    }
  };

  const onBuyHint = (cost: number) => {
    if (starsCount >= cost) {
      setStreak((s) => ({ ...s, stars: s.stars - cost }));
      setProgress((p) => ({ ...p, hints: p.hints + 1 }));
    }
  };

  const HINTS_COSTS = [300, 400, 500, 600, 700, 800, 800, 800];
  const nextHintCost = HINTS_COSTS[unlockedHints] ?? Infinity;
  const canBuyHint = starsCount >= nextHintCost;

  return (
    <div className="container mx-auto h-dvh flex flex-col">
      <Header
        className="px-4"
        flammeCount={flammeCount}
        remainingSeconds={remainingSeconds}
        winnerCount={winnerCount}
      />

      <div className="flex-1 overflow-y-auto flex flex-col gap-8 pb-4 px-4">
        {testedWords.length === 0 ? (
          <HeroSection
            className="my-auto"
            flammeCount={flammeCount}
            remainingSeconds={remainingSeconds}
            winnerCount={winnerCount}
          />
        ) : (
          <>
            {isWon && winStats && (
              <WinnerSection
                className="shrink-0"
                usedWordCount={{
                  value: winStats.guesses,
                  newRecord: bestRecords.guesses === winStats.guesses,
                }}
                place={{
                  value: winStats.place,
                  newRecord: bestRecords.place === winStats.place,
                }}
                duration={{
                  value: winStats.duration,
                  newRecord:
                    bestRecords.duration === winStats.duration &&
                    winStats.duration > 0,
                }}
                usedHintCount={{
                  value: winStats.hints,
                  totalAvailable: 8,
                  newRecord: bestRecords.hints === winStats.hints,
                }}
              />
            )}

            <Words words={testedWords} />
          </>
        )}
      </div>

      <HintMarket
        isOpen={isHintMarketOpen}
        onClose={() => setIsHintMarketOpen(false)}
        starsCount={starsCount}
        unlockedHints={unlockedHints}
        onBuyHint={onBuyHint}
        scrapedHints={scrapedHints}
      />

      <BottomBar
        className="px-4"
        word={currentWord}
        onSubmitWord={onSubmitWord}
        onChangeWord={(word) => {
          setCurrentWord(word);
          setErrorMessage("");
        }}
        starsCount={starsCount}
        canBuyHint={canBuyHint}
        onOpenHintMarket={() => setIsHintMarketOpen(true)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
