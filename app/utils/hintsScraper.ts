import * as cheerio from "cheerio";

export class HintsScraper {
  private static getGameNumber(): number {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    
    const parts = formatter.formatToParts(now);
    const dateObj: Record<string, string> = {};
    for (const part of parts) {
      if (part.type !== "literal") {
        dateObj[part.type] = part.value;
      }
    }

    const currentDayMs = new Date(`${dateObj.year}-${dateObj.month}-${dateObj.day}T00:00:00Z`).getTime();
    const anchorDayMs = new Date("2026-04-15T00:00:00Z").getTime();
    
    return 1505 + Math.floor((currentDayMs - anchorDayMs) / (1000 * 60 * 60 * 24));
  }

  private static getUrlDateString(): string {
    const now = new Date();
    const day = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric" }).format(now);
    const year = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", year: "numeric" }).format(now);
    
    const monthNames = [
      "janvier", "fevrier", "mars", "avril", "mai", "juin", 
      "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
    ];
    const monthIndex = parseInt(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", month: "numeric" }).format(now)) - 1;

    return `${day}-${monthNames[monthIndex]}-${year}`;
  }

  public static async getDailyHints(): Promise<string[]> {
    const gameNumber = this.getGameNumber();
    const dateStr = this.getUrlDateString();
    
    const url = `https://gamewave.fr/cemantix/cemantix-${gameNumber}-indices-et-solution-quel-est-le-mot-du-${dateStr}/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
        "Accept": "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`Article introuvable sur Gamewave (Erreur ${response.status})`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const hints: string[] = [];

    // On cible toutes les balises <details> de la page
    $("details").each((_, element) => {
      const summaryText = $(element).find("summary").text(); // "Indice 1"
      
      // Si le résumé contient "Indice" (insensible à la casse)
      if (summaryText.toLowerCase().includes("indice")) {
        // Le texte complet comprend "Indice 1Le vrai texte...". 
        // On retire donc le texte du summary pour ne garder que la phrase d'indice.
        const fullText = $(element).text();
        const hintContent = fullText.replace(summaryText, '').trim();
        
        if (hintContent.length > 0 && !hints.includes(hintContent)) {
          hints.push(hintContent);
        }
      }
    });

    return hints;
  }
}
