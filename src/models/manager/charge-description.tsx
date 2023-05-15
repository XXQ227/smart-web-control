import type React from "react";
import {useCallback, useState} from "react";
import {GetCGItem, CreateCargoCGItem, DeleteCGItem, FreezenCGItem} from '@/services/smart/manager/charge-description'


interface T {
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    const [CGItemList, setCGItemList] = useState<APIManager.CGItem[]>([]);

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getCGItem = useCallback(async (params: APIManager.SearchCGItemParams) => {
        // TODO: 请求后台 API
        const response: any = await GetCGItem(params);
        if (!response) return;
        const result: APIManager.CGItemResult = {
            success: true,
            total: response.Page?.ItemTotal,
            data: response.CargoCGItem,
        }
        setCGItemList(response.CargoCGItem);
        return result;
    }, []);


    // TODO: 获取单票业务详情请求
    const saveCGItem = useCallback(async (params: APIManager.CGItem) => {
        // TODO: 请求后台 API
        const response: any = await CreateCargoCGItem(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 获取单票业务详情请求
    const deleteCGItem = useCallback(async (params: APIManager.DeleteFreezenCGItem) => {
        // TODO: 请求后台 API
        const response: any = await DeleteCGItem(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 获取单票业务详情请求
    const freezenCGItem = useCallback(async (params: APIManager.DeleteFreezenCGItem) => {
        // TODO: 请求后台 API
        const response: any = await FreezenCGItem(params);
        if (!response) return;
        return response;
    }, []);



    return {
        CGItemList,
        getCGItem,
        saveCGItem,
        deleteCGItem,
        freezenCGItem,
    }
}