<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import './styles/tailwind.css'; 
const router = useRouter();

onMounted(() => {
  router.push('/admin');
});


</script>

<template>
  <main class="app-container">
    <router-view />
  </main>
</template>



<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap');
body {
  font-family: "Roboto";
  padding: 0;
  margin: 0;
}

</style>