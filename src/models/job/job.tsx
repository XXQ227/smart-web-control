import {queryJobInfoAPI, querySeaExportInfoAPI} from '@/services/smart/job/job-info';
import type React from "react";
import {useCallback} from "react";


interface T {
    // TODO: 通用基础数据
    CommonBasicInfo: APIModel.CommonBasicInfo,
    // TODO: 单票详情
    CJobInfo: APIModel.NJobDetailDto,
    resResult: object,
}


export default (callback: T, deps: React.DependencyList) => {
    //region TODO: 业务详情结构表
    //endregion

    // TODO: 单票详情

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const queryJobInfo = useCallback(async (params: APIModel.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryJobInfoAPI(params);
        if (!response) return;
        return response.data;
    }, []);

    // TODO: 获取单票业务详情请求
    const querySeaExportInfo = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await querySeaExportInfoAPI(params);
    }, []);
    //endregion


    return {
        queryJobInfo,
        querySeaExportInfo,
    }
}