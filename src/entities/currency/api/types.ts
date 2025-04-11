import type { Currency } from '../model'

export interface ApiRawResponse {
  [key: string]: number
}

export interface CurrencyPairData {
  from: Currency
  to: Currency
  rate: number
}
