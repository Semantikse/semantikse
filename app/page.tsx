"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { HeroSection } from "@/app/components/molecules/HeroSection";
import { HintMarket } from "@/app/components/molecules/HintMarket";
import { WinnerSection } from "@/app/components/molecules/WinnerSection";
import Words, { WordEntry } from "@/app/components/molecules/Words";
import useCemantixApi from "@/app/hooks/useCemantixApi";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "cemantix_progress";
const LOCAL_STORAGE_STREAK_KEY = "cemantix_streak";

const getCurrentDateString = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
};

export default function Home() {
  const remainingSeconds = useCountdownToNextWord();

  const { winnerCount, submitWord } = useCemantixApi();

  const [currentWord, setCurrentWord] = useState("");
  const [testedWords, setTestedWords] = useState<WordEntry[]>([]);
  const [starsCount, setStarsCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [flammeCount, setFlammeCount] = useState(0);
  const [lastWinDate, setLastWinDate] = useState<string | null>(null);
  const [isHintMarketOpen, setIsHintMarketOpen] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState(0);
  const [scrapedHints, setScrapedHints] = useState<string[]>([]);

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

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const { date, words, hints } = JSON.parse(savedData);
        if (date === getCurrentDateString()) {
          setTestedWords(words);
          setUnlockedHints(hints || 0);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Erreur de lecture du localStorage", e);
      }
    }

    const savedStreak = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
    if (savedStreak) {
      try {
        const { flammeCount, lastWinDate, stars } = JSON.parse(savedStreak);
        if (stars !== undefined) setStarsCount(stars);

        if (lastWinDate) {
          const today = getCurrentDateString();
          const todayDate = new Date(today);
          const lastWin = new Date(lastWinDate);

          const diffTime = Math.abs(todayDate.getTime() - lastWin.getTime());
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 1) {
            setFlammeCount(0); // Streak broken
          } else {
            setFlammeCount(flammeCount);
          }
          setLastWinDate(lastWinDate);
        }
      } catch (e) {
        console.error("Erreur lecture streak", e);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          date: getCurrentDateString(),
          words: testedWords,
          hints: unlockedHints,
        }),
      );
    }
  }, [testedWords, unlockedHints, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        LOCAL_STORAGE_STREAK_KEY,
        JSON.stringify({
          flammeCount,
          lastWinDate,
          stars: starsCount,
        }),
      );
    }
  }, [flammeCount, lastWinDate, starsCount, isLoaded]);

  const onSubmitWord = async () => {
    if (!currentWord.trim()) return;

    try {
      const score = await submitWord(currentWord);

      setTestedWords((prev) => {
        // Éviter d'ajouter des doublons
        if (
          prev.some((w) => w.label.toLowerCase() === currentWord.toLowerCase())
        ) {
          return prev;
        }
        return [
          ...prev,
          {
            label: currentWord,
            temp: score.degree,
            percentage: score.percentage,
          },
        ];
      });

      // Gestion des flammes (victoire si percentage === 100 ou degree === 100)
      if (score.percentage === 100 || score.degree === 100) {
        const today = getCurrentDateString();
        if (lastWinDate !== today) {
          setFlammeCount((prev) => prev + 1);
          setLastWinDate(today);
        }
      }

      setCurrentWord("");

      // Étoiles proportionnelles au score : 0, 10, 20, 30, 40, ou 50
      const earnedStars = Math.round((score.percentage / 100) * 5) * 10;
      setStarsCount((prev) => prev + earnedStars);
    } catch (e) {
      console.error("Erreur lors de la soumission du mot:", e);
      // Gérer l'erreur (par exemple si le mot n'est pas dans le dictionnaire)
    }
  };

  const onBuyHint = (cost: number) => {
    if (starsCount >= cost) {
      setStarsCount((prev) => prev - cost);
      setUnlockedHints((prev) => prev + 1);
    }
  };

  const HINTS_COSTS = [300, 400, 500, 600, 700, 800, 800, 800];
  const nextHintCost = HINTS_COSTS[unlockedHints] ?? Infinity;
  const canBuyHint = starsCount >= nextHintCost;

  return (
    <div className="container mx-auto px-4 h-dvh flex flex-col">
      <Header
        flammeCount={flammeCount}
        remainingSeconds={remainingSeconds}
        winnerCount={winnerCount}
      />

      <div className="flex-1 overflow-y-auto flex flex-col gap-8 pb-4">
        {testedWords.length === 0 ? (
          <HeroSection
            className="my-auto"
            flammeCount={flammeCount}
            remainingSeconds={remainingSeconds}
            winnerCount={winnerCount}
          />
        ) : (
          <>
            <WinnerSection
              className="shrink-0"
              usedHintCount={{ value: 3, totalAvailable: 8, newRecord: true }}
              usedWordCount={{ value: 20, newRecord: true }}
              place={{ value: 29349, newRecord: true }}
              duration={{ value: 1303, newRecord: true }}
            />

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
        word={currentWord}
        onSubmitWord={onSubmitWord}
        onChangeWord={(word) => setCurrentWord(word)}
        starsCount={starsCount}
        canBuyHint={canBuyHint}
        onOpenHintMarket={() => setIsHintMarketOpen(true)}
      />
    </div>
  );
}
