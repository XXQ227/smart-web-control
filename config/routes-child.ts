
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
        // {
        //     name: 'job1',
        //     icon: 'icon-cargo-ship',
        //     path: '/cargo/job/:id/:bizType4id',
        //     component: './sys-cargo/job',
        // },
        {
            name: 'job',
            icon: 'icon-cargo-ship',
            path: '/cargo/job',
            // 只有在编辑页面时，才显示
            access: 'isJobEditPage',
            routes: [
                {
                    path: '/cargo/job',
                    redirect: '/cargo/job/job-info/:id/:bizType4id',
                },
                {
                    name: 'job-info',
                    icon: 'icon-cargo-ship',
                    path: '/cargo/job/job-info/:id/:bizType4id',
                    component: './sys-cargo/job/basicInfoForm',
                },
                {
                    name: 'job-charge',
                    icon: 'icon-cargo-ship',
                    path: '/cargo/job/job-charge/:id/:bizType4id',
                    component: './sys-cargo/job/charge',
                },
            ],
            ...MICRO_APP_CARGO('cargo'),
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
            component: './sys-manager',
        },
        {
            name: 'settlement',
            icon: 'icon-menu-settlement',
            path: '/manager/settlement',
            routes: [
                {
                    path: '/list',
                    component: './sys-manager/settlement/settlement-list',
                },
                {
                    name: 'settlement-list',
                    icon: 'icon-settlement',
                    path: '/manager/settlement/list',
                    component: './sys-manager/settlement/settlement-list',
                },
                {
                    name: 'settlement-info',
                    icon: 'icon-settlement',
                    path: '/manager/settlement/form',
                    component: './sys-manager/settlement/settlement-form',
                },
            ]
        },
    ],
};

// TODO: Chart 系统
const chart_route = {
    name: 'chart',
    icon: 'icon-menu-settlement',
    path: '/chart',
    routes: [
        {
            path: '/chart',
            redirect: '/chart',
        },
        {
            name: 'line-chart',
            icon: 'icon-settlement',
            path: '/chart/line-chart',
            component: './sys-chart/line-chart',
            ...MICRO_APP_CARGO('chart'),
        },
    ],
};
export default {
    cargo_route,
    bill_route,
    manager_route,
    chart_route,
};
