<template>
    <div ref="modalEle" class="modal fade" id="peerModal" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered row h-100 w-100">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title" id="staticBackdropLabel">{{ recipient.id }}</h1>
                </div>
                <div class="modal-body">
                    <div class="dropdown-center d-flex justify-content-center">
                        <button class="btn btn-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {{ recipient.desc }}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark">
                            <li><button class="dropdown-item" @click="poke">Poke</button></li>
                            <li><button class="dropdown-item" @click="sendMessage">Send message</button></li>
                            <li><button class="dropdown-item" @click="sendFile">Send file</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { store } from '/js/store.js';

import { Modal } from 'bootstrap'

let modalEle = ref(null);
let thisModalObj = null;

const status = ref("disconnected");

const recipient = ref({
    id: null,
    desc: null,
});

async function poke() {
    //
}

async function sendMessage() {
    //
}

async function sendFile() {
    //
}

props.conn.on("data", async function (data) {
    console.log("Incoming:", data);
    if (data.type == 'connect') {
        recipient.value = {
            id: data.peer_id,
            desc: data.desc,
        };
        store.connected = true;
        thisModalObj.toggle();
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

onMounted(() => {
    thisModalObj = new Modal(modalEle.value, {
        keyboard: false
    });
})
</script>