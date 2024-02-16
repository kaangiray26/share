<template>
    <div v-if="loading" class="d-flex flex-column flex-fill bg-light rounded p-3 mb-3">
        <h5 class="text-muted text-capitalize">{{ state }}...</h5>
        <div class="d-flex">
            <span class="text-muted">Chunks: {{ store.progress.loaded }} / {{ store.progress.total }}</span>
        </div>
        <div v-if="state == 'downloading'" class="d-flex flex-column">
            <span class="text-muted">Elapsed:{{ getElapsed() }}</span>
        </div>
        <div class="d-flex">
            <span class="text-muted">Size: {{ formatSize(store.progress.size) }}</span>
        </div>
        <div class="progress flex-fill" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
            aria-valuemax="100">
            <div class="progress-bar" :class="background"
                :style="{ width: store.progress.loaded / store.progress.total * 100 + '%' }"></div>
        </div>
    </div>
    <input ref="fileUpload" type="file" @change="handleFileUpload" hidden>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '/js/store';
import { notify } from '/js/notify';
import { v4 as uuidv4 } from 'uuid';

const state = ref('');
const background = ref('bg-primary');

const loading = ref(false);
const fileUpload = ref(null);

async function hide() {
    loading.value = false;
}

async function upload() {
    fileUpload.value.click();
}

async function download() {
    state.value = "downloading";
    loading.value = true;
}

function getElapsed() {
    let elapsed = Math.floor((Date.now() - store.progress.start) / 1000);
    if (elapsed < 60) {
        return elapsed + "s";
    } else if (elapsed < 3600) {
        return Math.floor(elapsed / 60) + "m";
    } else {
        return Math.floor(elapsed / 3600) + "h";
    }
}

function formatSize(size) {
    if (size < 1024) {
        return size + " B";
    } else if (size < 1024 ** 2) {
        return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1024 ** 3) {
        return (size / (1024 ** 2)).toFixed(2) + " MB";
    } else {
        return (size / (1024 ** 3)).toFixed(2) + " GB";
    }
}

async function send_chunk(chunk, uuid, num) {
    store.conn.send({
        type: "file_chunk",
        uuid: uuid,
        chunk: chunk,
        chunk_num: num,
    });

}

async function handleFileUpload(event) {
    store.progress.loaded = 0;
    store.progress.size = fileUpload.value.files[0].size;
    store.progress.total = Math.ceil(store.progress.size / (1024 * 512));
    state.value = "uploading";
    loading.value = true;

    let reader = new FileReader();

    reader.onload = async (res) => {
        // Set chunk size to 512KB
        let chunk_size = 1024 * 512;
        let chunks_len = Math.ceil(fileUpload.value.files[0].size / chunk_size);
        store.progress.total = chunks_len;

        // Generate random uuid
        let uuid = uuidv4();

        // Notify the receiver
        store.conn.send({
            type: "incoming_file",
            uuid: uuid,
            chunks_len: chunks_len,
            size: fileUpload.value.files[0].size,
            f_name: fileUpload.value.files[0].name,
            f_type: fileUpload.value.files[0].type,
        });

        // Send chunks one by one with a delay
        for (let i = 0; i < chunks_len; i++) {
            let chunk = res.target.result.slice(i * chunk_size, (i + 1) * chunk_size);
            send_chunk(chunk, uuid, i);
            await new Promise(r => setTimeout(r, 25));
            store.progress.loaded = i + 1;
        }

        notify({
            "n": "File sent!",
        }).then(hide);
    };

    reader.readAsArrayBuffer(fileUpload.value.files[0]);
}

defineExpose({
    upload,
    download,
    hide
});
</script>