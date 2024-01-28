<template>
    <div v-if="visible" class="overlay">
        <div class="container d-flex justify-content-center">
            <div class="toast-body">
                <span class="pe-2">{{ message }}</span>
                <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="hide"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);

defineProps({
    message: {
        type: String,
    },
});

async function show() {
    visible.value = true;
    setTimeout(() => {
        visible.value = false;
    }, 3000);
}

async function hide() {
    visible.value = false;
}

defineExpose({
    show,
    hide,
});
</script>