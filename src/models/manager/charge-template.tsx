import {useCallback} from "react";
import {
    queryChargeTemplateAPI, addChargeTemplateAPI, queryChargeTemplateInfoAPI,
    editChargeTemplateAPI, deleteChargeTemplateAPI, OperateChargeTemplateAPI
} from '@/services/smart/manager/charge-template'


export default () => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    //region TODO: 接口
    // TODO: 获取费用模板列表
    const queryChargeTemplate = useCallback(async (params: APIManager.SearchCGTempParams)=> {
        // TODO: 请求后台 API
        const response = await queryChargeTemplateAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 删除费用模板
    const addChargeTemplate = useCallback(async (params: APIManager.CGTemp)=> {
        // TODO: 请求后台 API
        return await addChargeTemplateAPI(params);
    }, []);

    // TODO: 删除费用模板
    const queryChargeTemplateInfo = useCallback(async (params: APIManager.CGTemp)=> {
        // TODO: 请求后台 API
        return await queryChargeTemplateInfoAPI(params);
    }, []);

    // TODO: 删除费用模板
    const editChargeTemplate = useCallback(async (params: APIManager.CGTemp)=> {
        // TODO: 请求后台 API
        return await editChargeTemplateAPI(params);
    }, []);

    // TODO: 删除费用模板
    const deleteChargeTemplate = useCallback(async (params: APIManager.CGTemp)=> {
        // TODO: 请求后台 API
        return await deleteChargeTemplateAPI(params);
    }, []);

    // TODO: 删除费用模板
    const operateChargeTemplate = useCallback(async (params: APIManager.CGTemp)=> {
        // TODO: 请求后台 API
        return await OperateChargeTemplateAPI(params);
    }, []);
    //endregion


    return {
        queryChargeTemplate, addChargeTemplate, queryChargeTemplateInfo,
        editChargeTemplate, deleteChargeTemplate, operateChargeTemplate
    }
}