<template>
    <div>
        Connecting...
    </div>
    <PeerJS ref="thisPeerJS" v-if="peer_init" :key="peer_key" :peer="peer" :conn="conn" :peer_id="peer_id"></PeerJS>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';
import { Peer } from "peerjs";
import router from "/router";

import PeerJS from '/components/PeerJS.vue';

const peer = ref(null);
const conn = ref(null);
const peer_id = ref(null);
const peer_name = ref(null);

const peer_key = ref(0);
const peer_init = ref(false);
const thisPeerJS = ref(null);

async function connect(id) {
    conn.value = peer.value.connect(id);
    peer_init.value = true;

    conn.value.on("open", () => {
        conn.value.send({
            type: 'connect',
            peer_id: peer_id.value,
            peer_name: peer_name.value,
            desc: navigator.platform,
        });
    });
}

onMounted(() => {
    peer_id.value = crypto.randomUUID();
    peer_name.value = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: '',
        style: 'capital',
    });
    peer.value = new Peer([peer_id.value]);

    peer.value.on('open', () => {
        connect(router.currentRoute.value.params.id);
    });

});
</script>