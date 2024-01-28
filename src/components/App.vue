<template>
    <Toast ref="thisToast" :message="toastNotification" />
    <History ref="thisHistory" />
    <div class="window container">
        <div class="d-flex justify-content-end">
            <div class="btn-group" role="group">
                <button v-show="store.connected" type="button" class="btn btn-dark bi bi-clock-history"
                    @click="showHistory"></button>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from '/js/store.js';

import Toast from "/modals/Toast.vue";
import History from "/modals/History.vue";

let thisToast = ref(null);
const toastNotification = ref("");

let thisHistory = ref(null);

async function showHistory() {
    thisHistory.value.show();
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