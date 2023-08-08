import {useCallback} from "react";
import {
    addCreditControlAPI,
    deleteCreditControlAPI,
    editCreditControlAPI,
    operateCreditControlAPI,
    queryCreditControlAPI,
    queryUnCreditControlAPI,
    queryCreditControlInfoAPI
} from '@/services/smart/manager/credit'

type APICredit = APIManager.Credit;

export default () => {

    //region TODO: 接口
    // TODO: 获取 未做信控客户 列表
    const queryUnCreditControl = useCallback(async (params: APIManager.SearchCreditParams) => {
        const response = await queryUnCreditControlAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 获取 信控 列表
    const queryCreditControl = useCallback(async (params: APIManager.SearchCreditParams) => {
        const response = await queryCreditControlAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 获取 信控 详情
    const queryCreditControlInfo = useCallback(async (params: APICredit)=> {
        return await queryCreditControlInfoAPI(params);
    }, [])

    // TODO: 新增信控
    const addCreditControl = useCallback(async (params: APICredit)=> {
        return await addCreditControlAPI(params);
    }, [])

    // TODO: 编辑信控
    const editCreditControl = useCallback(async (params: APICredit)=> {
        return await editCreditControlAPI(params);
    }, [])

    // TODO: 删除信控
    const deleteCreditControl = useCallback(async (params: APICredit)=> {
        return await deleteCreditControlAPI(params);
    }, [])

    // TODO: 启用禁用信控
    const operateCreditControl = useCallback(async (params: APICredit)=> {
        return await operateCreditControlAPI(params);
    }, [])
    //endregion

    return {
        queryUnCreditControl,
        queryCreditControl,
        queryCreditControlInfo,
        addCreditControl,
        editCreditControl,
        deleteCreditControl,
        operateCreditControl,
    }
}