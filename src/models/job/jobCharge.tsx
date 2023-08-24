import {
    deleteChargesAPI,
    GetNJobCGSByIDAPI,
    queryChargesByJobIdAPI,
    saveChargesAPI
} from '@/services/smart/job/job-info';
import type React from "react";
import {useCallback, useState} from "react";
import {formatNumToMoney} from '@/utils/units'

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

    // TODO: 费用的币种、发票类型数据，创建费用时用
    const chargeBaseInfo: APIModel.AccountPeriodInfo = {
        CurrencyOpts: [],
    }
    const arInvoTypeList: APIModel.InvoiceType[] = [];
    const apInvoTypeList: APIModel.InvoiceType[] = [];
    //endregion

    // TODO: 单票详情
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
        const NJobDetailDto = response.Content?.NJobDetailDto;
        const ChargeBaseInfoDto = response.Content?.AccountPeriodInfo || chargeBaseInfo;
        const PayInvoTypeListDto = response.Content?.PayInvoTypeList || apInvoTypeList;
        const ResInvoTypeListDto = response.Content?.ResInvoTypeList || arInvoTypeList;
        if (response.Result) {
            // TODO: 整理返回结果
            // TODO: 将数据存到 model 里
            setChargeBaseInfo(ChargeBaseInfoDto);
            setPayInvoTypeList(PayInvoTypeListDto);
            setResInvoTypeList(ResInvoTypeListDto);
        }
        setResResult(response);
        return NJobDetailDto;
    }, []);


    // TODO: 查询费用
    const queryChargesByJobId = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryChargesByJobIdAPI(params);
        if (response.success && response.data) {
            if (response.data.chargeARList?.length > 0) {
                response.data.chargeARList = response.data.chargeARList.map((item: any)=> (getCGItem(item)))
            }
            if (response.data.chargeAPList?.length > 0) {
                response.data.chargeAPList = response.data.chargeAPList.map((item: any)=> (getCGItem(item)))
            }
            if (response.data.reimbursementChargeList?.length > 0) {
                response.data.reimbursementChargeList = response.data.reimbursementChargeList.map((item: any)=> (getCGItem(item, 3)))
            }
            if (response.data.refundAPChargeList?.length > 0) {
                response.data.refundAPChargeList = response.data.refundAPChargeList.map((item: any)=> (getCGItem(item)))
            }
            if (response.data.refundARChargeList?.length > 0) {
                response.data.refundARChargeList = response.data.refundARChargeList.map((item: any)=> (getCGItem(item)))
            }
        }
        return response;
    }, []);

    // TODO: 保存费用
    const saveCharges = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        const response: API.Result = await saveChargesAPI(params);
        return response;
    }, []);

    // TODO: 删除费用
    const deleteCharges = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await deleteChargesAPI(params);
    }, []);
    //endregion


    return {
        resResult,
        ChargeBaseInfo,
        PayInvoTypeList,
        ResInvoTypeList,
        getCJobCGByID,

        queryChargesByJobId,
        saveCharges,
        deleteCharges,
    }
}

// TODO: 处理费用的部分数据
/**
 * @Description: TODO:
 * @author XXQ
 * @date 2023/8/22
 * @param item      费用行
 * @param type      类型
 * @returns
 */
function getCGItem (item: any, type?: number) {
    let result: any = {
        ...item,
        qtyStr: formatNumToMoney(item.qty),
        orgUnitPriceStr: formatNumToMoney(item.orgUnitPrice),
        orgAmountStr: formatNumToMoney(item.orgAmount),
        orgBillExrateStr: formatNumToMoney(item.orgBillExrate),
    };
    if (type === 3) {
        result = {
            ...result,
            receiveBillInTaxAmountStr: formatNumToMoney(item.receiveBillInTaxAmount),
            receiveOrgBillExrateStr: formatNumToMoney(item.receiveOrgBillExrate),
            payBillInTaxAmountStr: formatNumToMoney(item.payBillInTaxAmount),
            payOrgBillExrateStr: formatNumToMoney(item.payOrgBillExrate),
        };
    }
    return result;
}