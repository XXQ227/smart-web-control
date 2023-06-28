

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

// TODO: 主要业务类型
export const BUSINESS_TYPE = [
    {value: '1', label: 'FCL'},
    {value: '2', label: 'LCL'},
    {value: '3', label: 'Bulk'},
    {value: '4', label: 'Air'},
    {value: '5', label: 'Land'},
    {value: '6', label: 'Rail Way'},
];

export const CREDIT_ASSESSMENT_SCORE_DATA: any[] = [
    {id: 1, assessmentItem: 'Registered Capital (10K CNY)', scoreWeight: '20%', score1: '<=10', score2: '11-50', score3: '51-200', score4: '201-500', score5: '>500', score: 0},
    {id: 2, assessmentItem: 'Established for (Year)', scoreWeight: '10%', score1: '<=1', score2: '1-3', score3: '4-5', score4: '6-7', score5: '>7', score: 0},
    {id: 3, assessmentItem: 'Industry Situation', scoreWeight: '10%', score1: 'Very Bad', score2: 'Bad', score3: 'Average', score4: 'Good', score5: 'Excellent', score: 0},
    {id: 4, assessmentItem: 'Credit Standing', scoreWeight: '20%', score1: 'Bad debts have occurred', score2: 'No relevant experience', score3: 'Often in arrears', score4: 'Occasionally in arrears', score5: 'Pay in time', score: 0},
    {id: 5, assessmentItem: 'Estimated monthly income (10K CNY)', scoreWeight: '20%', score1: '<=10', score2: '11-30', score3: '31-50', score4: '51-100', score5: '>100', score: 0},
    {id: 6, assessmentItem: 'Estimated Gross Profit Rate', scoreWeight: '20%', score1: '<=0%', score2: '0.1-2%', score3: '2.1-5%', score4: '5.1-8%', score5: '>8%', score: 0},
]

// TODO: 信用状态
export const aasDemo = [
    {value: '', label: ''},
];