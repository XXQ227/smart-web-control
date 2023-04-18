import {GetNJobInfoByIDAPI} from '@/services/smart/joblist';
import type React from "react";
import {useCallback, useState} from "react";


interface T {
    // TODO: 单票详情
    CJobInfo: API.NJobDetailDto,
    resResult: object,
}


export default (callback: T, deps: React.DependencyList) => {
    //region TODO: 业务详情结构表
    const jobInfo: API.NJobDetailDto = {
        ID: 0,
        NBasicInfo: {
            Code: '',
            Principal: {
                SalesManID: 0,
                SalesManName: '',
                PrincipalXID: 0,
                PrincipalXName: '',
                PrincipalXNameEN: '',
            },
        },
    };
    //endregion

    // TODO: 单票详情
    const [CJobInfo, setCJobInfo] = useState(jobInfo || {});
    // TODO: 返回结果
    const [resResult, setResResult] = useState({});

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getCJobInfoByID = useCallback(async (params: API.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: API.GetCJobByIDResponse = await GetNJobInfoByIDAPI(params);
        if (!response) return;
        const NJobDetailDto = response.Content?.NJobDetailDto || jobInfo;
        if (response.Result) {
            // TODO: 整理返回结果
            // TODO: 将数据存到 model 里
            setCJobInfo(NJobDetailDto);
        }
        setResResult(response);
        return NJobDetailDto;
    }, [jobInfo]);


    return {
        CJobInfo,
        resResult,
        getCJobInfoByID,
    }
}