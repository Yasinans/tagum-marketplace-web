<script setup>
import { ChartBarSquareIcon, UsersIcon, Cog8ToothIcon, ArchiveBoxArrowDownIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue'

const currentPage = ref('dashboard'); 

function changePage(page){
    currentPage.value = page; 
}
</script>

<!--Admin NavBar! Implement separate mavbar typesht-->
<template>
    <div class="navbar">
        <div class="w-full h-[71px]  shrink-0  mb-8"></div>
        <div class="nav-title mr-20 font-bold text-sm pb-2">MAIN MENU</div>
        <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='dashboard'}">
            <router-link @click="changePage('dashboard')" class="nav-item-title" to="/"><chart-bar-square-icon class="icon"/>Dashboard</router-link>
        </div>
        <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='users'}">
            <router-link @click="changePage('users')"  class="nav-item-title" to="/users"><users-icon class="icon"/>User Management</router-link>
        </div>
        <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='product'}">
            <router-link  @click="changePage('product')" class="nav-item-title" to="/products"><archive-box-arrow-down-icon class="icon"/>Product & Inventory</router-link>
        </div>
        <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='sales'}">
            <router-link  @click="changePage('sales')" class="nav-item-title" to="/sales"><chart-bar-square-icon class="icon"/>Sales & Orders</router-link>
        </div>
        <div class="nav-item" v-bind:class="{'nav-item-selected':currentPage==='settings'}">
            <router-link  @click="changePage('settings')" class="nav-item-title" to="/settings"><cog8-tooth-icon class="icon"/>Settings</router-link>
        </div>
    </div>
</template>

<style scoped>

.icon{
    margin-right:16px;
    width: 16px;
    height: 16px;
}
.navbar{
    overflow:hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height:100%;
    width:220px;
    box-sizing: border-box;
}

.navbar::-webkit-scrollbar {
  display: none;
}

.nav-item-selected {
    box-sizing: border-box;
    border-radius: 15px 0px 0px 15px;
    border-right: 3px solid #FFAD68;
    background: #3F2E2E;
}

.nav-item:not(.nav-item-selected):hover{
    box-sizing: border-box;
    border-radius: 15px 0px 0px 15px;
    background: #5f4444;
}

.nav-item {
    flex-shrink: 0;
    margin:0;
    width:190px;
    height:45px;
    align-self: self-end;
    align-content: center;
    margin-bottom:7px;
    transition: all 100ms ease-in-out;
}
.nav-item-title {
    padding:14px 0 0 20px;
    height:100%;
    width:100%;
    display: inline-flex;
    text-decoration: none;
    color: #F1E6E6;
    font-size: 14px;
    font-weight: 400;
}

.nav-title {
    color:rgba(255, 255, 255, 0.61);
}
</style>