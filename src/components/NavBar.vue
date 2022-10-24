<template>
    <div id="mainCard" class="card shadow-lg m-2">
        <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted text-center">Open <span class="font-monospace fw-bold">Share</span>
                on other devices
                to connect 🚀
            </h6>
            <p class="card-text text-white">Some quick example text to build on the card title and make up the bulk
                of the
                card's content.</p>
            <P2PShare ref="thisP2PShare" :key="p2p_key" v-if="p2p_init"></P2PShare>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import anime from 'animejs';

import P2PShare from '/components/P2PShare.vue';

const p2p_key = ref(0);
const p2p_init = ref(false);

let thisP2PShare = ref(null);

onMounted(() => {
    p2p_init.value = true;
    anime({
        targets: '#mainCard',
        opacity: [0, 1],
        translateY: [-100, 0],
        easing: 'easeOutBounce',
        duration: 750,
        delay: 200,
    });
});
</script>