<template>
    <div v-if="visible" class="overlay-centered">
        <div class="container d-flex justify-content-center h-100">
            <div class="message-body h-100">
                <div class="d-flex">
                    <h5 class="text-muted">Send a message</h5>
                    <button class="btn-close ms-auto" @click="hide"></button>
                </div>
                <textarea v-model="message" ref="message_input" type="text" class="mb-3" placeholder="Message..."
                    aria-label="message">
                    </textarea>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-dark" @click="send_message">Send</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount, nextTick } from 'vue';
import { store } from '/js/store.js';

const visible = ref(false);

const message = ref('');
const message_input = ref(null);

defineProps({
    message: {
        type: String,
    },
});

async function send_message() {
    if (!message.value.length) return;
    store.conn.send({
        type: "message",
        message: btoa(encodeURIComponent(message.value)),
    });

    hide();
}

async function handle_keypress(event) {
    // Escape
    if (event.key === "Escape") {
        hide();
    }
}

async function show() {
    message.value = ''
    visible.value = true;
    await nextTick();
    message_input.value.focus();
}

async function hide() {
    visible.value = false;
}

defineExpose({
    show,
    hide,
});

onBeforeMount(() => {
    // Key listener
    window.addEventListener("keydown", handle_keypress);
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handle_keypress);
})
</script>