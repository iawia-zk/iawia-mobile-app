export function epochToDate(epochTime: number): Date {
  return new Date(epochTime * 1000);
}

export function yymmddToDate(yymmdd: string): string {
  const year = '20' + yymmdd.slice(0, 2);
  const month = yymmdd.slice(2, 4);
  const day = yymmdd.slice(4, 6);

  return `${year}-${month}-${day}`;
}