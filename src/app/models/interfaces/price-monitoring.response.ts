export interface PriceMonitoringModel {
    assessmentMonth: Date;
    storeName: string;
    sourceStoreId: string;
    city: string;
    validityFrom: Date;
    validityUntil: Date;
    productDescription: string;
    productDisplayName: string;
    recType: 'gap' | 'price';
    recommendedValue: number;
    latestPumpPriceWithinRecVal: number;
    pumpPriceDiff: number;
    appliedValue: number;
    recommendedAppliedValueDiff: number
  }