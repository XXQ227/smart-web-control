
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
const job_route = {
    name: 'cargo',
    icon: 'icon-job-ship',
    path: '/job',
    routes: [
        {
            path: '/job',
            redirect: '/job/job-list',
        },
        {
            name: 'job-list',
            icon: 'icon-ticket',
            path: '/job/job-list',
            component: './sys-job/job-list',
            ...MICRO_APP_CARGO('job'),
        },
        // {
        //     name: 'job1',
        //     icon: 'icon-job-ship',
        //     path: '/job/job/:id/:bizType4id',
        //     component: './sys-job/job',
        // },
        {
            name: 'job',
            icon: 'icon-job-ship',
            path: '/job/job',
            // 只有在编辑页面时，才显示
            access: 'isJobEditPage',
            routes: [
                {
                    path: '/job/job',
                    redirect: '/job/job/job-info/:id/:bizType4id',
                },
                {
                    name: 'job-info',
                    icon: 'icon-job-ship',
                    path: '/job/job/job-info/:id/:bizType4id',
                    component: './sys-job/job/basicInfoForm',
                },
                {
                    name: 'job-charge',
                    icon: 'icon-job-ship',
                    path: '/job/job/job-charge/:id/:bizType4id',
                    component: './sys-job/job/charge',
                },
            ],
            ...MICRO_APP_CARGO('job'),
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
    icon: 'icon-menu-cv-center',
    path: '/manager',
    routes: [
        {
            path: '/manager',
            redirect: '/manager',
        },
        // TODO: 客户、供应商
        {
            name: 'cv_center_list',
            icon: 'icon-cv-center',
            path: '/manager/cv-center/list',
            component: './sys-manager/cv-center/cv-center-list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'cv_center_info',
            icon: 'icon-cv-center',
            path: '/manager/cv-center/form/:id',
            component: './sys-manager/cv-center/cv-center-form',
        },
        // TODO: 客户审批
        {
            name: 'customer_approval_list',
            icon: 'icon-cv-approval',
            path: '/manager/cv-approval/list',
            component: './sys-manager/cv-center/customer-approval-list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'customer_approval_list',
            icon: 'icon-cv-center',
            path: '/manager/cv-approval/form/:id',
            component: './sys-manager/cv-center/cv-center-form',
        },
        // TODO: 港口数据
        {
            name: 'port_list',
            icon: 'icon-port',
            path: '/manager/port/list',
            component: './sys-manager/port/port-list',
        },
        // TODO: 账期数据
        {
            name: 'account_list',
            icon: 'icon-account-manage',
            path: '/manager/account/list',
            component: './sys-manager/account/account-list',
        },
        // TODO: 费用名称数据
        {
            name: 'charge_description_list',
            icon: 'icon-charge-subject',
            path: '/manager/charge-description/list',
            component: './sys-manager/charge-description/charge-description-list',
        },
        // TODO: 费用模板数据
        {
            name: 'charge_template_list',
            icon: 'icon-charge-manage',
            path: '/manager/charge-template/list',
            component: './sys-manager/charge-template/charge-template-list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_template_info',
            icon: 'icon-charge-manage',
            path: '/manager/charge-template/form/:id',
            component: './sys-manager/charge-template/charge-template-form',
        },
        // TODO: 报价数据
        {
            name: 'charge_quotation_list',
            icon: 'icon-charge-quotation',
            path: '/manager/charge-quotation/list',
            component: './sys-manager/charge-quotation/charge-quotation-list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_quotation_info',
            icon: 'icon-charge-quotation',
            path: '/manager/charge-quotation/form/:id',
            component: './sys-manager/charge-quotation/charge-quotation-form',
        },
    ],
};

// TODO: Chart 系统
const chart_route = {
    name: 'chart',
    icon: 'icon-menu-cv-center',
    path: '/chart',
    routes: [
        {
            path: '/chart',
            redirect: '/chart',
        },
        {
            name: 'line-chart',
            icon: 'icon-cv-center',
            path: '/chart/line-chart',
            component: './sys-chart/line-chart',
            ...MICRO_APP_CARGO('chart'),
        },
    ],
};
export default {
    job_route,
    bill_route,
    manager_route,
    chart_route,
};