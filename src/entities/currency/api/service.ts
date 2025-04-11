import { ref } from 'vue'
import { CurrencyEnum, type Currency, type CurrencyRates } from '../model'
import { calculateRatesForBase, parseApiResponse } from './parser'
import type { ApiRawResponse } from './types'

const API_URL = 'https://status.neuralgeneration.com/api/currency'

export class CurrencyService {
  private static instance: CurrencyService

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  async fetchCurrencyData(): Promise<ApiRawResponse> {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Ошибка при загрузке курсов валют:', error)
      throw error
    }
  }
}

export function useCurrencyApi(forConvert: boolean = false) {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<CurrencyRates | null>(null)

  const service = CurrencyService.getInstance()

  const fetchRates = async (baseCurrency: Currency): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const apiData = await service.fetchCurrencyData()

      const currencyPairs = parseApiResponse(apiData)

      const rates = calculateRatesForBase(currencyPairs, baseCurrency, forConvert)

      data.value = {
        base: baseCurrency,
        rates,
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов валют'

      const fallbackRates: Record<Currency, number> = {} as Record<Currency, number>

      if (baseCurrency === CurrencyEnum.USD) {
        fallbackRates.USD = 1
        fallbackRates.EUR = 0.85
        fallbackRates.RUB = 87.11
      } else if (baseCurrency === CurrencyEnum.EUR) {
        fallbackRates.USD = 1.17
        fallbackRates.EUR = 1
        fallbackRates.RUB = 98.63
      } else {
        fallbackRates.USD = 1 / 87.11
        fallbackRates.EUR = 1 / 98.63
        fallbackRates.RUB = 1
      }

      data.value = {
        base: baseCurrency,
        rates: fallbackRates,
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    data,
    fetchRates,
  }
}
