<template>
    <div class="d-flex flex-column">
        <PeerJS v-if="store.init" ref="thisPeerJS" />
        <div v-if="!store.connected" id="mainCard">
            <div class="d-flex flex-column text-light">
                <h6 class="mb-2 text-center">Open <span class="fw-bold">Share</span> on
                    other devices to connect 🚀
                </h6>
                <div class="d-flex bg-light rounded">
                    <div class="d-flex flex-column flex-fill bg-light overflow-scroll rounded px-2 py-1">
                        <span class="text-muted">You are known as</span>
                        <span class="text-dark text-nowrap">{{ store.src.name }}</span>
                    </div>
                    <button id="btn-share" @click="shareLink">Share</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "/router";
import anime from 'animejs';
import PeerJS from '/components/PeerJS.vue';
import { Peer } from "peerjs";
import { notify } from '/js/notify.js';
import { store } from "/js/store.js";
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';

const thisPeerJS = ref(null);

async function shareLink() {
    navigator.clipboard.writeText(window.location + "session/" + store.src.id)
        .then(() => {
            notify({
                "n": "Copied to clipboard!",
            });
        });
}

// Peer event handlers
async function on_open() {
    if (!router.currentRoute.value.params.id) return;

    // Connect to peer
    store.conn = store.peer.connect(router.currentRoute.value.params.id, {
        reliable: true,
    });
    store.init = true;

    // Send helo
    store.conn.on("open", () => {
        store.conn.send({
            type: 'helo',
            id: store.src.id,
            name: store.src.name,
            desc: navigator.userAgent,
        });
    });
}

async function on_connection(connection) {
    store.conn = connection;
    store.init = true;
}

onMounted(() => {
    // Animations
    anime({
        targets: '#mainCard',
        opacity: [0, 1],
        translateY: [-100, 0],
        easing: 'easeOutBounce',
        duration: 750,
        delay: 200,
    });

    // Set own peer id
    store.src.id = crypto.randomUUID();
    store.peer = new Peer([store.src.id]);

    // Set own peer name
    store.src.name = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: '',
        style: 'capital',
    });

    // Set events
    store.peer.on('open', on_open);
    store.peer.on('connection', on_connection);
});
</script>