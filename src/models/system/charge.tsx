import type React from "react";
import {useCallback} from "react";
import {
    queryChargeStandardInfoAPI, editChargeStandardAPI, addChargeStandardAPI,
    deleteChargeStandardAPI, operateChargeStandardAPI, queryChargeStandardAPI,
    queryChargeItemInfoAPI, editChargeItemAPI, addChargeItemAPI,
    deleteChargeItemAPI, operateChargeItemAPI, queryChargeItemAPI
} from '@/services/smart/system/charge'


interface T {
}

export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    //endregion


    //region TODO: 标准费目接口
    // TODO: 查询标准费目列表
    const queryChargeStandard = useCallback(async (params: APISystem.SearchStandardCGItemParams) => {
        // TODO: 请求后台 API
        const response: any = await queryChargeStandardAPI(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 新增标准费目
    const addChargeStandard = useCallback(async (params: APISystem.StandardCGItem) => {
        // TODO: 请求后台 API
        return await addChargeStandardAPI(params);
    }, []);


    // TODO: 查询标准费目详情
    const queryChargeStandardInfo = useCallback(async (params: APISystem.StandardCGItem) => {
        // TODO: 请求后台 API
        return await queryChargeStandardInfoAPI(params);
    }, []);


    // TODO: 编辑标准费目
    const editChargeStandard = useCallback(async (params: APISystem.StandardCGItem) => {
        // TODO: 请求后台 API
        return await editChargeStandardAPI(params);
    }, []);


    // TODO: 删除费目
    const deleteChargeStandard = useCallback(async (params: APISystem.StandardCGItem) => {
        // TODO: 请求后台 API
        const response: any = await deleteChargeStandardAPI(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 启用禁用标准费目
    const operateChargeStandard = useCallback(async (params: APISystem.StandardCGItem) => {
        // TODO: 请求后台 API
        const response: any = await operateChargeStandardAPI(params);
        if (!response) return;
        return response;
    }, []);
    //endregion


    //region TODO: 费目接口
    // TODO: 查询标准费目列表
    const queryChargeItem = useCallback(async (params: APISystem.SearchCGItemParams) => {
        // TODO: 请求后台 API
        const response: any = await queryChargeItemAPI(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 新增标准费目
    const addChargeItem = useCallback(async (params: APISystem.CGItem) => {
        // TODO: 请求后台 API
        return await addChargeItemAPI(params);
    }, []);


    // TODO: 查询标准费目详情
    const queryChargeItemInfo = useCallback(async (params: APISystem.CGItem) => {
        // TODO: 请求后台 API
        return await queryChargeItemInfoAPI(params);
    }, []);


    // TODO: 编辑标准费目
    const editChargeItem = useCallback(async (params: APISystem.CGItem) => {
        // TODO: 请求后台 API
        return await editChargeItemAPI(params);
    }, []);


    // TODO: 删除费目
    const deleteChargeItem = useCallback(async (params: APISystem.CGItem) => {
        // TODO: 请求后台 API
        const response: any = await deleteChargeItemAPI(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 启用禁用标准费目
    const operateChargeItem = useCallback(async (params: APISystem.CGItem) => {
        // TODO: 请求后台 API
        const response: any = await operateChargeItemAPI(params);
        if (!response) return;
        return response;
    }, []);
    //endregion



    return {
        queryChargeStandard,
        addChargeStandard,
        queryChargeStandardInfo,
        editChargeStandard,
        deleteChargeStandard,
        operateChargeStandard,

        queryChargeItem,
        addChargeItem,
        queryChargeItemInfo,
        editChargeItem,
        deleteChargeItem,
        operateChargeItem,
    }
}