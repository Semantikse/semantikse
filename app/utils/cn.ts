import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Permet de mettre des classes tailwind et de les fusionner
 * Exemple :
 * function CustomInput(className) {
 *   return <input className={cn("px-3 py-4 bg-blue-50", {"bg-red-100": isHovered}, className)}>
 * }
 * Aura un background red si isHovered est true.
 * Si className=="bg-green-50", le composant sera vert
 *
 * Même exemple mais sans cn :
 * function CustomInput(className) {
 *   return <input className={`px-3 py-4 ${isHovered ? 'bg-red-100' : 'bg-blue-50'} ${className}`}>
 * }
 * Ici, on va avoir un conflit car on va juste concaténer les classes.
 * Si className=="bg-green-50", le composant ne sera pas forcément vert
 *
 * @param inputs Classes tailwind à fusionner
 * @returns Classes fusionnées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
