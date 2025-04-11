export enum CurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
}

export type Currency = keyof typeof CurrencyEnum

export interface CurrencyRate {
  code: Currency
  value: number
}

export interface CurrencyRates {
  base: Currency
  rates: Record<Currency, number>
}

export interface CurrencyPair {
  fromCurrency: Currency
  toCurrency: Currency
  rate: number
}

export const AVAILABLE_CURRENCIES: Currency[] = Object.keys(CurrencyEnum) as Currency[]
