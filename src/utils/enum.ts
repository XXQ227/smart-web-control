
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
}

