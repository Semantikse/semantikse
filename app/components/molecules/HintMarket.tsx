"use client";

import { PrimaryButton } from "@/app/components/atoms/PrimaryButton";
import { SecondaryButton } from "@/app/components/atoms/SecondaryButton";
import { HINTS_CONFIG } from "@/app/constants";
import { LightBulbIcon, StarIcon } from "@heroicons/react/20/solid";

export interface HintMarketProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
  unlockedHints: number;
  onBuyHint: (cost: number) => void;
  scrapedHints?: string[];
}

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
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 transition-opacity px-2 sm:px-4">
      <div className="absolute inset-0" onClick={onClose} />

      <section className="w-full max-w-md mx-auto pt-5 pb-12 bg-orange-100 rounded-2xl sm:rounded-b-none sm:rounded-tl-2xl sm:rounded-tr-2xl flex flex-col gap-6 shadow-2xl relative max-h-[85vh]">
        <header className="flex justify-between items-center shrink-0 px-4">
          <h2 className="text-red-950 text-2xl font-normal font-newake tracking-wide">
            Indices
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-orange-600 font-newake">
              {starsCount}
              <StarIcon className="w-5 h-5 text-orange-600 mb-1" />
            </div>

            <SecondaryButton onClick={onClose}>Fermer</SecondaryButton>
          </div>
        </header>

        <div className="grow overflow-y-auto flex flex-col gap-4">
          {HINTS_CONFIG.map((hint, idx) => {
            const isUnlocked = idx < unlockedHints;
            const isNext = idx === unlockedHints;
            const canAfford = starsCount >= hint.cost;

            if (isUnlocked) {
              const hintText = scrapedHints[idx] || `Indice ${hint.id}`;
              return (
                <div
                  key={hint.id}
                  className="w-full flex items-center gap-6 px-4"
                >
                  <LightBulbIcon className="size-5 shrink-0 text-yellow-400" />
                  <div className="flex-1 text-red-900 text-base font-normal font-newake tracking-wide leading-tight">
                    {hintText}
                  </div>
                </div>
              );
            }

            if (isNext && canAfford) {
              return (
                <div key={hint.id} className="flex items-center gap-6 px-4">
                  <LightBulbIcon className="size-5 shrink-0 text-orange-600" />
                  <div className="flex-1 text-orange-600 font-newake uppercase tracking-wide">
                    Indice {hint.id}
                  </div>
                  <PrimaryButton onClick={() => onBuyHint(hint.cost)}>
                    {hint.cost}
                    <StarIcon className="size-5 text-orange-100 mb-0.5" />
                  </PrimaryButton>
                </div>
              );
            }

            return (
              <div key={hint.id} className="flex items-center gap-6 px-4">
                <LightBulbIcon className="size-5 shrink-0 text-orange-300" />
                <div className="flex-1 text-orange-300 text-base font-normal font-newake uppercase tracking-wide">
                  Indice {hint.id}
                </div>
                <PrimaryButton disabled>
                  {hint.cost}
                  <StarIcon className="size-5 text-orange-100 mb-0.5" />
                </PrimaryButton>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
