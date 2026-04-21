const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

/**
 * Returns an array of month labels (e.g., "Jan 2024", "Fev 2024") covering
 * the range from startDate to endDate (inclusive of both months).
 * Dates must be in YYYY-MM-DD format.
 */
export function getMonthsBetween(startDate: string, endDate: string): string[] {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  const months: string[] = [];

  let year = start.getFullYear();
  let month = start.getMonth();

  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${MONTH_LABELS[month]} ${year}`);
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return months;
}

/**
 * Calculates the left offset and width (as percentages 0–100) of a project bar
 * relative to a timeline range. Project dates that extend beyond the timeline
 * bounds are clamped.
 */
export function getBarPosition(
  dataInicio: string,
  dataFim: string,
  timelineStart: string,
  timelineEnd: string,
): { left: number; width: number } {
  const projStart = new Date(dataInicio + 'T00:00:00').getTime();
  const projEnd = new Date(dataFim + 'T00:00:00').getTime();
  const tlStart = new Date(timelineStart + 'T00:00:00').getTime();
  const tlEnd = new Date(timelineEnd + 'T00:00:00').getTime();

  const totalRange = tlEnd - tlStart;

  if (totalRange <= 0) {
    return { left: 0, width: 0 };
  }

  const clampedStart = Math.max(projStart, tlStart);
  const clampedEnd = Math.min(projEnd, tlEnd);

  const left = ((clampedStart - tlStart) / totalRange) * 100;
  const width = Math.max(0, ((clampedEnd - clampedStart) / totalRange) * 100);

  return { left, width };
}
