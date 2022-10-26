<template>
    <div class="col align-self-center">
        <div v-show="store.connected">
            <div class="card device text-white">
                <div class="d-inline-flex justify-content-center">
                    <div class="dropdown-center">
                        <button class="btn btn-dark border border-3 rounded-circle p-2" data-bs-toggle="dropdown"
                            aria-expanded="false" @click="showOptions">
                            <img :src="deviceImage" class="img-fluid m-1" width="64">
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
    <messageModal ref="thisMessageModal" @send="sendMessage" />
    <contentModal ref="thisContentModal" :content="content" />
    <incomingFile ref="thisIncomingFileModal" />
    <input ref="fileUpload" type="file" @change="handleFileUpload" hidden>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { store } from '/js/store';
import { notify } from '/js/notify';

import messageModal from '/components/messageModal.vue';
import contentModal from '/components/contentModal.vue';
import incomingFile from '/components/incomingFile.vue';

const emit = defineEmits(['connected', 'disconnect']);

let thisMessageModal = ref(null);
let thisContentModal = ref(null);
let thisIncomingFileModal = ref(null);

const fileUpload = ref(null);

const content = ref({});

const recipient = ref({
    id: '',
    name: '',
    desc: '',
});

const bitrate = ref(1);

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
    notify({
        "n": "Sending file...",
    });
    props.conn.send({
        type: "incoming_file",
        f_name: fileUpload.value.files[0].name,
        size: fileUpload.value.files[0].size,
    });
    let reader = new FileReader();
    reader.onload = function (res) {
        props.conn.send({
            type: "file",
            peer_name: props.peer_name,
            size: fileUpload.value.files[0].size,
            f_type: fileUpload.value.files[0].type,
            f_name: fileUpload.value.files[0].name,
            f_data: res.target.result,
        });
        notify({
            "n": "File sent.",
        });
    };
    reader.readAsDataURL(fileUpload.value.files[0]);
}

const deviceImage = computed(() => {
    if (recipient.value.desc.toLowerCase().includes('mobile')) {
        return '/images/phone-fill.png';
    }
    return '/images/laptop-fill.png';
});

props.conn.on("data", async function (data) {
    let now = Date.now();
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
            desc: navigator.userAgent,
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
        store.archive.unshift(data);
        content.value = data;
        thisContentModal.value.show();
        return;
    }

    if (data.type == 'file') {
        store.archive.unshift(data);
        content.value = data;
        thisIncomingFileModal.value.hide();
        thisContentModal.value.show();
        return;
    }

    if (data.type == 'incoming_file') {
        thisIncomingFileModal.value.show(
            data.f_name,
            data.size,
            Date.now(),
        );
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

onMounted(() => {
    window.addEventListener('content', event => {
        content.value = store.archive[event.detail];
        thisContentModal.value.show();
    });
});
</script>