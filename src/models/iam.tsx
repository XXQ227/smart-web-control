import {useCallback} from "react";
import {
    iamUserLogInAPI,
} from '@/services/smart/iam'


export default () => {
    // TODO: 基础数据
    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const iamUserLogIn = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const result: any = await iamUserLogInAPI(params);
        console.log(result);
        return result;
    }, []);
    //endregion


    return {
        iamUserLogIn,
    }
}