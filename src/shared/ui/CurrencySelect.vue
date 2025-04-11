<script setup lang="ts">
import { type Currency } from '@/entities/currency'

const props = defineProps<{
  modelValue: Currency
  currencies: Currency[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Currency): void
}>()

const handleChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  emit('update:modelValue', target.value as Currency)
}
</script>

<template>
  <select class="select select-bordered" :value="modelValue" @change="handleChange">
    <option v-for="currency in currencies" :key="currency" :value="currency">
      {{ currency }}
    </option>
  </select>
</template>
