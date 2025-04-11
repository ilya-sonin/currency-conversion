import type { Currency } from '@/entities/currency'
import { AVAILABLE_CURRENCIES } from '@/entities/currency'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref<Currency>('USD')

  const setBaseCurrency = (currency: Currency) => {
    if (AVAILABLE_CURRENCIES.includes(currency)) {
      baseCurrency.value = currency
    }
  }

  return {
    baseCurrency,
    setBaseCurrency,
  }
})
