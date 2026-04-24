"use client";

import { LightBulbIcon, StarIcon } from "@heroicons/react/20/solid";
import { cn } from "@/app/utils/cn";

export interface HintMarketProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
  unlockedHints: number;
  onBuyHint: (cost: number) => void;
  scrapedHints?: string[];
}

const HINTS_CONFIG = [
  { id: 1, cost: 300 },
  { id: 2, cost: 400 },
  { id: 3, cost: 500 },
  { id: 4, cost: 600 },
  { id: 5, cost: 700 },
  { id: 6, cost: 800 },
  { id: 7, cost: 800 },
  { id: 8, cost: 800 },
];

export const HintMarket = ({
  isOpen,
  onClose,
  starsCount,
  unlockedHints,
  onBuyHint,
  scrapedHints = [],
}: HintMarketProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 transition-opacity p-2 sm:p-4">
      {/* Clic à l'extérieur pour fermer */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-md mx-auto px-4 pt-5 pb-12 bg-orange-100 rounded-2xl sm:rounded-b-none sm:rounded-tl-2xl sm:rounded-tr-2xl flex flex-col gap-6 shadow-2xl relative max-h-[85vh]">
        <div className="flex justify-between items-center shrink-0">
          <div className="text-red-950 text-2xl font-normal font-newake tracking-wide">
            Indices
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-orange-600 text-base font-normal font-newake tracking-wide">
                {starsCount}
              </span>
              <StarIcon className="w-5 h-5 text-orange-600 mb-0.5" />
            </div>
            <button
              onClick={onClose}
              className="h-10 px-4 py-2 bg-orange-100 rounded outline outline-2 outline-offset-[-2px] outline-orange-600 flex justify-center items-center gap-2 hover:bg-orange-200 transition-colors -skew-x-[12deg]"
            >
              <div className="skew-x-[12deg] flex justify-center items-center">
                <span className="text-orange-600 text-base font-normal font-newake uppercase tracking-wide mt-0.5">
                  Fermer
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 no-scrollbar">
          {HINTS_CONFIG.map((hint, idx) => {
            const isUnlocked = idx < unlockedHints;
            const isNext = idx === unlockedHints;
            const canAfford = starsCount >= hint.cost;

            if (isUnlocked) {
              const hintText = scrapedHints[idx] || `Indice ${hint.id}`;
              return (
                <div
                  key={hint.id}
                  className="w-full min-h-10 py-2 flex items-center gap-6"
                >
                  <div className="w-6 h-6 flex justify-center items-center shrink-0">
                    <LightBulbIcon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 text-red-900 text-base font-normal font-newake tracking-wide leading-tight">
                    {hintText}
                  </div>
                </div>
              );
            }

            if (isNext && canAfford) {
              return (
                <div
                  key={hint.id}
                  className="w-full flex items-center gap-6"
                >
                  <div className="w-6 h-6 flex justify-center items-center">
                    <LightBulbIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 text-orange-600 text-base font-normal font-newake uppercase tracking-wide">
                    Indice {hint.id}
                  </div>
                  <button
                    onClick={() => onBuyHint(hint.cost)}
                    className="h-10 px-4 py-2 bg-orange-600 rounded outline outline-2 outline-offset-[-2px] outline-orange-600 flex justify-center items-center hover:bg-orange-700 transition-colors -skew-x-[12deg]"
                  >
                    <div className="skew-x-[12deg] flex items-center gap-1">
                      <span className="text-orange-100 text-base font-normal font-newake uppercase tracking-wide mt-0.5">
                        {hint.cost}
                      </span>
                      <StarIcon className="w-5 h-5 text-orange-100 mb-0.5" />
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={hint.id}
                className="w-full flex items-center gap-6"
              >
                <div className="w-6 h-6 flex justify-center items-center">
                  <LightBulbIcon className="w-5 h-5 text-orange-300" />
                </div>
                <div className="flex-1 text-orange-300 text-base font-normal font-newake uppercase tracking-wide">
                  Indice {hint.id}
                </div>
                <div className="h-10 px-4 py-2 bg-orange-300 rounded outline outline-2 outline-offset-[-2px] outline-orange-300 flex justify-center items-center -skew-x-[12deg]">
                  <div className="skew-x-[12deg] flex items-center justify-center min-w-[3rem]">
                    <span className="text-orange-100 text-base font-normal font-newake uppercase tracking-wide mt-0.5">
                      {hint.cost}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
