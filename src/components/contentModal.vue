<template>
    <div id="contentModal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true" ref="modalEle">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex justify-content-center">
                    <h6 class="modal-title">Message from <span class="fw-bolder">{{ props.content.peer_name }}</span>
                    </h6>
                </div>
                <div class="modal-body">
                    <div v-show="props.content.type == 'message'">
                        <p>
                            {{ props.content.message }}
                        </p>
                    </div>
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

function show(obj) {
    thisModalObj.show();
}

defineExpose({
    show,
});

const props = defineProps({
    content: {
        type: Object,
    },
});

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
});
</script>