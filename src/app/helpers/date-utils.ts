export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toISOString().split('T')[0];
}

export function getYear(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.getFullYear().toString();
}

export function getMonthName(date: string | Date, lang: string = 'pt'): string {
  const parsedDate = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;

  const monthNames = getMonthLabels(lang);

  return monthNames[parsedDate.getMonth()];
}

const monthAbbreviations: { en: string; pt: string }[] = [
  { en: 'Jan', pt: 'Jan' },
  { en: 'Feb', pt: 'Fev' },
  { en: 'Mar', pt: 'Mar' },
  { en: 'Apr', pt: 'Abr' },
  { en: 'May', pt: 'Mai' },
  { en: 'Jun', pt: 'Jun' },
  { en: 'Jul', pt: 'Jul' },
  { en: 'Aug', pt: 'Ago' },
  { en: 'Sep', pt: 'Set' },
  { en: 'Oct', pt: 'Out' },
  { en: 'Nov', pt: 'Nov' },
  { en: 'Dec', pt: 'Dez' }
];

export function getMonthLabels(currentLang: string): string[] {
  const lang = currentLang === 'br' ? 'pt' : currentLang;

  if (!['pt', 'en'].includes(lang)) {
    throw new Error(`Invalid Lang "${currentLang}". Use "pt", "en" ou "br".`);
  }

  return monthAbbreviations.map(m => m[lang as 'pt' | 'en']);
}

export function formatDateTime(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${day}-${month}-${year}_${hour}:${minute}:${second}`;
}