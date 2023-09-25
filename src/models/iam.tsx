import {useCallback} from "react";
import {
    iamUserLogInAPI, logoutAPI,
} from '@/services/smart/iam'


export default () => {
    // TODO: 基础数据
    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const iamUserLogIn = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const result: any = await iamUserLogInAPI(params);
        console.log(result);
        return result;
    }, []);


    // TODO: 退出登录
    //   POST /auth/iam/logout
    //   API ID:95955722
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-95955722
    const logout = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await logoutAPI(params);
    }, []);
    //endregion


    return {
        iamUserLogIn,
        logout,
    }
}