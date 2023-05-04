import {GetNJobInfoByIDAPI} from '@/services/smart/cargo/joblist';
import type React from "react";
import {useCallback, useState} from "react";


interface T {
    // TODO: 通用基础数据
    CommonBasicInfo: APIModel.CommonBasicInfo,
    // TODO: 单票详情
    CJobInfo: APIModel.NJobDetailDto,
    resResult: object,
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    const commonBasicInfo: APIModel.CommonBasicInfo = {
      SalesManList: [],
      FinanceDates: [],
    };
    //region TODO: 业务详情结构表
    const jobInfo: APIModel.NJobDetailDto = {
        ID: 0,
        LockDate: '',
        FinanceDate: '',
        NBasicInfo: {
            Code: '',
            LastEditor: '',
            LastEditDate: '',
            BusinessLineID: 0,
            BizTypeEN: '',
            CreateDate: '',
            Principal: {
                SalesManID: 0,
                SalesManName: '',
                PrincipalXID: 0,
                PrincipalXName: '',
                PrincipalXNameEN: '',
                PayerID: 0,
                PayerName: '',
                PayerNameEN: '',
                CargoOwnerID: 0,
                CargoOwnerName: '',
                CargoOwnerNameEN: '',
            },
        },
    };
    //endregion

    // TODO: 单票详情
    const [CJobInfo, setCJobInfo] = useState<APIModel.NJobDetailDto>(jobInfo || {});
    const [CommonBasicInfo, setCommonBasicInfo] = useState<APIModel.CommonBasicInfo>(commonBasicInfo || {});
    // TODO: 返回结果
    const [resResult, setResResult] = useState({});

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getCJobInfoByID = useCallback(async (params: APIModel.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: APIModel.GetCJobByIDResponse = await GetNJobInfoByIDAPI(params);
        if (!response) return;
        const resContent: any = response.Content || {};
        const NJobDetailDto = resContent.NJobDetailDto || jobInfo;
        if (response.Result) {
            // TODO: 整理返回结果
            // TODO: 将数据存到 model 里
            setCJobInfo(NJobDetailDto);
            // 销售员
            if (resContent.SalesMan?.length > 0) {
                resContent.SalesMan.map((item: API.APIKey$Value)=> {
                    commonBasicInfo?.SalesManList?.push({value: item?.Key, label: item?.Value, data: item});
                })
            }
            // 账期月
            if (resContent.AccountPeriodInfo?.FinanceDates?.length > 0) {
                resContent.AccountPeriodInfo?.FinanceDates.map((item: string) => {
                    commonBasicInfo?.FinanceDates?.push(item);
                })
            }
            setCommonBasicInfo(commonBasicInfo);
        }
        setResResult(response);
        return NJobDetailDto;
    }, [jobInfo]);


    return {
        CJobInfo,
        CommonBasicInfo,
        resResult,
        getCJobInfoByID,
    }
}