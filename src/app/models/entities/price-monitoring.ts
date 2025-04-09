export interface PriceMonitoring {
    storeName: string;
    sourceStoreId: string;
    city: string;
    validityFrom: Date;
    productDisplayName: string;
    recType: 'gap' | 'price';
    recommendedValue: number;
    latestPumpPriceWithinRecVal: number;
    pumpPriceDiff: number;
    appliedValue: number;
    recommendedAppliedValueDiff: number
  }

  export const PriceMonitoringCsvHeaderMap: Record<keyof PriceMonitoring, string> = {
    storeName: 'Posto',
    sourceStoreId: 'Código',
    city: 'Cidade',
    validityFrom: 'Data Recomendação',
    productDisplayName: 'Produto',
    recType: 'Tipo',
    recommendedValue: 'Recomendado',
    appliedValue: 'Aplicado',
    recommendedAppliedValueDiff: 'Dif. Aplicado - Recomendado (R$)',
    latestPumpPriceWithinRecVal: 'Preço Bomba Atual (R$)',
    pumpPriceDiff: 'PB Atual - Último PB (R$)'
  };