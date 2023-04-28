import {GetNJobInfoByIDAPI} from '@/services/smart/cargo/joblist';
import type React from "react";
import {useCallback, useState} from "react";


interface T {
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    const basicInfo = {};
    //endregion

    // TODO: 单票详情
    const [BasicInfo, setBasicInfo] = useState(basicInfo);

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getBasicInfo = useCallback(async (params: APIModel.GetCJobByID) => {
        // TODO: 请求后台 API
        const response = await GetNJobInfoByIDAPI(params);
        if (!response) return;
        setBasicInfo(response)
    }, []);


    return {
        BasicInfo,
        getBasicInfo,
    }
}