import {useCallback} from "react";
import {deleteBankAPI} from '@/services/smart/manager/bank'

export default () => {

    // TODO: 删除银行
    const deleteBank = useCallback(async (params: any)=> {
        return await deleteBankAPI(params);
    }, [])

    return {
        deleteBank,
    }
}