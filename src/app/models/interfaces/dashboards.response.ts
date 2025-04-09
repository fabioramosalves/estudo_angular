export interface UpsideResponse {
    monetaryUpsideGrossProfit: number;
    upsideGrossProfit: number;
}

export interface ProjectOutcomeResponse {
    monetaryUpsideGrossProfit: number;
    assessmentMonth: Date;
    executionDate: Date;
}

export interface StationsGrowthResponse {
    liftGrossProfit: number;
    comparisonGroup: string;
}

export interface ParticipatingStationsResponse {
    countStoresProject: number;
    countStoresProjectTg: number;
    countTgStoresWithTransactions: number;
}

export interface ProductGrossProfitResponse {
    kpiValue: number;
    productDescription: string;
    productDisplayName: string;
    percent?: number;
}

export interface AdditiveMixResponse {
    assessmentMonth: Date;
    shareTotal: number;
}

export interface GrossProfitMixResponse {
    assessmentMonth: Date;
    comparisonGroup: string;
    share: number;
    productDescription: string;
    productDisplayName: string;
}

export interface GrossProfitGrowthResponse {
    percentual: number;
    percentagePoints: number;
}

export interface StateGrowthResponse {
    state: string;
    growth: number;
}

export interface CityGrowthResponse {
    city: string;
    growth: number;
}

export interface SuccessFeeResponse {
    successFeeToCharge: number;
}

export interface ProjectResultAssessmentResponse {
    grossProfit: number;
    grossProfitBaseline: number;
    growthValue: number;
    growthPercent: number;
    comparisonGroup: 'TG' | 'CG';
}

export interface StationsForAssessmentResponse {
    countTotalStores: number;
    countStoresRemovedBySss: number;
    countStoresOutliers: number;
    countStoresAssessed: number;
    comparisonGroup: string;
    comparisonGroupDisplay: string;
}

export interface RegionGrowthResponse {
    assessmentMonth: string;
    levelValue: string;
    lift: number;
}

export interface ProductGapResponse {
    assessmentMonth: Date;
    comparisonGroup: string;
    internalProductId: number;
    productDescription: string;
    productDisplayName: string;
    appliedPriceGap: number;
  }
