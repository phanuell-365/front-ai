import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        redirect: "/admin",
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
                path: "settings",
                name: "AdminSettings",
                component: () => import("../views/Admin/SettingsPage.vue"),
                children: [
                    {
                        path: "home",
                        redirect: "admin/settings/general",
                    },
                    {
                        path: ":tab",
                        name: "AdminSettingsTab",
                        component: () => import("../views/Admin/SettingsTab.vue"),
                        props: (route: object) => {
                            return {
                                tab: route.params.tab,
                            };
                        }
                    }
                ]
            },
            {
                path: "",
                name: "AdminHome",
                component: () => import("../views/Admin/HomePage.vue"),
            },
            {
                path: ":page",
                name: "DynamicPage",
                component: () => import("../views/Admin/DynamicPage.vue"),
                props: (route: object) => {
                    return {
                        page: route.params.page,
                        pageId: route.query.pageId,
                    };
                },
            },
        ],
    },
    {
        path: "/chat",
        name: "Chat",
        component: () => import("../views/ChatPage.vue"),
        children: [
            {
                path: ":chatbotId",
                name: "ChatbotPage",
                component: () => import("../views/Chats/ChatbotPage.vue"),
                props: (route: object) => {
                    return {
                        chatbotId: route.params.chatbotId,
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
