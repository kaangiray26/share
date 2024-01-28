import { createRouter, createWebHistory } from 'vue-router';
import PageNotFound from '/components/PageNotFound.vue';
import P2PShare from '/components/P2PShare.vue';

const routes = [
    {
        path: "/",
        component: P2PShare,

    },
    {
        path: "/session/:id",
        component: P2PShare
    },
    {
        path: '/:catchAll(.*)',
        component: PageNotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router