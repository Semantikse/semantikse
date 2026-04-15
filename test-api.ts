import { CemantixApi } from "./app/utils/cemantixApi";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

async function runSimulator() {
  console.log("=== SIMULATEUR CÉMANTIX ===");
  console.log("Tapez 'exit' pour quitter.\n");

  while (true) {
    const word = await rl.question("Entrez un mot : ");
    const cleanWord = word.trim().toLowerCase();

    if (cleanWord === "exit" || cleanWord === "quitter") {
      console.log("Au revoir !");
      rl.close();
      break;
    }

    if (!cleanWord) continue;

    try {
      const result = await CemantixApi.submitWord(cleanWord);
      console.log(result);
      console.log("");
    } catch (error: any) {
      console.error(`Erreur réseau : ${error.message}\n`);
    }
  }
}

runSimulator();
