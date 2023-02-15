import childrenRoutes from './children-routes'

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
    // TODO: 超级管理员
    {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        // hideInMenu: true,   // 隐藏不显示
        access: 'isLeadAdmin',
        routes: [
            {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
            },
            {
                component: './404',
            },
        ],
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
    // TODO: Bill 系统
    {
        name: 'bill',
        icon: 'icon-bill_L3',
        path: '/bill',
        routes: [
            {
                path: '/bill',
                redirect: '/bill/ticket',
            },
            {
                name: 'ticket',
                icon: 'DollarCircleOutlined',
                path: '/bill/ticket',
                component: './sys-bill/ticket',
            },
            {
                name: 'bill',
                icon: 'icon-bill',
                path: '/bill/bill',
                component: './sys-bill/bill',
            },
            {
                name: 'invoice',
                icon: 'icon-invoice-2',
                path: '/bill/invoice',
                component: './sys-bill/invoice',
            },
            {
                name: 'agent',
                icon: 'icon-invoice-2',
                path: '/bill/agent',
                component: './sys-bill/agent',
            },
        ],
    },
    // TODO: Cargo 系统
    // {
    //     name: 'cargo',
    //     icon: 'icon-cargo-ship',
    //     path: '/cargo',
    //     routes: [
    //         {
    //             path: '/cargo',
    //             redirect: '/cargo/job-list',
    //         },
    //         {
    //             name: 'ticket-list',
    //             icon: 'icon-ticket',
    //             path: '/cargo/job-list',
    //             component: './sys-cargo/job-list',
    //         },
    //         {
    //             name: 'ticket',
    //             icon: 'icon-cargo-ship',
    //             path: '/cargo/job',
    //             component: './sys-cargo/job',
    //             hideInMenu: true,   // 隐藏不显示
    //         },
    //     ],
    // },
    // TODO: Cargo 子系统
    childrenRoutes.cargo_route,
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
