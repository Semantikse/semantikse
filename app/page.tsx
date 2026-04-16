"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import useCountdownToNextWord from "@/app/hooks/useCountdownToNextWord";
import { useEffect, useState } from "react";

export default function Home() {
  const remainingSeconds = useCountdownToNextWord();
  const [currentWord, setCurrentWord] = useState("");
  const [starsCount, setStarsCount] = useState(0);

  const [winnerCount, setWinnerCount] = useState(0);

  useEffect(() => {
    fetch("/api/winner-count").then(async (response) => {
      setWinnerCount(await response.json());
    });
  }, []);

  const sendWord = () => {
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
      <p className="font-newake">Newake</p>
      <p className="font-geist">Geist</p>

      <BottomBar
        word={currentWord}
        onSendWord={sendWord}
        onChangeWord={(word) => setCurrentWord(word)}
        starsCount={starsCount}
        canBuyHint={canBuyHint}
        onOpenHintMarket={() => {}}
      />
    </div>
  );
}
