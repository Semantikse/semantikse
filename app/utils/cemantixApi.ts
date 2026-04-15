export interface ScoreResponse {
  s?: number;
  p?: number;
  v?: number;
  error?: string;
  [key: string]: any;
}

export class CemantixApi {
  private static readonly BASE_URL = "https://cemantix.certitudes.org";

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

    const currentDayMs = new Date(
      `${dateObj.year}-${dateObj.month}-${dateObj.day}T00:00:00Z`,
    ).getTime();
    const anchorDayMs = new Date("2026-04-15T00:00:00Z").getTime();

    const diffDays = Math.floor(
      (currentDayMs - anchorDayMs) / (1000 * 60 * 60 * 24),
    );
    return 1505 + diffDays;
  }

  public static async submitWord(word: string): Promise<ScoreResponse> {
    const gameNumber = this.getGameNumber();

    const sessionResponse = await fetch(this.BASE_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
      },
    });

    const setCookie = sessionResponse.headers.get("set-cookie");

    const response = await fetch(`${this.BASE_URL}/score?n=${gameNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://cemantix.certitudes.org",
        Referer: "https://cemantix.certitudes.org/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
        Cookie: setCookie || "",
        Accept: "*/*",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      body: `word=${encodeURIComponent(word)}`,
    });

    if (!response.ok) {
      throw new Error("Erreur HTTP score");
    }

    return response.json();
  }

  public static async getWinnersCount() {
    return (await this.submitWord("example")).v ?? 0;
  }
}
