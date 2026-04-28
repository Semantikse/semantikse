"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { HeroSection } from "@/app/components/molecules/HeroSection";
import { HintMarket } from "@/app/components/molecules/HintMarket";
import { WinnerSection } from "@/app/components/molecules/WinnerSection";
import Words from "@/app/components/molecules/Words";
import {
  HINTS_CONFIG,
  INITIAL_PROGRESS,
  INITIAL_STREAK,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_RECORDS_KEY,
  LOCAL_STORAGE_STREAK_KEY,
  type Progress,
  type Records,
  type Streak,
  type WinStats,
} from "@/app/constants";
import useCemantixApi from "@/app/hooks/useCemantixApi";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import useHints from "@/app/hooks/useHints";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useEffect, useState } from "react";

const getCurrentDateString = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
};

export default function Home() {
  const remainingSeconds = useCountdownToNextWord();
  const { winnerCount, submitWord } = useCemantixApi();

  const [currentWord, setCurrentWord] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isHintMarketOpen, setIsHintMarketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrapedHints = useHints();

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
  const { flammeCount, stars: starsCount } = streak;

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
    const formattedWord = currentWord.trim().toLowerCase();
    if (!formattedWord || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const score = await submitWord(formattedWord);

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
      const earnedStars = 20 + Math.round(score.percentage * 0.8);

      const alreadyTested = testedWords.some(
        (w) => w.label.toLowerCase() === formattedWord,
      );
      const newWords = alreadyTested
        ? testedWords
        : [
            ...testedWords,
            {
              label: formattedWord,
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
          ...(alreadyTested ? {} : { stars: s.stars + earnedStars }),
          ...(s.lastWinDate !== today
            ? { flammeCount: s.flammeCount + 1, lastWinDate: today }
            : {}),
        }));
      } else if (!alreadyTested) {
        setStreak((s) => ({ ...s, stars: s.stars + earnedStars }));
      }

      setCurrentWord("");
    } catch (e) {
      console.error("Erreur lors de la soumission du mot:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBuyHint = (cost: number) => {
    if (starsCount >= cost) {
      setStreak((s) => ({ ...s, stars: s.stars - cost }));
      setProgress((p) => ({ ...p, hints: p.hints + 1 }));
    }
  };

  const nextHintCost = HINTS_CONFIG[unlockedHints]?.cost ?? Infinity;
  const canBuyHint = starsCount >= nextHintCost;

  return (
    <div className="container mx-auto h-dvh flex flex-col">
      <Header
        className="px-4"
        flammeCount={flammeCount}
        remainingSeconds={remainingSeconds}
        winnerCount={winnerCount}
      />

      <div className="flex-1 overflow-y-auto flex flex-col gap-8 px-4 pb-24">
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

      <div className="absolute bottom-0 left-0 w-full">
      <BottomBar
        className="container mx-auto px-4"
        word={currentWord}
        isSubmitting={isSubmitting}
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
    </div>
  );
}
