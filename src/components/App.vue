<template>
    <liveToast ref="thisToast" :message="toastNotification" />
    <Archive ref="thisArchive" />
    <nav class="navbar fixed-top">
        <div class="container-fluid justify-content-end">
            <div class="btn-group" role="group">
                <a type="button" class="btn btn-dark bi bi-arrow-clockwise" href="/"></a>
                <button v-show="store.connected" type="button" class="btn btn-dark bi bi-archive-fill"
                    @click="showArchive"></button>
                <a type="button" class="btn btn-dark bi bi-github" href="https://github.com/kaangiray26/share"></a>
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

import liveToast from "/components/liveToast.vue";
import Archive from "/components/Archive.vue";

let thisToast = ref(null);
const toastNotification = ref("");

let thisArchive = ref(null);

async function showArchive() {
    thisArchive.value.show();
}

async function notify(msg) {
    toastNotification.value = msg;
    thisToast.value.show();
}

onMounted(() => {
    window.addEventListener('notify', event => {
        notify(event.detail.n);
    });
});
</script>