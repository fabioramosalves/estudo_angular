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

  export interface PriceMonitoringValues{
    productDescription: string;
    productDisplayName: string;
    minRecommendedValue: number;
    maxRecommendedValue: number;
    maxLatestPumpPriceWithinRecVal: number;
    minLatestPumpPriceWithinRecVal: number;
    maxPumpPriceDiff: number;
    minPumpPriceDiff: number;
    maxRecommendedAppliedValueDiff: number;
    minRecommendedAppliedValueDiff: number;
    maxAppliedValue: number;
    minAppliedValue: number;
  }
