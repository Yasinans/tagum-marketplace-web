<script setup>
import { UserIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue'

</script>
<template>
    <div class="header">
        <div class="current-user"><p>Logged in as</p><p>Admin</p></div>
        <div class="account-op">
           <arrow-right-circle-icon class="icon"/>
        </div>
    </div>
</template>

<style scoped>
.icon{
    color:#3f0b0b;
    padding-left:15px;
    height: 20px;
}

.icon:hover{
    color: #2b0707;
    cursor:pointer;
}
.account-op{
    align-items: center;
    margin: 0 18px 0 20px;
    height:70%;
    border-left: 1px solid rgba(71, 57, 57, 0.57);
    display: inline-flex;
}
.current-user{
    display: inline-flex;
    text-wrap:nowrap;
    color: #4E2B2B;
    font-size: 14px;
}
.current-user > p:nth-of-type(1){
    font-weight: 300;
}

.current-user > p:nth-of-type(2){
    margin-left:4px;
    font-weight: 600;
}

.header{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height:71px;
    background-color: #967D7D;
}
</style>