<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const router = useRouter();
onMounted(() => {
  router.push('/');
});
//auto push depending on  role, call first
</script>

<template>
  <main class="app-container">
    <router-view />
  </main>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap');
@import "tailwindcss";
@plugin "daisyui";

body {
  font-family: "Roboto";
  padding: 0;
  margin: 0;
}

/*Custom CSS*/
thead td {
  position: sticky;
  background-color: #5a3939;
  top: 0;
  padding: 13px 14px 13px 20px;
  font-size: 14px;
  color: rgb(245, 245, 245);
  font-weight: 700;
}

tr {
  line-height: 15px;
}

tbody td {
  height: 10px;
  font-size: 14px;
  padding: 12px 0 12px 20px;
  border-top: 1px solid rgb(124, 90, 90);
  font-variation-settings:
    "wdth" 75;

}

tbody td:last-child {
  padding-right: 12px;
}


/*Final CSS*/
.tg-table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  max-height: 600px;
  padding: 6px;
  border-radius: 7px;

  background-color: #5a3939;
  box-shadow: inset -12px -8px 40px #421f1f5e;
}

.tg-main-table{
  max-height: none !important;
}
.tg-table {
  flex-grow: 1;
  border-collapse: collapse;
  width: 100%;
}

/*Custom Widget */
.tg-widget {
  flex: 1 1 auto;
  overflow-x: hidden;
  user-select: none;
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  background-color: #744e4e;
  color: white;
  padding: 13px;
  box-shadow: var(--shadow-md);
}

.tg-widget-h {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-variation-settings:
    'wdth' 75;
}

.tg-widget-btn {
  background-color: transparent;
  border: 1px solid rgba(43, 39, 39, 0.404);
  border-radius: 10px;
  transition: all 300ms;
}

.tg-widget-btn:hover {
  background-color: rgba(43, 39, 39, 0.404);
}

.tg-widget-btn-icon {
  height: 20px;
  width: 20px;
  margin: 6px;
}

/*Temporary Modal*/
.saveinfo {
  border-color: rgb(117, 117, 117);
  color: white;
  background-color: rgb(77, 74, 74);
}

.modal-box {
  color: rgb(39, 38, 38);
  font-size: 14px;
  background-color: #ebbb95;
}

.modal-box select,
.modal-box input {
  border: transparent;
  background-color: #ffffff;

}
</style>