import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "../stores/auth.ts";

const routes = [
    {
        path: "/",
        name: "Home",
        redirect: "/admin",
    },
    {
        path: "/auth",
        name: "auth",
        component: () => import("../views/Auth/RootPage.vue"),
        children: [
            {
                path: "signup",
                name: "Signup",
                component: () => import("../views/Auth/SignupPage.vue"),
            },
            {
                path: "admin/login",
                name: "admin-login",
                component: () => import("../views/Auth/AdminLoginPage.vue"),
            },
            {
                path: "users/login",
                name: "user-login",
                component: () => import("../views/Auth/UserLoginPage.vue"),
            },
            {
                path: "forgot-password",
                name: "ForgotPassword",
                component: () => import("../views/Auth/ForgotPasswordPage.vue"),
            },
            {
                path: "reset-password",
                name: "ResetPassword",
                component: () => import("../views/Auth/ResetPasswordPage.vue"),
            },
        ],
    },
    {
        path: "/admin",
        name: "HomeAdmin",
        component: () => import("../views/HomeAdmin.vue"),
        children: [
            {
                path: "pages",
                name: "AdminPages",
                component: () => import("../views/Admin/PagesPage.vue"),
            },
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
                        props: (route: any) => {
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
                props: (route: any) => {
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
                props: (route: any) => {
                    return {
                        chatbotId: route.params.chatbotId,
                    };
                }
            },
        ],
    },
    // all
    {
        path: "/:notFound(.*)*",
        name: "not-found",
        component: () => import("../views/errors/NotFound.vue"),
    },
] as any[];

const router = createRouter({
    history: createWebHistory(),
    // @ts-ignore
    base: process.env.VITE_APP_BASE_URL || '/',
    routes,
} as any);


router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    const userInfo = authStore.getUserInfo();

    console.log(userInfo)

    const excludedRoutes = [
        'landing',
        'admin-login',
        'user-login',
        'otp',
        'not-found',
        'forgot-password',
        'reset-password',
    ];

    const isExcludedRoute = excludedRoutes.includes(to.name as string);

    // is the user accessing the admin area?
    const isAdminRoute = to.path.includes('/admin');

    if (!authStore.userIsLoggedIn()) {
        if (!isExcludedRoute) {
            // if the user is not logged in, redirect to login page
            if (isAdminRoute) {
                next({name: 'admin-login'});
            } else {
                next({name: 'user-login'});
            }
        } else {
            next();
        }
    } else {
        // if the user is logged in and is trying to access the login page, redirect to home page
        if (isExcludedRoute) {
            if (isAdminRoute) {
                next({name: 'AdminHome'});
            } else {
                if (authStore.userIsAdmin()) {
                    next({name: 'AdminHome'});
                } else {
                    next({name: 'ChatbotPage'});
                }
            }
        } else {
            next();
        }
    }
});

export default router;
