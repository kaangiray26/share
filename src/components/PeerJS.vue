<template>
    <div v-if="store.connected">
        <Progress ref="thisProgressModal" />
        <div class="card device text-white">
            <div class="d-inline-flex justify-content-center">
                <div class="dropdown-center">
                    <button class="btn btn-dark border border-3 rounded-circle p-2" data-bs-toggle="dropdown"
                        aria-expanded="false" @click="showOptions">
                        <img :src="deviceImage" class="img-fluid m-1" width="64">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-dark p-1 my-2">
                        <li><button class="dropdown-item" @click="poke">Poke</button></li>
                        <li><button class="dropdown-item" @click="showMessageModal">Send a message</button></li>
                        <li><button class="dropdown-item" @click="showFileUpload">Send a file</button></li>
                    </ul>
                </div>
            </div>
            <div class="card-body text-center">
                <h5 class="card-title">{{ store.dest.name }}</h5>
            </div>
        </div>
    </div>
    <Message ref="thisMessageModal" />
    <Content ref="thisContentModal" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import router from '/router';
import { Dropdown } from 'bootstrap';
import { store } from '/js/store';
import { notify } from '/js/notify';

import Content from '../modals/Content.vue';
import Message from '../modals/Message.vue';
import Progress from '../modals/Progress.vue';

const emit = defineEmits(['connected', 'disconnect']);

const thisMessageModal = ref(null);
const thisContentModal = ref(null);
const thisProgressModal = ref(null);

const content = ref({});

const recipient = ref({
    name: '',
    desc: '',
});

async function poke() {
    store.conn.send({
        type: "poke",
    });
}

async function showMessageModal() {
    thisMessageModal.value.show();
}

async function showFileUpload() {
    thisProgressModal.value.upload();
}

const deviceImage = computed(() => {
    if (recipient.value.desc.toLowerCase().includes('mobile')) {
        return '/images/phone-fill.png';
    }
    return '/images/laptop-fill.png';
});

onMounted(() => {
    window.addEventListener('content', event => {
        content.value = store.archive[event.detail];
        thisContentModal.value.show();
    });

    // Set peer events
    store.conn.on("data", async function (data) {
        if (data.type == 'helo') {
            // Set dest fields
            store.dest.id = data.id;
            store.dest.name = data.name;

            // Send response
            store.conn.send({
                type: "ehlo",
                id: store.src.id,
                name: store.src.name,
                desc: navigator.userAgent,
            });

            emit('connected');
            store.connected = true;
            return;
        }

        if (data.type == 'ehlo') {
            // Set dest fields
            store.dest.id = data.id;
            store.dest.name = data.name;

            emit('connected');
            store.connected = true;
            return;
        }

        if (data.type == 'poke') {
            notify({
                "n": "You've been poked!",
            });
            return;
        }

        if (data.type == 'message') {
            data.message = decodeURIComponent(atob(data.message));
            store.archive.unshift(data);
            thisContentModal.value.show();
            return;
        }

        if (data.type == 'incoming_file') {
            store.chunks[data.uuid] = {
                "f_name": data.f_name,
                "f_type": data.f_type,
                "size": data.size,
                "chunks_len": data.chunks_len,
                "byteLength": data.byteLength,
                "chunks": []
            }

            // Reset progress
            store.progress = {
                size: 0,
                total: 0,
                start: 0,
                loaded: 0,
                bitrate: 0,
                timestamp: 0,
            }

            store.progress.start = new Date().getTime();
            store.progress.size = store.chunks[data.uuid].size;
            store.progress.total = store.chunks[data.uuid].chunks_len;
            thisProgressModal.value.download();
            return
        }

        if (data.type == 'file_chunk') {
            store.chunks[data.uuid].chunks.push(data.chunk);
            store.progress.loaded = store.chunks[data.uuid].chunks.length;

            // Check if all chunks have been received
            if (store.chunks[data.uuid].chunks.length == store.chunks[data.uuid].chunks_len) {
                thisProgressModal.value.hide();

                // Sort chunks
                store.chunks[data.uuid].chunks.sort((a, b) => {
                    return a.chunk_num - b.chunk_num;
                });

                // Combine chunks arrays and form file
                let blob = new Blob(store.chunks[data.uuid].chunks, { type: store.chunks[data.uuid].f_type });
                let f_data = URL.createObjectURL(blob);

                // Add file to archive
                store.archive.unshift({
                    "type": "file",
                    "f_data": f_data,
                    "size": store.chunks[data.uuid].size,
                    "f_name": store.chunks[data.uuid].f_name,
                    "f_type": store.chunks[data.uuid].f_type,
                });
                thisContentModal.value.show();
            }
        }
    });

    store.conn.on('close', () => {
        window.location.href = '/';
    });
});
</script>