import {GetNJobInfoByIDAPI} from '@/services/smart/joblist';
import type React from "react";
import {useCallback, useState} from "react";

interface T {
    // TODO: 单票详情
    CJobInfo: API.NJobDetailDto,
    resResult: object,
}

export default (callback: T, deps: React.DependencyList) => {
    const jobInfo: { NBasicInfo: { Code: string, Principal: { SalesManName: string; SalesManID: number } }; } = {
        NBasicInfo: {
            Code: '',
            Principal: {
                SalesManID: 0,
                SalesManName: '',
            },
        },
    };
    // TODO: 单票详情
    const [CJobInfo, setCJobInfo] = useState(jobInfo || {});
    // TODO: 返回结果
    const [resResult, setResResult] = useState({});

    //region TODO: 接口
    // TODO: 获取单票集
    const getCJobInfoByID = useCallback(async (params: API.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: API.GetCJobByIDResponse = await GetNJobInfoByIDAPI(params);
        if (!response) return;
        console.log(response);
        if (response.Result) {
            // TODO: 整理返回结果
            // TODO: 将数据存到 model 里
            setCJobInfo(response.Content?.NJobDetailDto);
        }
        setResResult(response);
        return response;
    }, []);
    //endregion


    return {
        CJobInfo,
        resResult,
        getCJobInfoByID,
    }
}