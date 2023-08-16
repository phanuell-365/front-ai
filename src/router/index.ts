import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/LoginPage.vue"),
    },
    {
        path: "/admin",
        name: "HomeAdmin",
        component: () => import("../views/HomeAdmin.vue"),
        children: [
            {
                path: "",
                name: "AdminHome",
                component: () => import("../views/Admin/Home.vue"),
            },
            {
                path: ":page",
                name: "DynamicPage",
                component: () => import("../views/Admin/DynamicPage.vue"),
                props: (route: any) => {
                    return {
                        page: route.params.page,
                    };
                }
            },
        ],
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;