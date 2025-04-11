<script setup lang="ts">
import { useCurrencyStore } from '@/app/stores/currency'
import { useCurrencyApi } from '@/entities/currency/api/service'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'

const currencyStore = useCurrencyStore()
const { baseCurrency } = storeToRefs(currencyStore)
const { isLoading, error, data, fetchRates } = useCurrencyApi()

onMounted(() => {
  fetchRates(baseCurrency.value)
})

watch(baseCurrency, fetchRates, { immediate: true })

function displayRate(rate: number): string {
  return Number(rate).toFixed(2)
}

const currencyRates = computed(() => {
  if (!data.value) return []

  const { base, rates } = data.value

  return Object.entries(rates)
    .filter(([code]) => code !== base)
    .map(([code, value]) => ({
      code,
      value: Number(value),
      displayBase: base,
    }))
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">
      Курсы валют по отношению к {{ baseCurrency }}
    </h1>

    <div v-if="isLoading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-else-if="data" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="rate in currencyRates" :key="rate.code" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title justify-center text-2xl">
            1 {{ rate.code }} = {{ displayRate(rate.value) }} {{ rate.displayBase }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
