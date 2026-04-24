export function formatHoursMinutesSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");

  return `${h}:${mm}:${ss}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const mm = m.toString().padStart(2, "0");

  return h > 0 ? `${h}H ${mm} min` : `${mm} min`;
}

export function formatThousands(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
