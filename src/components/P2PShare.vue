<template>
    <PeerJS ref="thisPeerJS" v-if="peer_init" :key="peer_key" :peer="peer" :conn="conn" :peer_id="peer_id"></PeerJS>
    <div id="mainCard" class="card shadow-lg m-2">
        <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted text-center">Open <span class="font-monospace fw-bold">Share</span>
                on other devices
                to connect 🚀
            </h6>
            <p class="card-text text-white">Some quick example text to build on the card title and make up the bulk of
                the card's content.
            </p>
            <div class="input-group d-flex justify-content-center">
                <div class="form-floating">
                    <input type="text" class="form-control" id="floatingInputGroup2" :value="peer_id" readonly>
                    <label for="floatingInputGroup2">You are known as:</label>
                </div>
                <button class="btn btn-primary fw-bold" @click="shareLink">Share</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { store } from '/js/store.js';
import { Peer } from "peerjs";
import anime from 'animejs';

import PeerJS from '/components/PeerJS.vue';

const peer = ref(null);
const conn = ref(null);
const peer_id = ref(null);

const peer_key = ref(0);
const peer_init = ref(false);
const thisPeerJS = ref(null);

async function shareLink() {
    navigator.clipboard.writeText("http://localhost:8000/session/" + peer_id.value);
}

onMounted(() => {
    anime({
        targets: '#mainCard',
        opacity: [0, 1],
        translateY: [-100, 0],
        easing: 'easeOutBounce',
        duration: 750,
        delay: 200,
    });

    peer_id.value = crypto.randomUUID();
    peer.value = new Peer([peer_id.value]);

    peer.value.on('connection', connection => {
        conn.value = connection;
        peer_init.value = true;
    });
});
</script>