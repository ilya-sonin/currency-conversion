<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus'): void
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = () => {
  emit('focus')
}
</script>

<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      type="text"
      placeholder="Введите сумму"
      class="input input-lg input-bordered w-full"
      :class="{ 'input-error': error }"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
    />
    <div v-if="error" class="text-error text-sm mt-1">{{ error }}</div>
  </div>
</template>
