import {useCallback} from "react";
import {
    addAccountPeriodAPI,
    editAccountPeriodAPI, openAccountPeriodAPI,
    queryAccountPeriodAPI, queryAccountPeriodCommonAPI,
    queryAccountPeriodInfoAPI, queryStartAccountPeriodInfoAPI, startCloseAccountPeriodAPI
} from '@/services/smart/manager/account';



export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: 单票详情

    //region TODO: 接口
    // TODO: 查询账期列表
    // POST /base/web/accountPeriod/queryAccountPeriod
    // API ID:95364449
    // API URL:https://app.apifox.com/project/2684231/apis/api-95364449
    const queryAccountPeriod = useCallback(async (params: APIManager.SearchAccountParams) => {
        // TODO: 请求后台 API
        const response: any = await queryAccountPeriodAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增账期
    // POST /base/web/accountPeriod/addAccountPeriod
    // API ID:95364326
    // API URL:https://app.apifox.com/project/2684231/apis/api-95364326
    const addAccountPeriod = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await addAccountPeriodAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 查询账期详情
    // POST /base/web/accountPeriod/queryAccountPeriodInfo
    // API ID:95364645
    // API URL:https://app.apifox.com/project/2684231/apis/api-95364645
    const queryAccountPeriodInfo = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await queryAccountPeriodInfoAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 编辑账期
    // POST /base/web/accountPeriod/editAccountPeriod
    // API ID:95365549
    // API URL:https://app.apifox.com/project/2684231/apis/api-95365549
    const editAccountPeriod = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await editAccountPeriodAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 开启账期
    // POST /base/web/accountPeriod/openAccountPeriod
    // API ID:95366751
    // API URL:https://app.apifox.com/project/2684231/apis/api-95366751
    const openAccountPeriod = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await openAccountPeriodAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 开始关账
    // POST /base/web/accountPeriod/startCloseAccountPeriod
    // API ID:95366924
    // API URL:https://app.apifox.com/project/2684231/apis/api-95366924
    const startCloseAccountPeriod = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await startCloseAccountPeriodAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 通用账期查询
    // POST /base/web/accountPeriod/queryAccountPeriodCommon
    // API ID:98908726
    // API URL:https://app.apifox.com/project/2684231/apis/api-98908726
    const queryAccountPeriodCommon = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await queryAccountPeriodCommonAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 查询当前开启账期
    // POST /base/web/accountPeriod/queryStartAccountPeriodInfo
    // API ID:100610076
    // API URL:https://app.apifox.com/project/2684231/apis/api-100610076
    const queryStartAccountPeriodInfo = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await queryStartAccountPeriodInfoAPI(params);
        if (!response) return;
        return response;
    }, []);

    return {
        queryAccountPeriod,
        addAccountPeriod,
        queryAccountPeriodInfo,
        editAccountPeriod,
        openAccountPeriod,
        startCloseAccountPeriod,

        queryAccountPeriodCommon,
        queryStartAccountPeriodInfo,
    }
}