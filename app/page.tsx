"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { HeroSection } from "@/app/components/molecules/HeroSection";
import useCemantixApi from "@/app/hooks/useCemantixApi";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import { useState, useEffect } from "react";
import Words, { WordEntry } from "@/app/components/molecules/Words";

const LOCAL_STORAGE_KEY = "cemantix_progress";

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
        flammeCount={10}
        remainingSeconds={remainingSeconds}
        winnerCount={winnerCount}
      />

      <div className="flex-1 overflow-y-auto flex flex-col gap-8 pb-4">
        <div className={testedWords.length === 0 ? "flex-1 flex flex-col justify-center" : "mt-4"}>
          <HeroSection
            flammeCount={10}
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
