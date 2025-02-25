import { createApp } from "vue";
import App from "./App.vue";
import NavBar from  './views/components/NavBar.vue';
import Headers from  './views/components/Heading.vue';
import router from  './router/index.ts';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(router);
app.use(VueApexCharts);

app.component('apexchart', VueApexCharts)

app.component('navbar',NavBar);
app.component('headers',Headers);

app.mount("#app");
