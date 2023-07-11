
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
                    component: './sys-job/job/basic-info-form',
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
        // TODO: 经营单位<branch>数据
        {
            name: 'branch_list',
            icon: 'icon-company-manager',
            path: '/manager/branch/list',
            component: './sys-manager/branch',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'branch_info',
            icon: 'icon-company-manager',
            path: '/manager/branch/form/:id',
            component: './sys-manager/branch/branch-form',
        },
        // TODO: 费用模板数据
        {
            name: 'credit_list',
            icon: 'icon-charge-manage',
            path: '/manager/credit',
            component: './sys-manager/credit',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'credit_info',
            icon: 'icon-charge-manage',
            path: '/manager/credit/form/:id',
            component: './sys-manager/credit/form',
        },
        // TODO: 字典表数据维护
        {
            name: 'dict',
            icon: 'icon-dictionary',
            path: '/manager/dict',
            component: './sys-manager/dict',
        },
        {
            name: 'dict_type',
            hideInMenu: true,   // 隐藏不显示
            path: '/manager/dict/form/:id',
            component: './sys-manager/dict/form',
        },
        {
            name: 'cv_center',
            icon: 'icon-cv-center',
            path: '/manager/cv-center',
            routes: [
                {
                    path: '/manager/cv-center',
                    redirect: '/manager/cv-center/company/list',
                },
                // TODO: 公司
                {
                    name: 'company_list',
                    icon: 'icon-cv-center',
                    path: '/manager/cv-center/company/list',
                    component: './sys-manager/cv-center/company/company-list',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'company_info',
                    icon: 'icon-cv-center',
                    path: '/manager/cv-center/company/form/:id',
                    component: './sys-manager/cv-center/company/company-form',
                },
                // TODO: 客户
                {
                    name: 'customer_list',
                    icon: 'icon-cv-approval',
                    path: '/manager/cv-center/customer/list',
                    component: './sys-manager/cv-center/customer/customer-list',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'customer_info',
                    icon: 'icon-cv-center',
                    path: '/manager/cv-center/customer/form/:id',
                    component: './sys-manager/cv-center/customer/customer-form',
                },
                // TODO: 客户审批
                {
                    name: 'customer_approval_list',
                    icon: 'icon-cv-approval',
                    path: '/manager/cv-center/cv-approval/list',
                    component: './sys-manager/cv-center/customer/approval-list',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'customer_approval_info',
                    icon: 'icon-cv-center',
                    path: '/manager/cv-center/cv-approval/form/:id',
                    component: './sys-manager/cv-center/customer/customer-form',
                },
                // TODO: 供应商
                {
                    name: 'vendor_list',
                    icon: 'icon-cv-approval',
                    path: '/manager/cv-approval/list',
                    component: './sys-manager/cv-center/vendor/vendor-list',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'vendor_info',
                    icon: 'icon-cv-center',
                    path: '/manager/vendor/form/:id',
                    component: './sys-manager/cv-center/vendor/vendor-form',
                },
            ],
        },
        // TODO: 港口数据
        {
            name: 'port_list',
            icon: 'icon-port',
            path: '/manager/port/list',
            component: './sys-manager/port',
        },
        // TODO: 船代
        {
            name: 'shipping_list',
            icon: 'icon-shipping',
            path: '/manager/shipping/list',
            component: './sys-manager/shipping',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'voyage_info',
            icon: 'icon-shipping',
            path: '/manager/shipping/voyage/form/:id',
            component: './sys-manager/shipping/voyage-form',
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
            name: 'charge',
            icon: 'icon-charge-subject',
            path: '/manager/charge',
            component: './sys-manager/charge',
        },
        // TODO: 费用模板数据
        {
            name: 'charge_template_list',
            icon: 'icon-charge-manage',
            path: '/manager/charge-template',
            component: './sys-manager/charge-template',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_template_info',
            icon: 'icon-charge-manage',
            path: '/manager/charge-template/form/:id',
            component: './sys-manager/charge-template/form',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_template_info',
            icon: 'icon-charge-manage',
            path: '/manager/charge-template/copy/:id',
            component: './sys-manager/charge-template/form',
        },
        // TODO: 报价数据
        {
            name: 'charge_quotation_list',
            icon: 'icon-charge-quotation',
            path: '/manager/charge-quotation/list',
            component: './sys-manager/charge-quotation/list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_quotation_info',
            icon: 'icon-charge-quotation',
            path: '/manager/charge-quotation/form/:id',
            component: './sys-manager/charge-quotation/form',
        },
        // TODO: 发票类型
        {
            name: 'invoiceType_list',
            icon: 'icon-invoiceType',
            path: '/manager/invoiceType/list',
            component: './sys-manager/invoiceType',
        },
        // TODO: 部门
        {
            name: 'department_list',
            icon: 'icon-department-manager',
            path: '/manager/department',
            component: './sys-manager/department',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'department_form',
            icon: 'icon-department-manager',
            path: '/manager/department/form/:id',
            component: './sys-manager/department/form',
        },
        // TODO: 项目
        {
            name: 'project_list',
            icon: 'icon-project',
            path: '/manager/project/list',
            component: './sys-manager/project/project-list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'project_info',
            icon: 'icon-project',
            path: '/manager/project/form/:id',
            component: './sys-manager/project/project-form',
        },
        // TODO: 用户
        {
            name: 'user',
            icon: 'icon-user-manager',
            path: '/manager/user',
            component: './sys-manager/user/user-list',
        },
        // TODO: edi
        {
            name: 'edi',
            icon: 'icon-project',
            path: '/manager/edi/list',
            component: './sys-manager/edi',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'edi_info',
            icon: 'icon-project',
            path: '/manager/edi/form/:id',
            component: './sys-manager/edi/form',
        },
        // TODO: 用户
        {
            name: 'auth',
            icon: 'icon-auth',
            path: '/manager/auth',
            routes: [
                {
                    name: 'auth_resource',
                    path: '/manager/auth/auth-resource',
                    component: './sys-manager/authority',
                },
                {
                    name: 'auth_form',
                    hideInMenu: true,
                    icon: 'icon-auth',
                    path: '/manager/auth/auth-resource/form/:id',
                    component: './sys-manager/authority/form',
                },
                {
                    name: 'role',
                    path: '/manager/auth/role',
                    component: './sys-manager/authority/role',
                },
                {
                    name: 'auth_form',
                    hideInMenu: true,
                    icon: 'icon-auth',
                    path: '/manager/auth/role/form/:id',
                    component: './sys-manager/authority/role/form',
                },
            ],
        },
        // TODO: bpmn 审批 bpmn-js
        {
            name: 'bpmn',
            icon: 'icon-user-manager',
            path: '/manager/bpmn',
            component: './sys-manager/bpmn',
            // routes: [
            //     {
            //         path: '/',
            //         redirect: '/bpmn/sample',
            //     },
            //     {
            //         name: 'sample',
            //         icon: 'smile',
            //         path: '/manager/bpmn/sample',
            //         component: './sys-manager/bpmn/bpmn-sample/BpmnSample',
            //     },
            //     {
            //         name: 'editor',
            //         icon: 'smile',
            //         path: '/manager/bpmn/editor',
            //         component: './sys-manager/bpmn/bpmn-editor/BpmnEditor',
            //     },
            // ],
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
