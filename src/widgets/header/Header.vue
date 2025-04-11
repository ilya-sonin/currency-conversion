<script setup lang="ts">
import { useCurrencyStore } from '@/app/stores/currency'
import { AVAILABLE_CURRENCIES } from '@/entities/currency'
import { CurrencySelect } from '@/shared/ui'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

const currencyStore = useCurrencyStore()
const { baseCurrency } = storeToRefs(currencyStore)
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="navbar-start flex-1">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
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
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><RouterLink to="/">Главная</RouterLink></li>
          <li><RouterLink to="/convert">Конвертация</RouterLink></li>
          <li class="lg:hidden mt-2">
            <span class="font-bold mb-1">Основная валюта:</span>
            <CurrencySelect v-model="baseCurrency" :currencies="AVAILABLE_CURRENCIES" />
          </li>
        </ul>
      </div>
      <RouterLink to="/" class="btn btn-ghost text-xl">Конвертер</RouterLink>
    </div>
    <div class="navbar-center flex-1 hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><RouterLink to="/">Главная</RouterLink></li>
        <li><RouterLink to="/convert">Конвертация</RouterLink></li>
      </ul>
    </div>
    <div class="navbar-end flex-1 hidden md:block">
      <div class="form-control">
        <div class="flex items-center justify-end gap-2">
          <span class="text-sm">Основная валюта:</span>
          <CurrencySelect v-model="baseCurrency" :currencies="AVAILABLE_CURRENCIES" />
        </div>
      </div>
    </div>
  </div>
</template>
