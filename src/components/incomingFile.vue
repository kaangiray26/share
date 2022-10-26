<template>
    <div id="incomingFileModal" class="modal show" role="dialog" tabindex="-1" aria-hidden="true" ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body d-flex flex-column justify-content-center">
                    <div class="input-group mb-1">
                        <span class="input-group-text bi bi-file-earmark-arrow-down" id="basic-addon1"></span>
                        <input type="text" class="form-control text-muted" :value="filename"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                    <div class="input-group mb-1">
                        <span class="input-group-text bi-hdd" id="basic-addon1"></span>
                        <input type="text" class="form-control text-muted" :value="formatSize(size)"
                            aria-describedby="basic-addon1" readonly>
                    </div>
                    <button class="btn btn-primary" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

let modalEle = ref(null);
let thisModalObj = null;

const filename = ref('');
const size = ref(0);
const start = ref(0);
const remaining = ref(0);

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

function show(f_name, f_size) {
    filename.value = f_name,
        size.value = f_size,
        thisModalObj.show();
}

function hide() {
    thisModalObj.hide();
}

defineExpose({
    show,
    hide,
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value, {
        backdrop: 'static',
        keyboard: false,
    });
});
</script>