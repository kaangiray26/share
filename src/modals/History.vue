<template>
    <div v-if="visible" class="overlay-fullscreen">
        <div class="container d-flex justify-content-center">
            <div class="history-body">
                <div class="d-flex">
                    <h5 class="text-muted">History</h5>
                    <button class="btn-close ms-auto" @click="hide"></button>
                </div>
                <ul class="list-group">
                    <li v-for="(item, index) in store.archive" class="list-group-item list-group-item-action"
                        @click="open(index)">
                        <div class="d-flex overflow-scroll">
                            <span class="text-nowrap">{{ item.type == 'message' ? item.message : item.f_name }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { store, show_content } from '/js/store.js';

const visible = ref(false);

async function show() {
    visible.value = true;
}

async function hide() {
    visible.value = false;
}

async function open(index) {
    hide();
    show_content(index);
}

defineExpose({
    show,
    hide,
});
</script>