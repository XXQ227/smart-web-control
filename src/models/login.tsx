import {loginSmart, iamUserLogInAPI} from '@/services/smart/login';
import {useCallback, useState} from "react";
import {setSystemMes} from "@/utils/auths";
import {message} from 'antd'
import {logoutAPI} from '@/services/smart/iam'

export default () => {
    const userInfoSession: any = {};

    const [userInfo, setUserInfo] = useState<any>(userInfoSession || {});
    const [resResult, setResResult] = useState({});

    /**
     * @Description: TODO Smart 系统登录
     * @author XXQ
     * @date 2023/2/7
     * @param params: {LoginName: string, Password: string, SystemID: int}
     * @returns
     */
    const login = useCallback(async (params: API.LoginParams) => {
        const response: API.APILoginResult = await loginSmart(params);
        // const response: API.APILoginResult = await loginIAM(params);
        if (!response) return;
        setResResult(response);
        if (response.Result) {
            setSystemMes(response?.Content);
            setUserInfo(response?.Content);
        }
        return response;
    }, []);

    /**
     * @Description: TODO 退出登录
     * @author XXQ
     * @date 2023/2/7
     * @param params: {LoginName: string, Password: string, SystemID: int}
     * @returns
     */
    const logout = useCallback(async (params: API.LoginParams) => {
        return await logoutAPI(params);
    }, []);



    /**
     * @Description: TODO IAM 登录
     * @author XXQ
     * @date 2023/2/7
     * @returns
     */
    const iamUserLogIn = useCallback(async (params: any) => {
        try {
            const response: API.Result = await iamUserLogInAPI(params);
            if (!response) return;
            if (response.success) {
                setSystemMes({});
                setUserInfo({});
            }
            return response;
        } catch (e) {
            message.error(e);
            return {success: false};
        }
    }, []);

    return {
        userInfo,
        login,
        logout,
        iamUserLogIn,
        resResult,
    }
}