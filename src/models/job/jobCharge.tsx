import {GetNJobCGSByIDAPI} from '@/services/smart/job/job-info';
import type React from "react";
import {useCallback, useState} from "react";


interface T {
    resResult: object,
    // TODO: 单票详情
    JobChargeInfo: APIModel.NJobDetailDto,
    ChargeBaseInfo: APIModel.AccountPeriodInfo,

    ResInvoTypeList: APIModel.InvoiceType[],
    PayInvoTypeList: APIModel.InvoiceType[],
    getCJobCGByID: () => void
}

export default (callback: T, deps: React.DependencyList) => {
    //region TODO: 费用详情结构表
    const jobChargeInfo: APIModel.NJobDetailDto = {
        ID: 0,
        NBasicInfo: {
            Code: '',
        },
        PayCGList: [],
        ReceiveCGList: [],
    };
    // TODO: 费用的币种、发票类型数据，创建费用时用
    const chargeBaseInfo: APIModel.AccountPeriodInfo = {
        CurrencyOpts: [],
    }
    const arInvoTypeList: APIModel.InvoiceType[] = [];
    const apInvoTypeList: APIModel.InvoiceType[] = [];
    //endregion

    // TODO: 单票详情
    const [JobChargeInfo, setJobChargeInfo] = useState(jobChargeInfo || {});
    // TODO: 费用基础信息
    const [ChargeBaseInfo, setChargeBaseInfo] = useState(chargeBaseInfo || {});
    // TODO: 发票类型
    const [PayInvoTypeList, setPayInvoTypeList] = useState(apInvoTypeList || {});
    const [ResInvoTypeList, setResInvoTypeList] = useState(arInvoTypeList || {});
    // TODO: 返回结果
    const [resResult, setResResult] = useState({});

    // TODO: 获取单票费用详情请求
    const getCJobCGByID = useCallback(async (params: APIModel.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: APIModel.GetCJobByIDResponse = await GetNJobCGSByIDAPI(params);
        if (!response) return;
        const NJobDetailDto = response.Content?.NJobDetailDto || jobChargeInfo;
        const ChargeBaseInfoDto = response.Content?.AccountPeriodInfo || chargeBaseInfo;
        const PayInvoTypeListDto = response.Content?.PayInvoTypeList || apInvoTypeList;
        const ResInvoTypeListDto = response.Content?.ResInvoTypeList || arInvoTypeList;
        if (response.Result) {
            // TODO: 整理返回结果
            // TODO: 将数据存到 model 里
            setJobChargeInfo(NJobDetailDto);
            setChargeBaseInfo(ChargeBaseInfoDto);
            setPayInvoTypeList(PayInvoTypeListDto);
            setResInvoTypeList(ResInvoTypeListDto);
        }
        setResResult(response);
        return NJobDetailDto;
    }, []);
    //endregion


    return {
        resResult,
        JobChargeInfo,
        ChargeBaseInfo,
        PayInvoTypeList,
        ResInvoTypeList,
        getCJobCGByID,
    }
}