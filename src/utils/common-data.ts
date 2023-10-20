// TODO: 行业地位
import type {ColumnsType} from 'antd/es/table'

// TODO: 路由里的异常页面配置
export const ROUTES_EXCEPTION =     {
    name: 'exception', icon: 'warning', path: '/exception', hideInMenu: true,   // 隐藏不显示
    routes: [
        {path: '/exception', redirect: '/exception/403',},
        {name: '403', icon: 'smile', path: '/exception/403', component: './exception/403',},
        {name: '404', icon: 'smile', path: '/exception/404', component: './exception/404',},
        {name: '500', icon: 'smile', path: '/exception/500', component: './exception/500',},
    ]
}

// TODO: 币种
export const CURRENCY = [
    {value: 'CNY', label: 'CNY'},
    {value: 'HKD', label: 'HKD'},
    {value: 'THB', label: 'THB'},
    {value: 'VND', label: 'VND'},
    {value: 'USD', label: 'USD'},
    {value: 'EUR', label: 'EUR'},
    {value: 'JPY', label: 'JPY'},
    {value: 'KRW', label: 'KRW'},
];

// TODO: 行业地位
export const POSITION_IN_INDUSTRY = [
    {value: 1, label: 'Vary Bad 差'},
    {value: 2, label: 'Bad 较差'},
    {value: 3, label: 'Average 一般'},
    {value: 4, label: 'Good 好'},
    {value: 5, label: 'Excellent 极好'},
];

// TODO: 信用状态
export const CREDIT_STANDING = [
    {value: 1, label: 'Bad debts have occurred'},
    {value: 2, label: 'No relevant experience'},
    {value: 3, label: 'Often in arrears'},
    {value: 4, label: 'Occasionally in arrears'},
    {value: 5, label: 'Pay in time'},
];

// TODO: 信控中的业务类型信控业务的主要类型
export const BUSINESS_TYPE = [
    {value: '1', label: 'FCL'},
    {value: '2', label: 'LCL'},
    {value: '3', label: 'Break Bulk'},
    {value: '4', label: 'Air'},
    {value: '5', label: 'Land'},
    {value: '6', label: 'Rail Way'},
];

export const COLUMNS_CREDIT_SCORE: ColumnsType<any> = [
    {title: 'Assessment Item', dataIndex: 'assessmentItem', align: 'center', width: '21%',},
    {title: 'Score Weight', dataIndex: 'scoreWeight', align: 'center', width: '8%',},
    {title: 'Score 1', dataIndex: 'score1', align: 'center', width: '15%',},
    {title: 'Score 2', dataIndex: 'score2', align: 'center', width: '15%',},
    {title: 'Score 3', dataIndex: 'score3', align: 'center', width: '10%',},
    {title: 'Score 4', dataIndex: 'score4', align: 'center', width: '14%',},
    {title: 'Score 5', dataIndex: 'score5', align: 'center', width: '9%',},
    {title: 'Score', dataIndex: 'score', align: 'center', width: '8%',},
];
export const CREDIT_ASSESSMENT_SCORE_DATA: any[] = [
    {id: 1, assessmentItem: 'Registered Capital (10K CNY)', scoreWeight: '20%', score1: '<=10', score2: '11-50', score3: '51-200', score4: '201-500', score5: '>500', score: 0, totalScore: 0},
    {id: 2, assessmentItem: 'Established for (Year)', scoreWeight: '10%', score1: '<=1', score2: '1-3', score3: '4-5', score4: '6-7', score5: '>7', score: 0, totalScore: 0},
    {id: 3, assessmentItem: 'Industry Situation', scoreWeight: '10%', score1: 'Very Bad', score2: 'Bad', score3: 'Average', score4: 'Good', score5: 'Excellent', score: 0, totalScore: 0},
    {id: 4, assessmentItem: 'Credit Standing', scoreWeight: '20%', score1: 'Bad debts have occurred', score2: 'No relevant experience', score3: 'Often in arrears', score4: 'Occasionally in arrears', score5: 'Pay in time', score: 0, totalScore: 0},
    {id: 5, assessmentItem: 'Estimated year income (10K CNY)', scoreWeight: '20%', score1: '<=10', score2: '11-30', score3: '31-50', score4: '51-100', score5: '>100', score: 0, totalScore: 0},
    {id: 6, assessmentItem: 'Estimated Gross Profit Rate', scoreWeight: '20%', score1: '<=0%', score2: '0.1-2%', score3: '2.1-5%', score4: '5.1-8%', score5: '>8%', score: 0, totalScore: 0},
]

// TODO: 信用状态
export const aasDemo = [
    {value: '', label: ''},
];

// TODO: 业务单位属性
export const NATURE_OF_COMPANY = [
    {
        value: 21, label: '政府机构',
        children: [
            { value: 1, label: '党政机关',},
            { value: 2, label: '事业单位',},
        ],
    },
    {
        value: 22, label: '央国企',
        children: [
            { value: 3, label: '央企',},
            { value: 4, label: '国企（省属）',},
            { value: 5, label: '国企（市属）',},
            { value: 6, label: '国企（其它）',},
        ],
    },
    {
        value: 23, label: '民营企业',
        children: [
            { value: 7, label: '中国内地',},
            { value: 8, label: '台湾',},
            { value: 9, label: '香港',},
            { value: 10, label: '澳门',},
            { value: 11, label: '其它',},
        ],
    },
    {
        value: 24, label: '外企',
        children: [
            { value: 12, label: '外资企业',},
        ],
    },
    {
        value: 25, label: '境外',
        children: [
            { value: 13, label: '境外企业',},
        ],
    },
];

// TODO: 客户类型
export const PROPERTY_AS_CUSTOMER = [
    { label: 'Direct Customer 直客', value: 1, },
    { label: 'Peer 同行', value: 2, },
    { label: 'CMG 招商', value: 3, },
    { label: 'Sinotrans 中外运公司', value: 4, },
    { label: 'Carrier(as Customer) 船公司', value: 5, },
];

// TODO: 贸易条款
export const TERMS_INCOTERMS = [
    { value: 1, label: 'CFR - COST AND FREIGHT' },
    { value: 2, label: 'CIF - COST,INSURANCE AND FREIGHT' },
    { value: 3, label: 'FAS - FREE ALONGSIDE SHIP' },
    { value: 4, label: 'FOB - FREE ON BOARD' },
    { value: 5, label: 'CIP - CARRIAGE AND INSURANCE PAID' },
    { value: 6, label: 'CPT - CARRIAGE PAID TO' },
    { value: 7, label: 'DAP - DELIVERED AT PLACE' },
    { value: 8, label: 'DAT - DELIVERED AT TERMINAL' },
    { value: 9, label: 'DDP - DELIVERED DUTY PAID' },
    { value: 10, label: 'EXW - EX WORKS' },
    { value: 11, label: 'FCA - FREE CARRIER' },
];

export const TERMS_PAYMENT = [
    {value: 1, label: '(PP) Freight Prepaid'},
    {value: 2, label: '(CC) Freight Collect'},
    {value: 3, label: '(AA) Freight as arranged'},
    {value: 4, label: '(FF) Freight Free'},
    {value: 5, label: '(OT) Other'},
    {value: 6, label: '(CP) Freight payable as per charter party'},
    {value: 7, label: '(MM) Monthly payment in the third place'},
    {value: 8, label: '(PT) Freight prepaid at the third place'},
    {value: 9, label: '(CT) Freight Collect at the third place'},
];


export const BUSINESS_LINE = [
    {label: 'Freight Forwarding', value: 1},
    {label: 'Project Logistics', value: 2},
    {label: 'Contract Logistics', value: 3},
    {label: 'E-Commercial', value: 4},
    // {label: 'Shipping Agency', value: 5},
    // {label: 'Shipping Booking', value: 6},
    // {label: 'Shipping Container', value: 7},
];