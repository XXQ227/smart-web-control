import {useCallback} from "react";
import {
    getAdminUserListBySystemCodeListAPI,
    getManagerUserByAppIdAPI,
    iamAccessedAppsAPI,
    mdmAppsAPI
} from '@/services/smart/iam'


export default () => {
    // TODO: 基础数据
    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const iamAccessedApps = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await iamAccessedAppsAPI(params);
        console.log(response);
    }, []);
    const getAdminUserListBySystemCodeList = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await getAdminUserListBySystemCodeListAPI(params);
        console.log(response);
    }, []);
    const mdmApps = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await mdmAppsAPI(params);
        console.log(response);
    }, []);
    const getManagerUserByAppId = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await getManagerUserByAppIdAPI(params);
        console.log(response);
    }, []);
    //endregion


    return {
        iamAccessedApps,
        mdmApps,
        getAdminUserListBySystemCodeList,
        getManagerUserByAppId,
    }
}