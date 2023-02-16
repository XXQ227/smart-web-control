// TODO: 微前端 - 路由配置
import routesChild from './routes-child';

// TODO: 导出路由信息
export default [
    {
        layout: false,
        name: 'login',
        path: '/user/login',
        component: './user/Login',
        hideInMenu: true,   // 隐藏不显示
    },
    {
        path: '/',
        redirect: '/welcome',
    },
    {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
    },
    // TODO: 用户个人信息
    {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
            {
                path: '/account',
                redirect: '/account/center',
            },
            {
                name: 'center',
                icon: 'smile',
                path: '/account/center',
                component: './account/center',
            },
            {
                name: 'settings',
                icon: 'UserOutlined',
                path: '/account/settings',
                component: './account/settings',
            },
        ],
    },
    routesChild.cargo_route,
    routesChild.bill_route,
    // TODO: Manager 系统
    {
        name: 'manager',
        icon: 'icon-cargo-ship',
        path: '/manager',
        routes: [
            {
                path: '/manager',
                redirect: '/manager',
            },
            {
                name: 'settlement',
                icon: 'icon-ticket',
                path: '/manager',
                component: './sys-manager',
            },
        ],
    },
    // TODO: 异常页面
    {
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,   // 隐藏不显示
        path: '/exception',
        routes: [
            {
                path: '/exception',
                redirect: '/exception/403',
            },
            {
                name: '403',
                icon: 'smile',
                path: '/exception/403',
                component: './exception/403',
            },
            {
                name: '404',
                icon: 'smile',
                path: '/exception/404',
                component: './exception/404',
            },
            {
                name: '500',
                icon: 'smile',
                path: '/exception/500',
                component: './exception/500',
            },
        ],
    },
];
