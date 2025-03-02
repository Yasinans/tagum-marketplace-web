<script setup lang="ts">
import axios from "axios";
import { computed, ref } from 'vue';

import {
  CalendarDateRangeIcon,
  PlusIcon,
  ArrowPathRoundedSquareIcon,
  ListBulletIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid';

//data interfaces
interface SupplierData {
  id: number;
  name: string;
  email: string;
  contact: string;
}

interface BrandData {
  id: number;
  name: string;
}


</script>

<template>
  <main class="flex text-nowrap flex-col gap-[16px] p-[26px]">
    <div class="font-med text-[18px] text-white tracking-tighter">Product & Inventory</div>
    <!--Sections-->
    <div class="flex flex-wrap justify-start gap-[20px]">
      <!--Main Section - Product-->
      <product-pack-widget/>

       <!--Main Section - Stocks-->
      <supply-widget/>

      <!--Product-->
      <product-widget/>
      <brand-widget/>
      <supplier-widget/>
    </div>
  </main>
</template>

<style scoped>
</style>