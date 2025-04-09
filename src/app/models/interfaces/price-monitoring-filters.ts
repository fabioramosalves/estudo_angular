export interface RangeMaxMin {
    min: number
    max: number
  }
  
export interface PriceMonitoringFiltersType {
    assessment_month: string | null
    store_name: string[]
    source_store_id: string | null
    products: string[]
    city: string[]
    rec_type: string | null
    recommended_value: RangeMaxMin | null
    applied_value?: RangeMaxMin | null
    recommended_applied_value_diff: RangeMaxMin | null
    latest_pump_price_within_rec_val: RangeMaxMin | null
    pump_price_diff: RangeMaxMin | null
    page_size: number
    page: number
  }