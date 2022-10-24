<template>
    <div class="container-fluid d-flex justify-content-center align-items-end h-100 w-100 m-0 p-0">
        <RouterView></RouterView>
        <liveToast ref="thisToast" :message="toastNotification"></liveToast>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import router from "/router";

import liveToast from "/components/liveToast.vue";

let thisToast = ref(null);
const toastNotification = ref("");

async function notify(msg) {
    console.log("Got event!");
    toastNotification.value = msg;
    thisToast.value.show();
}

onMounted(() => {
    window.addEventListener('notify', event => {
        notify(event.detail.n);
    });
});
</script>