import { PriceMonitoring } from "../models/entities/price-monitoring";
import { PriceMonitoringModel } from "../models/interfaces/price-monitoring.response";


export class PriceMonitoringMapper {
  static toEntity(model: PriceMonitoringModel): PriceMonitoring {
    return {
      storeName: model.storeName,
      sourceStoreId: model.sourceStoreId,
      city: model.city,
      validityFrom: new Date(model.validityFrom),
      productDisplayName: model.productDisplayName,
      recType: model.recType,
      recommendedValue: model.recommendedValue,
      appliedValue: model.appliedValue,
      recommendedAppliedValueDiff: model.recommendedAppliedValueDiff,
      latestPumpPriceWithinRecVal: model.latestPumpPriceWithinRecVal,
      pumpPriceDiff: model.pumpPriceDiff
    };
  }

  static toEntities(models: PriceMonitoringModel[]): PriceMonitoring[] {
    return models.map(this.toEntity);
  }
}
