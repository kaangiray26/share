<template>
    <div class="modal fade" id="archiveModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="modalEle">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-white" id="exampleModalLabel">History</h1>
                    <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-group">
                        <button v-for="(item, index) in store.archive" :index="index" type="button"
                            class="list-group-item list-group-item-action" @click="show_content(index)">{{
        item.type ==
            'message' ? item.message : item.f_name
                            }}</button>
                    </ul>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store, show_content } from '/js/store.js';
import { Modal } from 'bootstrap';

let modalEle = ref(null);
let thisModalObj = null;

function show() {
    thisModalObj.show();
}

defineExpose({
    show,
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
});
</script>