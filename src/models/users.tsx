import {loginSmart} from '@/services/smart/login';
import type React from "react";
import {useCallback, useState} from "react";
import {setSystemMes} from "@/utils/auths";

interface T {
    // TODO: 返回结果
    resResult: any,
    // TODO: 用户信息
    userInfo: object,
    // TODO: 登录系统
    login: void,
    // TODO: 退出登录
    logout: void,
}

export default (callback: T, deps: React.DependencyList) => {
    const userInfoSession: API.LoginUserInfo = {
        AuthIDList: [],
        AuthorityIDList: '',
        BranchCode: '',
        BranchID: 0,
        CityID: 0,
        CityName: '',
        CountryID: 0,
        CountryName: '',
        DisplayName: '',
        DivisionID: 0,
        Email: '',
        FinereportURL: '',
        FuncCurrency: '',
        ID: 0,
        IsOpenAccount: false,
        IsSalesMan: false,
        PUAList: undefined,
        Token: '',
        password: ''
    };

    const [userInfo, setUserInfo] = useState(userInfoSession || {});
    const [resResult, setResResult] = useState({});

    /**
     * @Description: TODO 登录
     * @author XXQ
     * @date 2023/2/7
     * @param params: {LoginName: string, Password: string, SystemID: int}
     * @returns
     */
    const login = useCallback(async (params: API.LoginParams) => {
        const response: API.APIResult = await loginSmart(params);
        if (!response) return;
        setResResult(response);
        if (response.Result) {
            setSystemMes(response?.Content);
            setUserInfo(response?.Content);
        }
        return response;
    }, []);

    /**
     * @Description: TODO 推出登录
     * @author XXQ
     * @date 2023/2/7
     * @returns
     */
    const logout = useCallback(() => {
        setSystemMes({});
        setUserInfo(userInfoSession)
        return true;
    }, deps);

    return {
        userInfo,
        login,
        logout,
        resResult,
    }
}