// store.js
import { reactive } from 'vue';

async function show_content(index) {
    window.dispatchEvent(new CustomEvent('content', {
        detail: index
    }));
}

const store = reactive({
    connected: false,
    archive: [],
});

export { store, show_content }