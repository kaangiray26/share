<template>
    <div id="liveToast" class="toast-container position-fixed top-0 start-50 translate-middle-x mt-2">
        <div ref="toastEle" class="toast border border-light rounded shadow-lg" role="alert" aria-live="assertive"
            aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    {{ message }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Toast } from 'bootstrap';

let toastEle = ref(null);
let thisToastObj = null;

onMounted(() => {
    thisToastObj = new Toast(toastEle.value, {
        delay: 3000,
    });
});

function _show() {
    thisToastObj.show();
}

function _hide() {
    thisToastObj.hide();
}

defineProps({
    message: {
        type: String,
    },
});

defineExpose({
    show: _show,
    hide: _hide,
});
</script>