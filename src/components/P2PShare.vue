<template>
    <div class="row row-cols-1 gx-0 gy-2 h-100 mx-1 px-0 justify-content-center">
        <PeerJS ref="thisPeerJS" v-if="peer_init" :key="peer_key" :peer="peer" :conn="conn" :peer_id="peer_id"
            :peer_name="peer_name" />
        <div class="col-auto align-self-end">
            <div id="mainCard" class="card shadow-lg mb-1">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted text-center">Open <span
                            class="font-monospace fw-bold">Share</span> on other devices to connect 🚀
                    </h6>
                    <div class="input-group d-flex justify-content-center">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="floatingInputGroup2" :value="peer_name"
                                readonly>
                            <label for="floatingInputGroup2">You are known as:</label>
                        </div>
                        <button class="btn btn-primary fw-bold" @click="shareLink">Share</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "/router";
import { Peer } from "peerjs";
import anime from 'animejs';
import { notify } from '/js/notify.js';
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';

import PeerJS from '/components/PeerJS.vue';

const peer = ref(null);
const conn = ref(null);
const peer_id = ref(null);
const peer_name = ref(null);

const peer_key = ref(0);
const peer_init = ref(false);

const thisPeerJS = ref(null);

async function shareLink() {
    navigator.clipboard.writeText("https://share.buzl.uk/session/" + peer_id.value).then(function () {
        notify({
            "n": "Copied to clipboard!",
        });
    }, function (err) {
        notify({
            "n": "Failed to copy to clipboard!",
        });
    });
}

async function connect(id) {
    conn.value = peer.value.connect(id);
    peer_init.value = true;

    conn.value.on("open", () => {
        conn.value.send({
            type: 'helo',
            peer_id: peer_id.value,
            peer_name: peer_name.value,
            desc: navigator.platform,
        });
    });
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
    peer_name.value = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: '',
        style: 'capital',
    });
    peer.value = new Peer([peer_id.value]);

    peer.value.on('open', () => {
        if (router.currentRoute.value.params.hasOwnProperty('id')) {
            connect(router.currentRoute.value.params.id);
        }
    })

    peer.value.on('connection', connection => {
        conn.value = connection;
        peer_init.value = true;
    });
});
</script>