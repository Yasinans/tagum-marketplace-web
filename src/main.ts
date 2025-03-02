import { createApp } from "vue";
import App from "./App.vue";
import NavBar from  './views/components/NavBar.vue';
import Headers from  './views/components/Heading.vue';
import router from  './router/index.ts';
import VueApexCharts from "vue3-apexcharts";
//Widgets
import SupplierWidget from "./views/components/widgets/SupplierWidget.vue";
import BrandWidget from "./views/components/widgets/BrandWidget.vue";
import ProductWidget from "./views/components/widgets/ProductWidget.vue";
import ProductPackWidget from "./views/components/widgets/ProductPackWidget.vue";
import SupplyWidget from "./views/components/widgets/SupplyWidget.vue";
const app = createApp(App);
//lock employeeId to jaja
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token") || "";
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                next('/'); 
            } else {
                if(payload.role=="admin" && to.fullPath=="/"){
                    next('/admin');
                } else next();
            }
        } catch (err) {
            localStorage.removeItem("token");
            next('/'); 
        }
    } else {
        if (to.meta.requiresAuth) {
            next('/');
        } else {
            next();
        }
    }
});

app.use(router);
app.use(VueApexCharts);

app.component('apexchart', VueApexCharts)

app.component('navbar',NavBar);
app.component('headers',Headers);
//widgets
app.component('supplier-widget',SupplierWidget);
app.component('brand-widget',BrandWidget);
app.component('product-widget',ProductWidget);
app.component('product-pack-widget',ProductPackWidget);
app.component('supply-widget',SupplyWidget);
app.mount("#app");
