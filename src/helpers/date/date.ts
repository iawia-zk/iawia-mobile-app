export function epochToDate(epochTime: number): Date {
  return new Date(epochTime * 1000);
}

export function yymmddToDate(yymmdd: string): string {
  const year = '20' + yymmdd.slice(0, 2);
  const month = yymmdd.slice(2, 4);
  const day = yymmdd.slice(4, 6);

  return `${year}-${month}-${day}`;
}

export function getCurrentDateYYMMDD(dayDiff: number = 0): number[] {
  const date = new Date();
  date.setDate(date.getDate() + dayDiff); // Adjust the date by the dayDiff
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const YY = `0${year % 100}`.slice(-2);
  const MM = `0${month}`.slice(-2);
  const DD = `0${day}`.slice(-2);

  const yymmdd = `${YY}${MM}${DD}`;
  return Array.from(yymmdd).map((char) => parseInt(char, 10));
}
