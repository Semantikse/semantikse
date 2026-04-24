import type { WordEntry } from "@/app/constants";
import { useEffect, useState } from "react";

export type WordEntry = {
  label: string;
  temp: number;
  percentage: number;
};

interface WordsProps {
  words: WordEntry[];
}

const getWordMetas = (temp: number) => {
  if (temp >= 60) return { emoji: "😱", category: "< 100°", color: "#EE4620" };
  if (temp >= 40) return { emoji: "🔥", category: "< 60°", color: "#EC8914" };
  if (temp >= 30) return { emoji: "🥵", category: "< 39°", color: "#EC8914" };
  if (temp >= 23) return { emoji: "😎", category: "< 30°", color: "#f97316" };
  if (temp >= 0) return { emoji: "🥶", category: "< 23°", color: "#f97316" };
  return { emoji: "🧊", category: "< 0°", color: "#f97316" };
};

const WordRow = ({
  word,
  showPoints = false,
  bonusValue = 0,
  animate = false,
}: {
  word: WordEntry;
  showPoints?: boolean;
  bonusValue?: number;
  animate?: boolean;
}) => {
  const { emoji, category, color } = getWordMetas(word.temp);
  const hasBar = word.percentage > 0;

  // État pour gérer la largeur de la barre (0 au début si on veut animer)
  const [width, setWidth] = useState(animate ? 0 : word.percentage);

  useEffect(() => {
    if (animate) {
      // On attend un tout petit peu que le composant soit monté pour lancer l'animation
      const timer = setTimeout(() => {
        setWidth(word.percentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animate, word.percentage]);

  return (
    <div
      data-catégorie={category}
      className="self-stretch relative rounded-lg flex flex-col justify-center items-center gap-2"
    >
      <div className="self-stretch inline-flex justify-start items-center gap-2">
        <div className="text-black text-base font-medium font-['Geist'] leading-6">
          {emoji}
        </div>
        <div className="flex-1 text-black text-base font-medium font-['Geist'] leading-6">
          {word.label}
        </div>
        <div className="flex justify-start items-center">
          <div className="text-black text-base font-medium font-['Geist'] leading-6">
            {Number(word.temp).toFixed(2)}
          </div>
          <div className="text-black text-base font-medium font-['Geist'] leading-6">
            °C
          </div>
        </div>
      </div>

      {hasBar && (
        <div
          className="self-stretch h-3 bg-red-50 outline outline-2 outline-offset-[-2px] flex flex-col justify-start items-start gap-2"
          style={{ outlineColor: color }}
        >
          <div
            // duration-1000 pour une progression fluide de 1 seconde
            // ease-out pour que la barre ralentisse sur la fin
            className="h-full transition-[width] duration-1000 ease-out"
            style={{
              width: `${width}%`,
              backgroundColor: color,
            }}
          />
        </div>
      )}

      {showPoints && (
        <div className="left-[92.93px] top-[-2.12px] absolute origin-top-left rotate-[-20deg] inline-flex justify-start items-center gap-1">
          <div className="text-orange-400 text-base font-normal font-['Newake'] leading-6 tracking-wide">
            +{bonusValue}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Words({ words }: WordsProps) {
  if (!words || words.length === 0) {
    return null;
  }

  const lastWord = words[words.length - 1];
  const sortedTopWords = words.slice(0, -1).sort((a, b) => b.temp - a.temp);

  const earnedStars = Math.round((lastWord.percentage / 100) * 5) * 10;

  return (
    <div className="w-full self-stretch flex-1 inline-flex flex-col justify-start items-start gap-9">
      <div className="w-full flex flex-col justify-start items-start gap-3">
        <div className="self-stretch text-zinc-900 text-base font-normal font-['Newake'] uppercase leading-6 tracking-wide">
          dernier mot
        </div>
        {/* On active l'animation uniquement ici */}
        <WordRow
          word={lastWord}
          showPoints={earnedStars > 0}
          bonusValue={earnedStars}
          animate={true}
        />
      </div>

      {sortedTopWords.length > 0 && (
        <div className="w-full flex flex-col justify-start items-start gap-3">
          <div className="self-stretch text-zinc-900 text-base font-normal font-['Newake'] uppercase leading-6 tracking-wide">
            Meilleurs Mots
          </div>
          <div className="w-full flex flex-col gap-4">
            {sortedTopWords.map((word, idx) => (
              <WordRow key={`${word.label}-${idx}`} word={word} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
