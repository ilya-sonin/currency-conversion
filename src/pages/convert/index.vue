<script setup lang="ts">
import { useConverterStore } from '@/app/stores/converter'
import { useCurrencyStore } from '@/app/stores/currency'
import { useCurrencyApi } from '@/entities/currency/api/service'
import { CurrencyInput, CurrencySelect } from '@/shared/ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const currencyStore = useCurrencyStore()
const converterStore = useConverterStore()
const { baseCurrency } = storeToRefs(currencyStore)
const { fromCurrency, toCurrency, fromAmount, toAmount, availableCurrencies } =
  storeToRefs(converterStore)
const { updateRates, setFromFocus, setToFocus, swapCurrencies } = converterStore

const { isLoading, error, data, fetchRates } = useCurrencyApi(true)

const fromError = ref<string | undefined>(undefined)
const toError = ref<string | undefined>(undefined)

watch(
  baseCurrency,
  (newBaseCurrency) => {
    if (fromCurrency.value !== newBaseCurrency) {
      fromCurrency.value = newBaseCurrency
      fetchRates(newBaseCurrency)
    }
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  await fetchRates(baseCurrency.value)
})

watch(
  data,
  (newData) => {
    if (newData && newData.rates) {
      const rates = { ...newData.rates }
      rates[newData.base] = 1
      updateRates(rates)
    }
  },
  { immediate: true },
)

watch(fromAmount, (value) => {
  if (value && !/^\d*\.?\d*$/.test(value)) {
    fromError.value = 'Введите числовое значение'
  } else {
    fromError.value = undefined
  }
})

watch(toAmount, (value) => {
  if (value && !/^\d*\.?\d*$/.test(value)) {
    toError.value = 'Введите числовое значение'
  } else {
    toError.value = undefined
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Конвертация валют</h1>

    <div v-if="isLoading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-else class="max-w-lg mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="grid gap-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="md:col-span-2">
              <CurrencyInput v-model="fromAmount" @focus="setFromFocus" :error="fromError" />
            </div>
            <CurrencySelect v-model="fromCurrency" :currencies="availableCurrencies" />
          </div>

          <div class="divider flex justify-center items-center">
            <button
              class="btn btn-circle btn-sm"
              @click="swapCurrencies"
              title="Поменять валюты местами"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="md:col-span-2">
              <CurrencyInput v-model="toAmount" @focus="setToFocus" :error="toError" />
            </div>
            <CurrencySelect v-model="toCurrency" :currencies="availableCurrencies" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
