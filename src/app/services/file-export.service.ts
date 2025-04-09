import { Injectable } from '@angular/core';
import { formatDateTime } from '../helpers/date-utils';

@Injectable({ providedIn: 'root' })
@Injectable({ providedIn: 'root' })

export class FileExportService {
  constructor() {}

  downloadAsCsv<T>(data: T[], filename: string, headerMap: Record<keyof T, string>): void {
    if (!data || !data.length) return;

    const keys = Object.keys(headerMap) as (keyof T)[];
    const headers = keys.map(key => headerMap[key]);

    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        keys.map(key => this.escapeValue(row[key])).join(',')
      )
    ];

    const formattedData = formatDateTime();
    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${formattedData}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private escapeValue(value: any): string {
    if (value === null || value === undefined) return '';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  }
}
