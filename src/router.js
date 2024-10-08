import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import SignInPage from './pages/SignInPage.vue';
import SignUpPage from './pages/SignUpPage.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/signin', name: 'SignIn', component: SignInPage },
    { path: '/signup', name: 'SignUp', component: SignUpPage }, // Add the signup page route
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
