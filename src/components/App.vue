<template>
    <liveToast ref="thisToast" :message="toastNotification"></liveToast>
    <nav class="navbar fixed-top">
        <div class="container-fluid justify-content-end">
            <div class="btn-group" role="group">
                <a type="button" class="btn btn-outline-dark bi bi-house-door-fill" href="/"></a>
                <button v-show="store.connected" type="button" class="btn btn-outline-dark bi bi-archive-fill"></button>
                <a type="button" class="btn btn-outline-dark bi bi-github"
                    href="https://github.com/kaangiray26/share"></a>
            </div>
        </div>
    </nav>
    <div class="container-fluid d-flex justify-content-center align-items-end h-100 w-100 m-0 p-0">
        <RouterView />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from '/js/store.js';
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