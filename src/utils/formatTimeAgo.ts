const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "always",
});

type division = {
  amount: number;
  name: Intl.RelativeTimeFormatUnit;
}

const DIVISIONS: division[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < (division as division).amount) {
      return formatter.format(Math.round(duration), (division as division).name);
    }
    duration /= (division as division).amount;
  }
}
