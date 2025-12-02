export function getDateDeltaInDays(
  start: string | Date,
  end: string | Date
): number {
  const d1 = start instanceof Date ? start : new Date(start);
  const d2 = end instanceof Date ? end : new Date(end);

  const diffInMilliseconds = d2.getTime() - d1.getTime();

  return diffInMilliseconds / (1000 * 60 * 60 * 24);
}

export function normalize(text: string) {
  return text.toLowerCase().trim();
}
