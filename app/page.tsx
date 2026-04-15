"use client";
import { BottomBar } from "@/app/components/molecules/BottomBar";
import { Header } from "@/app/components/molecules/Header";
import { useState } from "react";

export default function Home() {
  const [currentWord, setCurrentWord] = useState("");
  const [starsCount, setStarsCount] = useState(0);

  const sendWord = () => {
    setStarsCount(starsCount + 50);
    console.log(currentWord);
  };

  const canBuyHint = starsCount > 100;

  return (
    <div className="container mx-auto px-2 ">
      <Header
        flammesCount={10}
        remainingSeconds={18208}
        winnersCount={375300}
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
