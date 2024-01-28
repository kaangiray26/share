<template>
    <div class="p404">
        <h1 class="fw-bold text-center">404</h1>
        <h2 class="text-center">Page not found!</h2>
        <button class="btn btn-dark d-block mx-auto mt-3" @click="goBack">Go back</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

async function goBack() {
    router.push('/');
}
</script>