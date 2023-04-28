import {GetCJobByKeyAPI} from '@/services/smart/cargo/joblist';
import type React from "react";
import {useCallback, useState} from "react";

interface T {
    // TODO: 单票详情
    CJobList: APIModel.CJobListItem[],
    resResult: object,
    DivisionList: API.APIKey$Value[],
}

export default (callback: T, deps: React.DependencyList) => {
    // TODO: 部门
    const [DivisionList, setDivisionList] = useState([]);
    // TODO: 单票集
    const [CJobList, setCJobList] = useState<APIModel.CJobListItem[]>([]);
    // TODO: 返回结果
    const [resResult, setResResult] = useState({});


    //region TODO: 接口
    // TODO: 获取单票集
    const getCJobList = useCallback(async (params: APIModel.GetCJobListInfo) => {
        // TODO: 请求后台 API
        const response: APIModel.APIGetCJobListResult = await GetCJobByKeyAPI(params);
        if (!response) return;
        // TODO: 存部门信息
        setDivisionList(response.Divisions);
        // TODO: 定义返回结果
        const result: APIModel.RuleCJobList = {};
        // TODO: 拿到需要的单票集参数 - 判断是否返回正确数据
        const JobDto = response?.JobDto || {};
        if (JobDto.Result) {
            // TODO: 整理返回结果
            result.success = true;
            result.total = JobDto.Page?.ItemTotal;
            result.data = JobDto.Content?.CJobList || [];
            // TODO: 将数据存到 model 里
            setCJobList(result.data);
        }
        setResResult(result);
        return result;
    }, deps);
    //endregion


    return {
        DivisionList,
        CJobList,
        resResult,
        getCJobList,
    }
}