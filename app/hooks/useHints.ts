import { useEffect, useState } from "react";

export default function useHints() {
  const [hints, setHints] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/hints")
      .then((res) => res.json())
      .then((data) => {
        if (data.hints) {
          setHints(data.hints);
        }
      })
      .catch((err) => console.error("Erreur récupération indices:", err));
  }, []);

  return hints;
}
