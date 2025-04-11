import type { Currency } from '@/entities/currency'
import { AVAILABLE_CURRENCIES } from '@/entities/currency'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useCurrencyStore } from './currency'

export const useConverterStore = defineStore('converter', () => {
  const currencyStore = useCurrencyStore()

  const fromCurrency = ref<Currency>(currencyStore.baseCurrency)
  const toCurrency = ref<Currency>(currencyStore.baseCurrency === 'USD' ? 'RUB' : 'USD')
  const fromAmount = ref<string>('1')
  const toAmount = ref<string>('')
  const isFromFocused = ref(true)
  const rates = ref<Record<Currency, number>>({
    USD: 1,
    EUR: 0.85,
    RUB: 87.11,
  })

  const availableCurrencies = computed(() => AVAILABLE_CURRENCIES)

  function convert(amount: string, from: Currency, to: Currency): string {
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      return ''
    }

    const fromRate = rates.value[from]
    const toRate = rates.value[to]

    if (!fromRate || !toRate) return ''

    const amountInBase = parseFloat(amount) / fromRate
    const result = amountInBase * toRate

    return result.toFixed(2)
  }

  function updateToAmount() {
    if (isFromFocused.value) {
      toAmount.value = convert(fromAmount.value, fromCurrency.value, toCurrency.value)
    }
  }

  function updateFromAmount() {
    if (!isFromFocused.value) {
      fromAmount.value = convert(toAmount.value, toCurrency.value, fromCurrency.value)
    }
  }

  function updateRates(newRates: Record<Currency, number>) {
    rates.value = { ...newRates }
    recalculate()
  }

  function recalculate() {
    if (isFromFocused.value) {
      updateToAmount()
    } else {
      updateFromAmount()
    }
  }

  function setFromFocus() {
    isFromFocused.value = true
  }

  function setToFocus() {
    isFromFocused.value = false
  }

  function swapCurrencies() {
    const tempCurrency = fromCurrency.value
    fromCurrency.value = toCurrency.value
    toCurrency.value = tempCurrency

    if (fromAmount.value && toAmount.value) {
      const tempAmount = fromAmount.value
      fromAmount.value = toAmount.value
      toAmount.value = tempAmount
    }
  }

  watch(fromCurrency, (newValue, oldValue) => {
    if (newValue === toCurrency.value && newValue !== oldValue) {
      toCurrency.value = oldValue
    }
    recalculate()
  })

  watch(toCurrency, (newValue, oldValue) => {
    if (newValue === fromCurrency.value && newValue !== oldValue) {
      fromCurrency.value = oldValue
    }
    recalculate()
  })

  watch(fromAmount, updateToAmount)
  watch(toAmount, updateFromAmount)

  updateToAmount()

  watch(
    () => currencyStore.baseCurrency,
    (newBase) => {
      if (fromCurrency.value === currencyStore.baseCurrency) {
        fromCurrency.value = newBase
      }
    },
  )

  return {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    rates,

    availableCurrencies,

    updateRates,
    setFromFocus,
    setToFocus,
    recalculate,
    swapCurrencies,
  }
})
