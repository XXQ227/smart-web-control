
/**
 * @Description: TODO qiankun 架构注册子应用
 * @author XXQ
 * @date 2023/2/15
 * @param microApp  子应用路由参数
 * @returns
 */
const MICRO_APP_CARGO = (microApp: string) => ({
    // microApp,
    // microAppProps: {
    //     base: '', // TODO: 路由为空，可以直接跳转到对应路由，不会重定向到首页
    // },
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
            path: '/cargo/job/:id',
            component: './sys-cargo/job',
            ...MICRO_APP_CARGO('cargo'),
            hideInMenu: true,   // 隐藏不显示
        },
    ],
};

// TODO: Bill 系统
const bill_route = {
    name: 'bill',
    icon: 'icon-bill_L4',
    path: '/bill',
    routes: [
        {
            path: '/bill',
            redirect: '/bill/ticket',
        },
        {
            name: 'ticket',
            icon: 'icon-job',
            path: '/bill/ticket',
            component: './sys-bill/ticket',
            ...MICRO_APP_CARGO('bill'),
        },
        {
            name: 'bill',
            icon: 'icon-bill',
            path: '/bill/bill',
            component: './sys-bill/bill',
            ...MICRO_APP_CARGO('bill'),
        },
        {
            name: 'invoice',
            icon: 'icon-invoice-2',
            path: '/bill/invoice',
            component: './sys-bill/invoice',
            ...MICRO_APP_CARGO('bill'),
        },
        {
            name: 'agent',
            icon: 'icon-invoice-2',
            path: '/bill/agent',
            component: './sys-bill/agent',
            ...MICRO_APP_CARGO('bill'),
        },
    ],
};

// TODO: Manager 系统
const manager_route = {
    name: 'manager',
    icon: 'icon-menu-settlement',
    path: '/manager',
    routes: [
        {
            path: '/manager',
            redirect: '/manager',
        },
        {
            name: 'settlement',
            icon: 'icon-settlement',
            path: '/manager/settlement-form',
            component: './sys-manager/settlement/settlement-form',
            ...MICRO_APP_CARGO('manager'),
        },
        {
            name: 'settlement.info',
            icon: 'icon-settlement',
            path: '/manager/settlement-list',
            component: './sys-manager/settlement/settlement-list',
            ...MICRO_APP_CARGO('manager'),
        },
    ],
};
export default {
    cargo_route,
    bill_route,
    manager_route
};