<template>
    <div id="messageModal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true" ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="input-group">
                        <span class="input-group-text">></span>
                        <textarea ref="textArea" class="form-control" aria-label="Textarea"
                            placeholder="Your message..."></textarea>
                        <button class="btn btn-dark" @click="emit('send'); hide()">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const emit = defineEmits(['send']);
const textArea = ref(null);

let modalEle = ref(null);
let thisModalObj = null;

function show() {
    textArea.value.value = '';
    thisModalObj.show();
}

function hide() {
    thisModalObj.hide();
}

function get_message() {
    return textArea.value.value;
}

defineExpose({
    show,
    get_message,
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
    window.addEventListener('shown.bs.modal', event => {
        textArea.value.focus();
    });
});
</script>