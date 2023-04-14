
// *  整箱
export enum FCL {id = 1, name = '整箱', nameEN = 'FCL'}
// * 拼箱
export enum LCL {id = 2, name = '拼箱',nameEN = 'FCL'}
// * 件杂货
export enum BB {id = 3, name = '件杂货',nameEN = 'BULK'}
// * 干散货
export enum DB {id = 4, name = '干散货',nameEN = 'BRY BULK'}
// * 整车
export enum FTL {id = 5, name = '整车',nameEN = 'FTL'}
// * 零担
export enum LTL {id = 6, name = '零担',nameEN = 'LTL'}
// * 所有箱型
export interface CTN_MODE_ENUM {FCL: FCL;LCL: LCL;BB: BB;DB: DB;FTL: FTL;LTL: LTL;}
// * 货物类型的枚举对象值
export const CTN_MODE = {
    FCL: {id: 1, name: '整箱',nameEN: 'FCL'},
    LCL: {id: 2, name: '拼箱',nameEN: 'FCL'},
    BB: {id: 3, name: '件杂货',nameEN: 'BULK'},
    DB: {id: 4, name: '干散货',nameEN: 'BRY BULK'},
    FTL: {id: 5, name: '整车',nameEN: 'FTL'},
    LTL: {id: 6, name: '零担',nameEN: 'LTL'},
};

// TODO: 货物类型枚举值
export const OceanTransportTypeEnum = {
    '1': {text: 'FCL', status: 'FCL', key: 1},
    '2': {text: 'LCL', status: 'LCL', key: 2},
    '3': {text: 'BULK', status: 'BULK', key: 3},
    '6': {text: 'BULK', status: 'BULK', key: 6},
};

// TODO: 费用状态枚举值
export const ChargeStateEnum = {
    '1': {text: 'Draft', status: 'Draft', key: 1},
    '2': {text: 'Submitted', status: 'Submitted', key: 2},
    '3': {text: 'Approved', status: 'Approved', key: 3},
    '4': {text: 'Bill Issued', status: 'Bill Issued', key: 4},
    '5': {text: 'Invoice Issued', status: 'Invoice Issued', key: 5},
    '6': {text: 'Invoice', status: 'Invoice', key: 6},
    '7': {text: 'Financial Confirmed', status: 'Financial Confirmed', key: 7},
    '8': {text: 'Partial Settled', status: 'Partial Settled', key: 8},
    '9': {text: 'Completed', status: 'Completed', key: 9},
    // TODO: 押金状态
    '10': {text: 'Paid', status: 'Paid', key: 10},
    '11': {text: 'Returned', status: 'Returned', key: 11},
    '12': {text: 'Partial Return', status: 'Partial Return', key: 12},
};


