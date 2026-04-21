"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { HeroSection } from "@/app/components/molecules/HeroSection";
import useCemantixApi from "@/app/hooks/useCemantixApi";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import { useState } from "react";

export default function Home() {
  const remainingSeconds = useCountdownToNextWord();

  const { winnerCount, submitWord } = useCemantixApi();

  const [currentWord, setCurrentWord] = useState("");
  const [starsCount, setStarsCount] = useState(0);

  const onSubmitWord = async () => {
    const score = await submitWord(currentWord);
    setCurrentWord("");

    // TODO handle stars
    setStarsCount(starsCount + 50);
    console.log(currentWord);
  };

  const canBuyHint = starsCount > 100;

  return (
    <div className="container mx-auto px-4 bg-orange-50 h-dvh flex flex-col">
      <Header
        flammeCount={10}
        remainingSeconds={remainingSeconds}
        winnerCount={winnerCount}
      />

      <div className="flex-1 flex flex-col justify-center">
        <HeroSection
          flammeCount={10}
          remainingSeconds={remainingSeconds}
          winnerCount={winnerCount}
        />
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
