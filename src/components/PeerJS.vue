<template>
    <div class="col align-self-center">
        <div v-show="store.connected">
            <div class="card device text-white">
                <div class="d-inline-flex justify-content-center">
                    <div class="dropdown-center">
                        <button class="btn btn-dark border border-3 rounded-circle p-2" data-bs-toggle="dropdown"
                            aria-expanded="false" @click="showOptions">
                            <img src="/assets/laptop-fill.svg" class="img-fluid m-1" width="64">
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark border border-light">
                            <li><button class="dropdown-item" @click="poke">Poke</button></li>
                            <li><button class="dropdown-item" @click="showMessageModal">Send a message</button></li>
                            <li><button class="dropdown-item" @click="showFileUpload">Send a file</button></li>
                        </ul>
                    </div>
                </div>
                <div class="card-body text-center">
                    <h5 class="card-title">{{ recipient.name }}</h5>
                </div>
            </div>
        </div>
    </div>
    <messageModal ref="thisMessageModal" @send="sendMessage"></messageModal>
    <contentModal ref="thisContentModal" :content="content"></contentModal>
    <input ref="fileUpload" type="file" @change="handleFileUpload" hidden>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '/js/store';
import { notify } from '/js/notify';

import messageModal from '/components/messageModal.vue';
import contentModal from '/components/contentModal.vue';

const emit = defineEmits(['connected', 'disconnect']);

let thisMessageModal = ref(null);
let thisContentModal = ref(null);
const fileUpload = ref(null);

const content = ref({});

const recipient = ref({
    id: null,
    name: null,
    desc: null,
});

async function poke() {
    props.conn.send({
        type: "poke",
        peer_name: props.peer_name,
    });
}

async function sendMessage() {
    props.conn.send({
        type: "message",
        message: thisMessageModal.value.get_message(),
        peer_name: props.peer_name,
    });
}

async function showMessageModal() {
    thisMessageModal.value.show();
}

async function showFileUpload() {
    fileUpload.value.click();
}

async function handleFileUpload(event) {
    console.log("Uploading file...", fileUpload.value.files[0]);
    var file = fileUpload.value.files[0];
    let reader = new FileReader();
    reader.onload = (res) => {
        console.log(res.target.result);
        props.conn.send({
            type: "file",
            file: res.target.result,
            file_name: file.name,
            peer_name: props.peer_name,
        });
    };
}

props.conn.on("data", async function (data) {
    console.log("Incoming:", data);
    if (data.type == 'helo') {
        recipient.value = {
            id: data.peer_id,
            name: data.peer_name,
            desc: data.desc,
        };
        props.conn.send({
            type: "ehlo",
            peer_id: props.peer_id,
            peer_name: props.peer_name,
            desc: props.desc,
        });
        emit('connected');
        store.connected = true;
        return;
    }

    if (data.type == 'ehlo') {
        recipient.value = {
            id: data.peer_id,
            name: data.peer_name,
            desc: data.desc,
        };
        emit('connected');
        store.connected = true;
        return;
    }

    if (data.type == 'poke') {
        notify({
            "n": "Poked by " + data.peer_name,
        });
        return;
    }

    if (data.type == 'message') {
        content.value = data;
        thisContentModal.value.show();
        return;
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
    peer_name: {
        type: String,
    }
});
</script>