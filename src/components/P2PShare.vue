<template>
    <div class="input-group d-flex justify-content-center">
        <div class="form-floating">
            <input type="text" class="form-control" id="floatingInputGroup2" :value="peer_id" readonly>
            <label for="floatingInputGroup2">You are known as:</label>
        </div>

        <button class="btn btn-primary" @click="shareLink">Share</button>
    </div>
    <PeerJS ref="thisPeerJS" v-if="peer_init" :key="peer_key" :peer="peer" :conn="conn" :peer_id="peer_id"></PeerJS>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Peer } from "peerjs";
import { notify } from '/js/notify.js';

import PeerJS from '/components/PeerJS.vue';

const peer = ref(null);
const conn = ref(null);
const peer_id = ref(null);

const peer_key = ref(0);
const peer_init = ref(false);
const thisPeerJS = ref(null);

async function shareLink() {
    navigator.clipboard.writeText("http://localhost:8000/session/" + peer_id.value).then(function () {
        notify({ "n": "Link copied." });
    }, function (err) {
        notify({ "n": "Link could not be copied!" });
    });
}

onMounted(() => {
    peer_id.value = crypto.randomUUID();
    peer.value = new Peer([peer_id.value]);

    peer.value.on('connection', connection => {
        conn.value = connection;
        peer_init.value = true;
    });
});
</script>