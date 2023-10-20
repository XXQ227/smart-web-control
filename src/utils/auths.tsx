export const initUserInfo = {
    AuthorityIDList: '',
    password: '',
    DisplayName: '',
    ID: null,
    BranchID: null,
    Token: '',
    CityID: null,
    CityName: '',
    CountryID: null,
    CountryName: '',
    FuncCurrency: '',
    IsOpenAccount: '',
    IsSalesMan: null,
    DivisionID: null,
    BranchCode: '',
    FinereportURL: '',
};

/**
 * 设置客户端固定信息，如userID，Auth等
 * */
export function setSystemMes(tokenResult: any = initUserInfo) {

    // TODO: 设置token到客户端，并且同时设置登录用户权限到客户端
    sessionStorage.setItem('token', JSON.stringify(tokenResult));

    sessionStorage.setItem('access_token', tokenResult.access_token);
    sessionStorage.setItem('id_token', tokenResult.id_token);
    sessionStorage.setItem('refresh_token', tokenResult.refresh_token);

    // TODO: 用户信息
    const userInfo: any = tokenResult.userInfo || {};
    sessionStorage.setItem('user_info', userInfo);
    sessionStorage.setItem('userId', userInfo.id);
    sessionStorage.setItem('user_name', userInfo.chineseName);
    sessionStorage.setItem('sino_no', userInfo.userId);
    sessionStorage.setItem('user_code', userInfo.userId);

    // TODO: 公司信息
    sessionStorage.setItem('branch', userInfo.branch);                      // TODO: 公司信息

    const branchInfo: any = userInfo?.branch || {};
    sessionStorage.setItem('branchId', branchInfo.id);
    sessionStorage.setItem('branch_address', branchInfo.address);
    sessionStorage.setItem('branch_contactName', branchInfo.contactName);       // TODO: 公司法人
    sessionStorage.setItem('funcCurrencyName', branchInfo.funcCurrencyName);   // TODO: 本位币
    sessionStorage.setItem('iamCompanyOrgCode', tokenResult.iamCompanyOrgCode);   // TODO: 公司 IAM 号
    // TODO: 公司币种数据集合
    sessionStorage.setItem('currencyList', JSON.stringify(userInfo.exrateEntity));
}

//region TODO: token 信息
export const TOKEN = () => JSON.parse(sessionStorage.getItem('token') || '');
// TODO: access_token
export const ACCESS_TOKEN = () => sessionStorage.getItem('access_token');
//endregion

//region 公司信息
// TODO: 公司详情信息
export const BRANCH = () => sessionStorage.getItem('branch');

// TODO: 公司 id
export const BRANCH_ID = () => sessionStorage.getItem('branchId') || '1665596906844135426';

// TODO: 公司本位币
export const FUNC_CURRENCY_NAME = () => sessionStorage.getItem('funcCurrencyName');

// TODO: IAM 公司 Code
export const IAM_COMPANY_ORG_CODE = () => sessionStorage.getItem('iamCompanyOrgCode');
//endregion


// region 用户信息
// TODO: 用户信息
export const USER_INFO = () => sessionStorage.getItem('user_info');
// TODO: 用户 ID
export const USER_ID = () => sessionStorage.getItem('userId');

// TODO: 用户名
export const USER_NAME = () => sessionStorage.getItem('user_name');

// TODO: 外运员工号
export const SINOTRANS_NO = () => sessionStorage.getItem('user_code');

// TODO: 币种集合
export const CURRENCY_LIST = () => JSON.parse(sessionStorage.getItem('currencyList') || '');
//  endregion

