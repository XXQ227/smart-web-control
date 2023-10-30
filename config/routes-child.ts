
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
            path: '/job/job-info',
            // 只有在编辑页面时，才显示
            access: 'isJobEditPage',
            hideInMenu: true,   // 隐藏不显示
            routes: [
                {
                    path: '/job/job-info',
                    redirect: '/job/job-info/form/:id',
                },
                {
                    name: 'job-info',
                    icon: 'icon-job-ship',
                    path: '/job/job-info/form/:id',
                    component: './sys-job/job',
                },
                {
                    name: 'job-charge',
                    icon: 'icon-job-ship',
                    path: '/job/job-info/charge/:id',
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
            redirect: '/bill/billing/ar',
        },
        {
            name: 'billing',
            icon: 'icon-bill-L1',
            path: '/bill/billing',
            // component: './sys-bill/bill',
            routes: [
                {
                    name: 'ar',
                    icon: 'icon-job-ship',
                    path: '/bill/billing/ar',
                    component: './sys-bill/bill/billing',
                },
                {
                    name: 'ap',
                    icon: 'icon-job-ship',
                    path: '/bill/billing/ap',
                    component: './sys-bill/bill/billing',
                },
                {
                    name: 'invoice',
                    icon: 'icon-job-ship',
                    path: '/bill/billing/invoice',
                    component: './sys-bill/bill/invoice',
                },
            ],
            ...MICRO_APP_CARGO('bill'),
        },
        {
            name: 'settlement',
            icon: 'icon-settlement',
            path: '/bill/settlement',
            component: './sys-bill/settlement',
            /*routes: [
                {
                    name: 'outstanding',
                    icon: 'icon-settlement',
                    path: '/bill/settlement/outstanding',
                    component: './sys-bill/settlement',
                },
                {
                    name: 'partial-settle',
                    icon: 'icon-job-ship',
                    path: '/bill/settlement/partial-settle',
                    component: './sys-bill/settlement',
                },
                {
                    name: 'settle-log',
                    icon: 'icon-job-ship',
                    path: '/bill/settlement/settle-log',
                    component: './sys-bill/settlement/log',
                },
            ],*/
            ...MICRO_APP_CARGO('bill'),
        },
        {
            name: 'audit',
            icon: 'icon-audit',
            path: '/bill/audit',
            // component: './sys-bill/invoice',
            routes: [
                {
                    name: 'job',
                    icon: 'icon-audit-order',
                    path: '/bill/audit/job',
                    component: './sys-bill/audit/job',
                },
                {
                    name: 'invoice',
                    icon: 'icon-audit-financial',
                    path: '/bill/audit/invoice',
                    component: './sys-bill/audit/invoice',
                },
            ],
            ...MICRO_APP_CARGO('bill'),
        },
    ],
};

// TODO: Manager 系统
const manager_route = {
    name: 'system',
    icon: 'icon-menu-settlement',
    path: '/system',
    routes: [
        {path: '/system', redirect: '/system',},
        // TODO: 字典表数据维护
        {name: 'dict', icon: 'icon-dictionary', path: '/system/dict', component: './sys-system/dict',},
        {
            name: 'dict_type', hideInMenu: true,   // 隐藏不显示
            path: '/system/dict/form/:id', component: './sys-system/dict/form',
        },
        // TODO: 港口数据
        {name: 'port_list', icon: 'icon-port', path: '/system/port', component: './sys-system/port',},
        // TODO: 经营单位<Branch>数据
        {name: 'branch_list', icon: 'icon-branch', path: '/system/branch', component: './sys-system/branch',},
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'branch_info', icon: 'icon-branch',
            path: '/system/branch/form/:id', component: './sys-system/branch/form',
        },
        // TODO: 业务单位
        {
            name: 'business_unit', icon: 'icon-business-unit', path: '/system/business-unit',
            routes: [
                // TODO: 业务单位
                {
                    name: 'business_unit_list', icon: 'icon-business-unit',
                    path: '/system/business-unit/list', component: './sys-system/business-unit/business-unit',
                },
                {
                    hideInMenu: true, access: 'isSuperAdmin',
                    name: 'business_unit_info', icon: 'icon-business-unit',
                    path: '/system/business-unit/form/:id', component: './sys-system/business-unit/business-unit/form',
                },
                // TODO: 业务单位属性
                {
                    name: 'business_unit_property_list', icon: 'icon-cv-approval',
                    path: '/system/business-unit/property', component: './sys-system/business-unit/business-unit-property',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'business_unit_property_info', icon: 'icon-business-unit',
                    path: '/system/business-unit/property/form/:id',
                    component: './sys-system/business-unit/business-unit-property/form',
                },
                // TODO: 付款方
                {
                    name: 'payer_list', icon: 'icon-cv-approval',
                    path: '/system/business-unit/payer', component: './sys-system/business-unit/payer',
                },
                // TODO: 客户审批
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'customer_approval_list', icon: 'icon-cv-approval',
                    path: '/system/business-unit/cv-approval/list',
                    component: './sys-system/business-unit/business-unit-property/approval-list',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'customer_approval_info', icon: 'icon-business-unit',
                    path: '/system/business-unit/cv-approval/form/:id',
                    component: './sys-system/business-unit/business-unit-property/form',
                },
                // TODO: 供应商
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'vendor_list', icon: 'icon-cv-approval',
                    path: '/system/business-unit/vendor/list', component: './sys-system/business-unit/vendor/vendor-list',
                },
                {
                    hideInMenu: true,   // 隐藏不显示
                    name: 'vendor_info', icon: 'icon-business-unit',
                    path: '/system/vendor/form/:id', component: './sys-system/business-unit/vendor/vendor-form',
                },
            ],
        },
        // TODO: 信控数据
        {name: 'credit_list', icon: 'icon-credit', path: '/system/credit', component: './sys-system/credit',},
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'credit_info', icon: 'icon-credit',
            path: '/system/credit/form/:id', component: './sys-system/credit/form',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'credit_info', icon: 'icon-credit',
            path: '/system/credit/form/:id/:buId', component: './sys-system/credit/form',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'credit_approval', icon: 'icon-credit',
            path: '/system/credit/approval/:id', component: './sys-system/credit/approval',
        },
        // TODO: 船代
        {name: 'shipping_list', icon: 'icon-shipping', path: '/system/shipping', component: './sys-system/shipping'},
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'voyage_info', icon: 'icon-shipping',
            path: '/system/shipping/voyage/form/:id', component: './sys-system/shipping/voyage-form',
        },
        // TODO: 账期数据
        {
            name: 'account_list', icon: 'icon-account-manage',
            path: '/system/account', component: './sys-system/account/',
        },
        // TODO: 费用名称数据
        {name: 'charge', icon: 'icon-charge-subject', path: '/system/charge', component: './sys-system/charge',},
        // TODO: 发票类型
        {
            name: 'invoiceType_list', icon: 'icon-invoiceType',
            path: '/system/invoiceType/list', component: './sys-system/invoiceType',
        },
        // TODO: 费用模板数据
        {
            name: 'charge_template_list', icon: 'icon-charge-manage',
            path: '/system/charge-template', component: './sys-system/charge-template',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_template_info', icon: 'icon-charge-manage',
            path: '/system/charge-template/form/:id', component: './sys-system/charge-template/form',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_template_info', icon: 'icon-charge-manage',
            path: '/system/charge-template/copy/:id', component: './sys-system/charge-template/form',
        },
        // TODO: 报价数据
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_quotation_list', icon: 'icon-charge-quotation',
            path: '/system/charge-quotation/list', component: './sys-system/charge-quotation/list',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'charge_quotation_info', icon: 'icon-charge-quotation',
            path: '/system/charge-quotation/form/:id', component: './sys-system/charge-quotation/form',
        },
        // TODO: 部门
        {
            name: 'department_list', icon: 'icon-department-manager',
            path: '/system/department', component: './sys-system/department',
        },
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'department_form', icon: 'icon-department-manager',
            path: '/system/department/form/:id', component: './sys-system/department/form',
        },
        // TODO: 项目
        {name: 'project_list', icon: 'icon-project', path: '/system/project', component: './sys-system/project',},
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'project_info', icon: 'icon-project',
            path: '/system/project/form/:id', component: './sys-system/project/form',
        },
        // TODO: 用户
        {name: 'user', icon: 'icon-user-manager', path: '/system/user', component: './sys-system/user/user-list',},
        // TODO: edi
        {name: 'edi', icon: 'icon-EDI', path: '/system/edi/list', component: './sys-system/edi',},
        {
            hideInMenu: true,   // 隐藏不显示
            name: 'edi_info', icon: 'icon-EDI', path: '/system/edi/form/:id', component: './sys-system/edi/form',
        },
        // TODO: 用户权限
        {
            name: 'auth', icon: 'icon-auth', path: '/system/authority',
            routes: [
                {name: 'auth', path: '/system/authority/auth', component: './sys-system/authority/auth',},
                {
                    name: 'auth_form', hideInMenu: true, icon: 'icon-auth',
                    path: '/system/authority/auth/form/:id', component: './sys-system/authority/auth/form',
                },
                {
                    name: 'auth_form', hideInMenu: true, icon: 'icon-auth',
                    path: '/system/authority/auth/level2/form/:id', component: './sys-system/authority/auth/form',
                },
                {
                    name: 'auth_form', hideInMenu: true, icon: 'icon-auth',
                    path: '/system/authority/auth/level2/:pathType/form/:id', component: './sys-system/authority/auth/form',
                },
                {name: 'role', path: '/system/authority/role', component: './sys-system/authority/role',},
                {
                    name: 'auth_form', hideInMenu: true, icon: 'icon-auth',
                    path: '/system/authority/role/form/:id', component: './sys-system/authority/role/form',
                },
            ],
        },
        // TODO: bpmn 审批 bpmn-js
        {name: 'bpmn', icon: 'icon-user-manager', path: '/system/bpmn', component: './sys-system/bpmn',},
    ],
};

export default {
    job_route,
    bill_route,
    manager_route,
};
