export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num); // Indian numbering format e.g. 1,00,000
}

export function formatDateTime(timestamp: number): { dateStr: string; timeStr: string; fullStr: string } {
  const d = new Date(timestamp);
  const dateStr = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return {
    dateStr,
    timeStr,
    fullStr: `${dateStr}, ${timeStr}`
  };
}

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatPercentage(part: number, total: number): string {
  if (total <= 0) return '0.0%';
  const pct = (part / total) * 100;
  return `${pct.toFixed(1)}%`;
}
