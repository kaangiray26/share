<template>
    <P2PShare ref="thisP2PShare" :key="p2p_key"></P2PShare>
</template>

<script setup>
import { ref } from 'vue';

import P2PShare from '/components/P2PShare.vue';

const thisP2PShare = ref(null);

const p2p_key = ref(0);
</script>