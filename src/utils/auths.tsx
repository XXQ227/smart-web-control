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
export function setSystemMes(sysMes: any = initUserInfo) {
    //设置token到客户端，并且同时设置登录用户权限到客户端
    sessionStorage.setItem('user-info', JSON.stringify(sysMes));
    sessionStorage.setItem('authID', sysMes.AuthIDList);
    sessionStorage.setItem('auth', sysMes.AuthorityIDList);
    sessionStorage.setItem('password', sysMes.password);
    sessionStorage.setItem('userName', sysMes.DisplayName);
    sessionStorage.setItem('userID', sysMes.ID);
    sessionStorage.setItem('branchID', sysMes.BranchID);
    sessionStorage.setItem('access_token', sysMes.Token);
    sessionStorage.setItem('cityID', sysMes.CityID);
    sessionStorage.setItem('cityName', sysMes.CityName);
    sessionStorage.setItem('countryID', sysMes.CountryID);
    sessionStorage.setItem('countryName', sysMes.CountryName);
    sessionStorage.setItem('funcCurrency', sysMes.FuncCurrency);
    sessionStorage.setItem('IsOpenAccount', sysMes.IsOpenAccount);
    sessionStorage.setItem('IsSalesMan', sysMes.IsSalesMan);
    sessionStorage.setItem('DivisionID', sysMes.DivisionID);
    sessionStorage.setItem('branchCode', sysMes.BranchCode);
    sessionStorage.setItem('FineReportURL', sysMes.FinereportURL);
    sessionStorage.setItem('currencyList', JSON.stringify([{value: 'CNY', label: 'CNY'}, {value: 'HKD', label: 'HKD'}]));
}

// 设置密码
export function setPassword(password: string) {
    sessionStorage.setItem('password', password);
}

export function getPassword() {
    return sessionStorage.getItem('password');
}

// region 获取数据
export function getUserInfo() {
    const userInfo = sessionStorage.getItem('user-info');
    return userInfo && userInfo !== 'undefined' ? JSON.parse(userInfo) || initUserInfo : initUserInfo;
}
export function getAccess_Token() {
    return sessionStorage.getItem('access_token');
}
export function getAuthority() {
    return sessionStorage.getItem('auth');
}
export function getAuthIDList() {
    return sessionStorage.getItem('authID');
}

export function getCurrentUser() {
    return sessionStorage.getItem('userName');
}

export function getUserID() {
    return Number(sessionStorage.getItem('userID'));
}

export function getBranchID() {
    return Number(sessionStorage.getItem('branchID'));
}

export function getCityID() {
    return Number(sessionStorage.getItem('cityID'));
}

export function getCityName() {
    return sessionStorage.getItem('cityName');
}

export function getCountryID() {
    return Number(sessionStorage.getItem('countryID'));
}

export function getCountryName() {
    return sessionStorage.getItem('countryName');
}

export function getFuncCurrency() {
    return sessionStorage.getItem('funcCurrency');
}

export function getCurrencyList() {
    return JSON.parse(sessionStorage.getItem('currencyList') || '');
}

export function getIsOpenAccount() {
    return sessionStorage.getItem('IsOpenAccount');
}

export function getIsSalesMan() {
    return sessionStorage.getItem('IsSalesMan');
}

export function getDivisionID() {
    return Number(sessionStorage.getItem('DivisionID'));
}

export function getBranchCode() {
    return sessionStorage.getItem('branchCode');
}

export function getFineReportURL() {
    return sessionStorage.getItem('FineReportURL');
}
//  endregion

