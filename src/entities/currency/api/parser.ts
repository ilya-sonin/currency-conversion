import { type Currency, AVAILABLE_CURRENCIES } from '../model'
import type { ApiRawResponse, CurrencyPairData } from './types'

export function parseApiResponse(data: ApiRawResponse): CurrencyPairData[] {
  const pairs: CurrencyPairData[] = []

  for (const [pairKey, rate] of Object.entries(data)) {
    if (typeof rate !== 'number' && isNaN(Number(rate))) continue

    const pairMatch = pairKey.match(/^([a-z]{3})-([a-z]{3})$/)
    if (!pairMatch) continue

    const [, fromCurrStr, toCurrStr] = pairMatch
    const from = fromCurrStr.toUpperCase() as Currency
    const to = toCurrStr.toUpperCase() as Currency

    if (AVAILABLE_CURRENCIES.includes(from) && AVAILABLE_CURRENCIES.includes(to)) {
      pairs.push({
        from,
        to,
        rate: Number(rate),
      })
    }
  }

  return pairs
}

export function calculateRatesForBase(
  pairs: CurrencyPairData[],
  baseCurrency: Currency,
): Record<Currency, number> {
  const directRates: Record<string, number> = {}
  const reversePairs: Record<string, string> = {}

  pairs.forEach(({ from, to, rate }) => {
    const key = `${from}-${to}`
    directRates[key] = rate
    reversePairs[`${to}-${from}`] = key
  })

  const rates: Record<Currency, number> = {} as Record<Currency, number>
  rates[baseCurrency] = 1

  AVAILABLE_CURRENCIES.forEach((currency) => {
    if (currency === baseCurrency) return

    const directKey = `${baseCurrency}-${currency}`
    const directRate = directRates[directKey]

    const reverseKey = `${currency}-${baseCurrency}`
    const reverseRate = directRates[reverseKey]

    if (directRate !== undefined) {
      if (directRate >= 0.1) {
        rates[currency] = directRate
      } else if (reverseRate !== undefined) {
        rates[currency] = reverseRate
      }
    } else if (reverseRate !== undefined) {
      rates[currency] = reverseRate
    }

    if (!rates[currency]) {
      for (const intermediary of AVAILABLE_CURRENCIES) {
        if (intermediary === baseCurrency || intermediary === currency) continue

        const firstPairKey = `${baseCurrency}-${intermediary}`
        const secondPairKey = `${intermediary}-${currency}`

        const firstRate = directRates[firstPairKey]
        const secondRate = directRates[secondPairKey]

        if (firstRate && secondRate) {
          rates[currency] = secondRate / firstRate
          break
        }
      }
    }
  })

  return rates
}
