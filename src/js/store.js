// store.js
import { reactive } from 'vue';

async function show_content(index) {
    window.dispatchEvent(new CustomEvent('content', {
        detail: index
    }));
}

const store = reactive({
    src: {
        id: null,
        name: null,
    },
    dest: {
        id: null,
        name: null
    },
    peer: null,
    conn: null,
    archive: [],
    connected: false,
    init: false,
    chunks: {},
    progress: {
        size: 0,
        total: 0,
        start: 0,
        loaded: 0,
        bitrate: 0,
        timestamp: 0,
    },
});

export { store, show_content }