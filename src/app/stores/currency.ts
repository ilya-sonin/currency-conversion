import { type Currency, CurrencyEnum } from '@/entities/currency'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref<Currency>(CurrencyEnum.USD)

  return {
    baseCurrency,
  }
})
