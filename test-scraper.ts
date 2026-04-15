import { HintsScraper } from "./app/utils/hintsScraper";

async function runScraperTest() {
  console.log("=== TEST DU SCRAPER GAMEWAVE ===");
  console.log("Recherche des indices en cours...\n");

  try {
    const hints = await HintsScraper.getDailyHints();

    if (hints.length === 0) {
      console.log("⚠️ Aucun indice trouvé. Gamewave n'a peut-être pas encore publié l'article du jour, ou la structure de la page a changé.");
    } else {
      console.log(`${hints.length} indices récupérés avec succès :\n`);
      hints.forEach(hint => {
        console.log( ${hint});
      });
    }
  } catch (error: any) {
    console.error(`Erreur lors du scraping : ${error.message}`);
  }
}

runScraperTest();
