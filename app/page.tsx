"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { HeroSection } from "@/app/components/molecules/HeroSection";
import useCemantixApi from "@/app/hooks/useCemantixApi";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import { useState, useEffect } from "react";
import Words, { WordEntry } from "@/app/components/molecules/Words";

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

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const { date, words } = JSON.parse(savedData);
        if (date === getCurrentDateString()) {
          setTestedWords(words);
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
        const { flammeCount, lastWinDate } = JSON.parse(savedStreak);
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        date: getCurrentDateString(),
        words: testedWords
      }));
    }
  }, [testedWords, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_STREAK_KEY, JSON.stringify({
        flammeCount,
        lastWinDate
      }));
    }
  }, [flammeCount, lastWinDate, isLoaded]);

  const onSubmitWord = async () => {
    if (!currentWord.trim()) return;

    try {
      const score = await submitWord(currentWord);
      
      setTestedWords((prev) => {
        // Éviter d'ajouter des doublons
        if (prev.some(w => w.label.toLowerCase() === currentWord.toLowerCase())) {
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

      // TODO handle stars
      setStarsCount((prev) => prev + 50);
    } catch (e) {
      console.error("Erreur lors de la soumission du mot:", e);
      // Gérer l'erreur (par exemple si le mot n'est pas dans le dictionnaire)
    }
  };

  const canBuyHint = starsCount > 100;

  return (
    <div className="container mx-auto px-4 bg-orange-50 h-dvh flex flex-col">
      <Header
        flammeCount={flammeCount}
        remainingSeconds={remainingSeconds}
        winnerCount={winnerCount}
      />

      <div className="flex-1 overflow-y-auto flex flex-col gap-8 pb-4">
        <div className={testedWords.length === 0 ? "flex-1 flex flex-col justify-center" : "mt-4"}>
          <HeroSection
            flammeCount={flammeCount}
            remainingSeconds={remainingSeconds}
            winnerCount={winnerCount}
          />
        </div>

        <Words words={testedWords} />
      </div>

      <BottomBar
        word={currentWord}
        onSubmitWord={onSubmitWord}
        onChangeWord={(word) => setCurrentWord(word)}
        starsCount={starsCount}
        canBuyHint={canBuyHint}
        onOpenHintMarket={() => {}}
      />
    </div>
  );
}
