import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/Login.vue'
import AdminPanel from '../views/AdminPanel.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import AdminUserManagement from '../views/admin/AdminUserManagement.vue';
import AdminSales from '../views/admin/AdminSales.vue';
import AdminProduct from '../views/admin/AdminProduct.vue';
import AdminSettings from '../views/admin/AdminSettings.vue';

const router = createRouter({
    history:createWebHistory(),
    routes: [
        { 
            path:'/admin', 
            component: AdminPanel,
            children: [
                {
                    path: '/admin', 
                    component: AdminDashboard,
                    meta: { 
                        requiresAuth: true 
                    }},
                {path: '/admin/users', component: AdminUserManagement},
                {path: '/admin/products', component: AdminProduct},
                {path: '/admin/sales', component: AdminSales},
                {path: '/admin/settings', component: AdminSettings}
            ]
        },
        { 
            path:'/', 
            component: Login
        }
    ]
})
export default router;