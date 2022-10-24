// store.js
import { reactive } from 'vue';

const store = reactive({
    connected: false,
    archive: [],
});

export { store }