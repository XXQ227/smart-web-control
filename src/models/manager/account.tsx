import {useCallback} from "react";
import {
    addAccountPeriodAPI,
    editAccountPeriodAPI, endCloseAccountPeriodAPI, openAccountPeriodAPI,
    queryAccountPeriodAPI, queryAccountPeriodCommonAPI,
    queryAccountPeriodInfoAPI, queryStartAccountPeriodInfoAPI, startCloseAccountPeriodAPI
} from '@/services/smart/manager/account';

type APIAccountPeriod = APIManager.AccountPeriod;

export default () => {

    //region TODO: 接口
    // TODO: 查询账期列表
    // POST /base/web/accountPeriod/queryAccountPeriod
    // API ID:95364449
    // API URL:https://app.apifox.com/project/2684231/apis/api-95364449
    const queryAccountPeriod = useCallback(async (params: APIManager.SearchAccountParams) => {
        const response = await queryAccountPeriodAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 查询账期详情
    // POST /base/web/accountPeriod/queryAccountPeriodInfo
    // API ID:95364645
    // API URL:https://app.apifox.com/project/2684231/apis/api-95364645
    const queryAccountPeriodInfo = useCallback(async (params: APIAccountPeriod) => {
        return await queryAccountPeriodInfoAPI(params);
    }, []);

    // TODO: 新增账期
    // POST /base/web/accountPeriod/addAccountPeriod
    // API ID:95364326
    // API URL:https://app.apifox.com/project/2684231/apis/api-95364326
    const addAccountPeriod = useCallback(async (params: APIAccountPeriod) => {
        return await addAccountPeriodAPI(params);
    }, []);

    // TODO: 编辑账期
    // POST /base/web/accountPeriod/editAccountPeriod
    // API ID:95365549
    // API URL:https://app.apifox.com/project/2684231/apis/api-95365549
    const editAccountPeriod = useCallback(async (params: APIAccountPeriod) => {
        return await editAccountPeriodAPI(params);
    }, []);

    // TODO: 开启账期
    // POST /base/web/accountPeriod/openAccountPeriod
    // API ID:95366751
    // API URL:https://app.apifox.com/project/2684231/apis/api-95366751
    const openAccountPeriod = useCallback(async (params: APIAccountPeriod) => {
        return await openAccountPeriodAPI(params);
    }, []);

    // TODO: 开始关账
    // POST /base/web/accountPeriod/startCloseAccountPeriod
    // API ID:95366924
    // API URL:https://app.apifox.com/project/2684231/apis/api-95366924
    const startCloseAccountPeriod = useCallback(async (params: APIAccountPeriod) => {
        return await startCloseAccountPeriodAPI(params);
    }, []);

    // TODO: 结束关账
    const endCloseAccountPeriod = useCallback(async (params: APIAccountPeriod) => {
        return await endCloseAccountPeriodAPI(params);
    }, []);

    // TODO: 通用账期查询
    // POST /base/web/accountPeriod/queryAccountPeriodCommon
    // API ID:98908726
    // API URL:https://app.apifox.com/project/2684231/apis/api-98908726
    const queryAccountPeriodCommon = useCallback(async (params: APIAccountPeriod) => {
        return await queryAccountPeriodCommonAPI(params);
    }, []);

    // TODO: 查询当前开启账期
    // POST /base/web/accountPeriod/queryStartAccountPeriodInfo
    // API ID:100610076
    // API URL:https://app.apifox.com/project/2684231/apis/api-100610076
    const queryStartAccountPeriodInfo = useCallback(async (params: APIAccountPeriod) => {
        return await queryStartAccountPeriodInfoAPI(params);
    }, []);

    return {
        queryAccountPeriod,
        queryAccountPeriodInfo,
        addAccountPeriod,
        editAccountPeriod,
        openAccountPeriod,
        startCloseAccountPeriod,
        endCloseAccountPeriod,
        queryAccountPeriodCommon,
        queryStartAccountPeriodInfo,
    }
}