import {useCallback, useState} from "react";
import {
    queryDictCommonAPI, queryDictDetailCommonAPI
} from '@/services/smart/common'



export default () => {
    // TODO: Service 数据 ==> 用于费用模板处
    const [ServicesList, setBasicInfo] = useState([]);

    //region TODO: 接口
    // TODO: 获取字典数据
    const queryDictCommon = useCallback(async (params: {dictCodes: string}) => {
        // TODO: 请求后台 API
        const response = await queryDictCommonAPI(params);
        if (!response) return;
        setBasicInfo(response);
        console.log(response);
    }, []);

    // TODO: 获取字典详情(通用接口)
    const queryDictDetailCommon = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await queryDictDetailCommonAPI(params);
        if (!response) return;
        setBasicInfo(response);
        console.log(response);
    }, []);


    return {
        ServicesList,
        queryDictCommon,
        queryDictDetailCommon,
    }
}