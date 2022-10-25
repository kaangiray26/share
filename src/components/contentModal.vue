<template>
    <div id="contentModal" class="modal" role="dialog" tabindex="-1" aria-hidden="true" ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body pt-1 pb-2">
                    <div class="d-flex justify-content-start my-2">
                        <h4 class="text-muted">Sent by <span class="fw-bolder">{{
                                props.content.peer_name
                        }}</span>
                        </h4>
                    </div>
                    <div v-if="props.content.type == 'message'">
                        <div class="border border-dark bg-light rounded text-wrap text-break p-2 mb-2">
                            <span class="fw-semibold">{{ props.content.message }}</span>
                        </div>
                        <div class="d-flex justify-content-end my-2">
                            <button type="button" class="btn btn-outline-dark fw-bold me-1" data-bs-dismiss="modal"
                                aria-label="Close">Ignore</button>
                            <button class="btn btn-outline-dark fw-bold ms-1" @click="copyMessage">Copy</button>
                        </div>
                    </div>
                    <div v-if="props.content.type == 'file'" class="d-flex flex-column justify-content-center">
                        <div class="input-group mb-1">
                            <span class="input-group-text bi bi-file-earmark-arrow-down" id="basic-addon1"></span>
                            <input type="text" class="form-control text-muted" :value="props.content.f_name"
                                aria-describedby="basic-addon1" readonly>
                        </div>
                        <div class="input-group mb-2">
                            <span class="input-group-text bi-hdd" id="basic-addon1"></span>
                            <input type="text" class="form-control text-muted" :value="formatSize(props.content.size)"
                                aria-describedby="basic-addon1" readonly>
                        </div>
                        <img v-show="props.content.f_type.startsWith('image')" :src="props.content.f_data"
                            class="img-fluid rounded">
                        <video v-show="props.content.f_type.startsWith('video')" :src="props.content.f_data"
                            class="rounded" controls />
                        <audio v-show="props.content.f_type.startsWith('audio')" :src="props.content.f_data"
                            class="rounded" controls />
                        <div class="d-flex justify-content-end my-2">
                            <button type="button" class="btn btn-outline-dark fw-bold me-1" data-bs-dismiss="modal"
                                aria-label="Close">Ignore</button>
                            <button class="btn btn-outline-dark fw-bold ms-1" @click="saveFile">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <a ref="downloadLink" href="" download="" hidden></a>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { notify } from '/js/notify.js';

const downloadLink = ref(null);

let modalEle = ref(null);
let thisModalObj = null;

async function saveFile() {
    downloadLink.value.download = props.content.f_name;
    downloadLink.value.href = props.content.f_data;
    downloadLink.value.click();
}

function show() {
    thisModalObj.show();
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

async function copyMessage() {
    navigator.clipboard.writeText(props.content.message).then(function () {
        notify({
            "n": "Copied to clipboard!",
        });
    }, function (err) {
        notify({
            "n": "Failed to copy to clipboard!",
        });
    });
}

defineExpose({
    show,
});

const props = defineProps({
    content: {
        type: Object,
    },
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
});
</script>