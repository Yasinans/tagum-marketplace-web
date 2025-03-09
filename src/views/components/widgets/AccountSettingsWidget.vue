<script setup lang="ts">
import { ref } from 'vue';
import { getUsername } from '../../../utils/authUtil';
import axios, { AxiosError } from "axios";
const userAccountForm = ref({
    "username": getUsername(),
    "password": "",
});
const message = ref("");
const updateAccount = async () => {
try {
    const api = axios.create({
        baseURL: "http://localhost:3000/api/auth",
    });
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    const response = await api.put('/', userAccountForm.value);
    if (response.status == 200){
        message.value = "Account updated successfully";
        //log out
    }
} catch (err: AxiosError | any) {
    message.value = err.response?.data?.error
}

}
</script>

<template>
    <div class="tg-widget max-w-[400px]">
        <div class="tg-widget-h">
            <div>
                Account Settings
            </div>
        </div>
        <div class="flex flex-col">
            <fieldset class="fieldset">
                <legend class="fieldset-legend text-white">Username:</legend>
                <input v-model="userAccountForm.username" id="username" type="text" class="input h-8 w-full text-black">
            </fieldset>
            <fieldset class="fieldset">
                <legend class="fieldset-legend text-white">Password:</legend>
                <input v-model="userAccountForm.password" id="password" type="text" class="input h-8 w-full text-black">
            </fieldset>
            <p class="text-center mt-2" :class="{'text-green-500': message && !message.includes('Error'), 'text-red-500': message && message.includes('Error')}">{{ message }}</p>
            
            <button class="btn btn-neutral mt-4" @click="updateAccount()">Update Account</button>

        </div>
    </div>
</template>

<style lang="css" scoped></style>
