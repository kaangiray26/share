import { createRouter, createWebHistory } from 'vue-router';
import NavBar from '/components/NavBar.vue';
import Session from '/views/Session.vue';
import PageNotFound from '/components/PageNotFound.vue';

const routes = [
    {
        path: "/",
        component: NavBar,

    },
    {
        path: "/session/:id",
        component: Session
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