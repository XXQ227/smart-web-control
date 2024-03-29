import {useCallback} from "react";
import {
    queryChargeTemplateAPI, addChargeTemplateAPI, queryChargeTemplateInfoAPI,
    editChargeTemplateAPI, deleteChargeTemplateAPI, operateChargeTemplateAPI
} from '@/services/smart/system/charge-template'


export default () => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    //region TODO: 接口
    // TODO: 获取费用模板列表
    const queryChargeTemplate = useCallback(async (params: APISystem.SearchCGTempParams)=> {
        // TODO: 请求后台 API
        const response = await queryChargeTemplateAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 删除费用模板
    const addChargeTemplate = useCallback(async (params: APISystem.CGTemp)=> {
        // TODO: 请求后台 API
        return await addChargeTemplateAPI(params);
    }, []);

    // TODO: 删除费用模板
    const queryChargeTemplateInfo = useCallback(async (params: APISystem.CGTemp)=> {
        // TODO: 请求后台 API
        const result: API.Result = await queryChargeTemplateInfoAPI(params);
        // if (result.data?.chargeTemplateItemARList) {
        //     result.data?.chargeTemplateItemARList.map((item: any)=> {
        //         item.unitPriceStr = formatNumToMoney(item.unitPrice);
        //     })
        // }
        // if (result.data?.chargeTemplateItemAPList) {
        //     result.data?.chargeTemplateItemAPList.map((item: any)=> {
        //         item.unitPriceStr = formatNumToMoney(item.unitPrice);
        //     })
        // }
        return result;
    }, []);

    // TODO: 删除费用模板
    const editChargeTemplate = useCallback(async (params: APISystem.CGTemp)=> {
        // TODO: 请求后台 API
        return await editChargeTemplateAPI(params);
    }, []);

    // TODO: 删除费用模板
    const deleteChargeTemplate = useCallback(async (params: APISystem.CGTemp)=> {
        // TODO: 请求后台 API
        return await deleteChargeTemplateAPI(params);
    }, []);

    // TODO: 删除费用模板
    const operateChargeTemplate = useCallback(async (params: APISystem.CGTemp)=> {
        // TODO: 请求后台 API
        return await operateChargeTemplateAPI(params);
    }, []);
    //endregion


    return {
        queryChargeTemplate, addChargeTemplate, queryChargeTemplateInfo,
        editChargeTemplate, deleteChargeTemplate, operateChargeTemplate
    }
}