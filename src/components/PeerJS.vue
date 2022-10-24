<template>
    <div v-show="status == 'connected'">
        <div clas="card">
            <div class="card-body">
                Connected with {{ recipient.desc }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { notify } from "/js/notify.js";

const status = ref("disconnected");

const recipient = ref({
    id: null,
    desc: null,
});

props.conn.on("data", async function (data) {
    console.log("Incoming:", data);
    if (data.type == 'connect') {
        recipient.value = {
            id: data.peer_id,
            desc: data.desc,
        };
        status.value = "connected";
    }
});

const props = defineProps({
    peer: {
        type: Object,
    },
    conn: {
        type: Object,
    },
    peer_id: {
        type: String,
    },
});

defineExpose({
    status,
    recipient,
});
</script>