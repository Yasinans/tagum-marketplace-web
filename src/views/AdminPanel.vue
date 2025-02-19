<script setup lang="ts">

</script>

<template>
    <main class="panel-container">
        <navbar class="navbar"/>
        <headers class="headers"/>
        <router-view class="router-view"/>

    </main>
  </template>
  
  <style scoped>
  .navbar{
    grid-row: 1/ span 2;
    grid-column: 1;
    height:100%;
  }

  .headers{
    grid-column: 2;
    grid-row:1;
  }

  .router-view {
    overflow: auto;
    grid-row:2;
    grid-column: 2;
  }
  .panel-container {
    overflow: hidden;
    display: grid;
    grid-gap:0;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    height:100vh;
  }
  </style>