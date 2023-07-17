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

type APICreditControl = APIManager.Credit;

export default () => {
    // TODO: 基础数据


    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const queryCreditControl = useCallback(async (params: APIManager.SearchCreditParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryCreditControlAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 获取单票业务详情请求
    const queryUnCreditControl = useCallback(async (params: APIManager.SearchCreditParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryUnCreditControlAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 添加银行公司
    const addCreditControl = useCallback(async (params: APICreditControl)=> {
        return await addCreditControlAPI(params);
    }, [])

    // TODO: 获取 CreditControl 详情
    const queryCreditControlInfo = useCallback(async (params: {id: string})=> {
        // TODO: 请求后台 API
        return await queryCreditControlInfoAPI(params);
    }, [])

    // TODO: 获取 CreditControl 详情
    const editCreditControl = useCallback(async (params: APICreditControl)=> {
        return await editCreditControlAPI(params);
    }, [])

    // TODO: 获取 CreditControl 详情
    const deleteCreditControl = useCallback(async (params: APICreditControl)=> {
        return await deleteCreditControlAPI(params);
    }, [])

    // TODO: 获取 CreditControl 详情
    const operateCreditControl = useCallback(async (params: APICreditControl)=> {
        return await operateCreditControlAPI(params);
    }, [])
    //endregion

    return {
        queryCreditControl,
        queryUnCreditControl,
        addCreditControl,
        queryCreditControlInfo,
        editCreditControl,
        deleteCreditControl,
        operateCreditControl,
    }
}