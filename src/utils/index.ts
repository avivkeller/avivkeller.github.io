import type { Achievement, SpeakingEngagement } from "../types";

export const isCve = (achievement: Achievement) =>
  /^CVE-\d{4}-\d+$/.test(achievement.title);

/** Formats a YYYY-MM (or YYYY-MM-DD) date as "October 2025". */
export const formatMonth = (date: string) =>
  Temporal.PlainYearMonth.from(date)
    .toPlainDate({ day: 1 })
    .toLocaleString("en-US", { month: "long", year: "numeric" });

/** Formats a YYYY-MM-DD date as "August 14, 2026". */
export const formatDate = (date: string) =>
  Temporal.PlainDate.from(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

/** The last day an engagement covers: its date, or the end of its month. */
function lastDayOf(date: string) {
  if (date.length > 7) return Temporal.PlainDate.from(date);
  const month = Temporal.PlainYearMonth.from(date);
  return month.toPlainDate({ day: month.daysInMonth });
}

/** True when the engagement hasn't happened yet as of the build. */
export const isUpcoming = ({ date }: SpeakingEngagement) =>
  Temporal.PlainDate.compare(
    lastDayOf(date),
    Temporal.Now.plainDateISO("UTC"),
  ) >= 0;

export const byDateDesc = (a: SpeakingEngagement, b: SpeakingEngagement) =>
  b.date.localeCompare(a.date);
