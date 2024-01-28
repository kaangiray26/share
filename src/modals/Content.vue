<template>
    <div v-if="visible" class="overlay-centered">
        <div class="container d-flex justify-content-center">
            <div class="content-body">
                <div class="d-flex mb-3">
                    <h5 class="text-muted">{{ store.dest.name }}</h5>
                    <button class="btn-close ms-auto" @click="hide"></button>
                </div>
                <div v-if="data.type == 'message'" class="d-flex flex-column flex-fill">
                    <textarea v-model="data.message" readonly></textarea>
                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-dark" @click="copy_message">Copy</button>
                    </div>
                </div>
                <div v-if="data.type == 'file'" class="d-flex flex-column flex-fill">
                    <div v-if="preview" class="d-flex flex-fill rounded">
                        <img v-if="data.f_type.startsWith('image')" :src="data.f_data" class="img-fluid img-content">
                        <video v-if="data.f_type.startsWith('video')" :src="data.f_data" class="img-fluid" controls />
                        <audio v-if="data.f_type.startsWith('audio')" :src="data.f_data" class="img-fluid" controls />
                    </div>
                    <div v-if="!preview">
                        <div class="input-group">
                            <span class="input-group-text bi bi-file-earmark-arrow-down" id="basic-addon1"></span>
                            <input type="text" class="form-control text-muted" :value="data.f_name"
                                aria-describedby="basic-addon1" readonly>
                        </div>
                        <div class="input-group">
                            <span class="input-group-text bi-hdd" id="basic-addon1"></span>
                            <input type="text" class="form-control text-muted" :value="formatSize(data.size)"
                                aria-describedby="basic-addon1" readonly>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-dark" @click="saveFile">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <a ref="downloadLink" href="" download="" hidden></a>
</template>

<script setup>
import { ref } from 'vue';
import { notify } from '/js/notify.js';
import { store } from '/js/store.js';

const message = ref('');
const visible = ref(false);
const downloadLink = ref(null);

const data = ref({
    type: null,
    size: null,
    f_type: null,
    f_name: null,
    f_data: null,
    message: null,
});

const preview = ref(false);

async function copy_message() {
    navigator.clipboard.writeText(message.value)
        .then(() => {
            notify({
                "n": "Copied to clipboard!",
            });
        });
}

async function saveFile() {
    downloadLink.value.download = data.value.f_name;
    downloadLink.value.href = data.value.f_data;
    downloadLink.value.click();
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

async function show() {
    // Set data
    data.value = store.archive[0];

    // Set preview
    if (data.value.type == 'file') {
        preview.value = ['image', 'video', 'audio'].some(item => data.value.f_type.startsWith(item));
    }

    visible.value = true;
}

async function hide() {
    visible.value = false;
}

defineExpose({
    show,
    hide,
});
</script>