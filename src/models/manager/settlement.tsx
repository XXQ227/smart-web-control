import {GetCTPByStr} from '@/services/smart/manager/settlement'
import type React from "react";
import {useCallback, useState} from "react";

type APICVInfoList = APIModel.CVInfoList;

interface T {
    CVInfoList: APICVInfoList[],
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    const cvInfoList: APICVInfoList[] = [];
    //endregion

    // TODO: 单票详情
    const [CVInfoList, setCVInfoList] = useState<APICVInfoList[]>(cvInfoList);

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getGetCTPByStr = useCallback(async (params: APIModel.CVSearchParams) => {
        console.log(params);
        // TODO: 请求后台 API
        const response: any = await GetCTPByStr(params);
        if (!response) return;
        // TODO: 定义返回结果
        const result: APIModel.CVResultInfo = {};
        result.success = true;
        result.total = response.Page?.ItemTotal;
        result.data = response.Content;
        setCVInfoList(response.Content);
        return response;
    }, []);


    return {
        CVInfoList,
        getGetCTPByStr,
    }
}