import {useCallback} from "react";
import {addBankAPI, deleteBankAPI, editBankAPI, operateBankAPI} from '@/services/smart/manager/bank'

type APIBank = APIManager.Bank;

export default () => {
    // TODO: 基础数据

    //region TODO: 接口
    // TODO: 添加银行公司
    const addBank = useCallback(async (params: APIBank)=> {
        return await addBankAPI(params);
    }, [])

    // TODO: 获取 Bank 详情
    const editBank = useCallback(async (params: APIBank)=> {
        return await editBankAPI(params);
    }, [])

    // TODO: 获取 Bank 详情
    const deleteBank = useCallback(async (params: APIBank)=> {
        return await deleteBankAPI(params);
    }, [])

    // TODO: 获取 Bank 详情
    const operateBank = useCallback(async (params: APIBank)=> {
        return await operateBankAPI(params);
    }, [])
    //endregion

    return {
        addBank,
        editBank,
        deleteBank,
        operateBank,
    }
}