const cargo_route = {
    name: 'cargo',
    icon: 'icon-cargo-ship',
    path: '/cargo',
    routes: [
        {
            path: '/cargo',
            redirect: '/cargo/job-list',
        },
        {
            name: 'job-list',
            icon: 'icon-ticket',
            path: '/cargo/job-list',
            component: './sys-cargo/job-list',
            microApp: 'cargo',
            microAppProps: {
                base: '', // TODO: 路由为空，可以直接跳转到对应路由，不会重定向到首页
            },
        },
        {
            name: 'job',
            icon: 'icon-cargo-ship',
            path: '/cargo/job',
            component: './sys-cargo/job',
            microApp: 'cargo',
            microAppProps: {
                base: '', // TODO: 路由为空，可以直接跳转到对应路由，不会重定向到首页
            },
            hideInMenu: true,   // 隐藏不显示
        },
    ],
};

export default {
    cargo_route
};