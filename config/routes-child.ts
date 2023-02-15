
/**
 * @Description: TODO 注册子应用
 * @author XXQ
 * @date 2023/2/15
 * @param microApp  子应用路由参数
 * @returns
 */
const MICRO_APP_CARGO = (microApp: string) => ({
    microApp: microApp,
    microAppProps: {
        base: '', // TODO: 路由为空，可以直接跳转到对应路由，不会重定向到首页
    },
});

// TODO: 货代路由
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
            ...MICRO_APP_CARGO('cargo'),
        },
        {
            name: 'job',
            icon: 'icon-cargo-ship',
            path: '/cargo/job',
            component: './sys-cargo/job',
            ...MICRO_APP_CARGO('cargo'),
            hideInMenu: true,   // 隐藏不显示
        },
    ],
};

export default {
    cargo_route
};