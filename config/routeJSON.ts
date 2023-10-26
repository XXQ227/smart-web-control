const routesJSON = [
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
        icon: 'icon-dashboard',
        component: './Welcome',
    },
    // TODO: 用户个人信息
    {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,   // 隐藏不显示
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
    // TODO: Cargo 系统
    {
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
            },
        ],
    },
    // TODO: Bill 系统
    {
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
            },
        ],
    },
    // TODO: Manager 系统
    {
        name: 'manager',
        icon: 'icon-menu-settlement',
        path: '/system',
        routes: [
            {
                path: '/system',
                redirect: '/system',
            },
            // TODO: 经营单位<Branch>数据
            {
                name: 'branch_list',
                icon: 'icon-branch',
                path: '/system/branch',
                component: './sys-manager/branch',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'branch_info',
                icon: 'icon-branch',
                path: '/system/branch/form/:id',
                component: './sys-manager/branch/form',
            },
            // TODO: 业务单位
            {
                name: 'business_unit',
                icon: 'icon-business-unit',
                path: '/system/business-unit',
                routes: [
                    // TODO: 业务单位
                    {
                        name: 'business_unit_list',
                        icon: 'icon-business-unit',
                        path: '/system/business-unit/list',
                        component: './sys-manager/business-unit/business-unit',
                    },
                    {
                        hideInMenu: true,   // 隐藏不显示
                        name: 'business_unit_info',
                        icon: 'icon-business-unit',
                        path: '/system/business-unit/form/:id',
                        component: './sys-manager/business-unit/business-unit/form',
                    },
                    // TODO: 业务单位属性
                    {
                        name: 'business_unit_property_list',
                        icon: 'icon-cv-approval',
                        path: '/system/business-unit/property',
                        component: './sys-manager/business-unit/business-unit-property',
                    },
                    {
                        hideInMenu: true,   // 隐藏不显示
                        name: 'business_unit_property_info',
                        icon: 'icon-business-unit',
                        path: '/system/business-unit/property/form/:id',
                        component: './sys-manager/business-unit/business-unit-property/form',
                    },
                    // TODO: 付款方
                    {
                        name: 'payer_list',
                        icon: 'icon-cv-approval',
                        path: '/system/business-unit/payer',
                        component: './sys-manager/business-unit/payer',
                    },
                    // TODO: 客户审批
                    {
                        hideInMenu: true,   // 隐藏不显示
                        name: 'customer_approval_list',
                        icon: 'icon-cv-approval',
                        path: '/system/business-unit/cv-approval/list',
                        component: './sys-manager/business-unit/business-unit-property/approval-list',
                    },
                    {
                        hideInMenu: true,   // 隐藏不显示
                        name: 'customer_approval_info',
                        icon: 'icon-business-unit',
                        path: '/system/business-unit/cv-approval/form/:id',
                        component: './sys-manager/business-unit/business-unit-property/form',
                    },
                    // TODO: 供应商
                    {
                        hideInMenu: true,   // 隐藏不显示
                        name: 'vendor_list',
                        icon: 'icon-cv-approval',
                        path: '/system/business-unit/vendor/list',
                        component: './sys-manager/business-unit/vendor/vendor-list',
                    },
                    {
                        hideInMenu: true,   // 隐藏不显示
                        name: 'vendor_info',
                        icon: 'icon-business-unit',
                        path: '/system/vendor/form/:id',
                        component: './sys-manager/business-unit/vendor/vendor-form',
                    },
                ],
            },
            // TODO: 信控数据
            {
                name: 'credit_list',
                icon: 'icon-credit',
                path: '/system/credit',
                component: './sys-manager/credit',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'credit_info',
                icon: 'icon-credit',
                path: '/system/credit/form/:id',
                component: './sys-manager/credit/form',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'credit_info',
                icon: 'icon-credit',
                path: '/system/credit/form/:id/:buId',
                component: './sys-manager/credit/form',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'credit_approval',
                icon: 'icon-credit',
                path: '/system/credit/approval/:id',
                component: './sys-manager/credit/approval',
            },
            // TODO: 船代
            {
                name: 'shipping_list',
                icon: 'icon-shipping',
                path: '/system/shipping',
                component: './sys-manager/shipping',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'voyage_info',
                icon: 'icon-shipping',
                path: '/system/shipping/voyage/form/:id',
                component: './sys-manager/shipping/voyage-form',
            },
            // TODO: 账期数据
            {
                name: 'account_list',
                icon: 'icon-account-manage',
                path: '/system/account',
                component: './sys-manager/account/',
            },
            // TODO: 费用名称数据
            {
                name: 'charge',
                icon: 'icon-charge-subject',
                path: '/system/charge',
                component: './sys-manager/charge',
            },
            // TODO: 发票类型
            {
                name: 'invoiceType_list',
                icon: 'icon-invoiceType',
                path: '/system/invoiceType/list',
                component: './sys-manager/invoiceType',
            },
            // TODO: 费用模板数据
            {
                name: 'charge_template_list',
                icon: 'icon-charge-manage',
                path: '/system/charge-template',
                component: './sys-manager/charge-template',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'charge_template_info',
                icon: 'icon-charge-manage',
                path: '/system/charge-template/form/:id',
                component: './sys-manager/charge-template/form',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'charge_template_info',
                icon: 'icon-charge-manage',
                path: '/system/charge-template/copy/:id',
                component: './sys-manager/charge-template/form',
            },
            // TODO: 报价数据
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'charge_quotation_list',
                icon: 'icon-charge-quotation',
                path: '/system/charge-quotation/list',
                component: './sys-manager/charge-quotation/list',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'charge_quotation_info',
                icon: 'icon-charge-quotation',
                path: '/system/charge-quotation/form/:id',
                component: './sys-manager/charge-quotation/form',
            },
            // TODO: 部门
            {
                name: 'department_list',
                icon: 'icon-department-manager',
                path: '/system/department',
                component: './sys-manager/department',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'department_form',
                icon: 'icon-department-manager',
                path: '/system/department/form/:id',
                component: './sys-manager/department/form',
            },
            // TODO: 项目
            {
                name: 'project_list',
                icon: 'icon-project',
                path: '/system/project',
                component: './sys-manager/project',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'project_info',
                icon: 'icon-project',
                path: '/system/project/form/:id',
                component: './sys-manager/project/form',
            },
            // TODO: 用户
            {
                name: 'user',
                icon: 'icon-user-manager',
                path: '/system/user',
                component: './sys-manager/user/user-list',
            },
            // TODO: edi
            {
                name: 'edi',
                icon: 'icon-EDI',
                path: '/system/edi/list',
                component: './sys-manager/edi',
            },
            {
                hideInMenu: true,   // 隐藏不显示
                name: 'edi_info',
                icon: 'icon-EDI',
                path: '/system/edi/form/:id',
                component: './sys-manager/edi/form',
            },
            // TODO: 用户权限
            {
                name: 'auth',
                icon: 'icon-auth',
                path: '/system/auth',
                routes: [
                    {
                        name: 'auth',
                        path: '/system/authority/auth',
                        component: './sys-manager/authority',
                    },
                    {
                        name: 'auth_form',
                        hideInMenu: true,
                        icon: 'icon-auth',
                        path: '/system/authority/auth/form/:id',
                        component: './sys-manager/authority/form',
                    },
                    {
                        name: 'role',
                        path: '/manager/authority/role',
                        component: './sys-manager/authority/role',
                    },
                    {
                        name: 'auth_form',
                        hideInMenu: true,
                        icon: 'icon-auth',
                        path: '/manager/authority/role/form/:id',
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
