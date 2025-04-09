import { GrossProfitMixResponse, ProductGapResponse } from "../models/interfaces/dashboards.response";
import { getMonthLabels, getMonthName } from "./date-utils";

export function formatChartData<T extends ProductGapResponse | GrossProfitMixResponse>(
    language: string,
    obj: T[],
    getValue: (item: T) => number
  ): Record<string, { month: string; treatment: number; control: number }[]> {
    const grouped: Record<string, { month: string, treatment: number, control: number }[]> = {};

    const sortedMonth =  getMonthLabels(language)

    const products = [...new Set(obj.map(d => d.productDisplayName))];

    for (const product of products) {
      const dataForProduct = obj.filter(d => d.productDisplayName === product);

      const dataForMonth = new Map<string, { treatment: number, control: number }>();

      for (const data of dataForProduct) {
        const month = getMonthName(data.assessmentMonth, language);
        if (!dataForMonth.has(month)) {
          dataForMonth.set(month, { treatment: 0, control: 0 });
        }

        const entry = dataForMonth.get(month)!;
        const value = +getValue(data).toFixed(2);

        if (data.comparisonGroup === 'TG') {
          entry.treatment = value;
        } else if (data.comparisonGroup === 'CG') {
          entry.control = value;
        }
      }

      const sorted = [...dataForMonth.entries()]
        .sort((a, b) => sortedMonth.indexOf(a[0]) - sortedMonth.indexOf(b[0]))
        .map(([month, valores]) => ({ month, ...valores }));

        grouped[product] = sorted;
    }

    return grouped;
  }