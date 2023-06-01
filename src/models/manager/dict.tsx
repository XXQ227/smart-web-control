import {useCallback, useState} from "react";
import {addDictAPI, deleteDictAPI, editDictAPI, operateDictAPI, queryDictAPI} from '@/services/smart/manager/dict'

type APIDict = APIManager.Dict;


export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: Dict List 数据
    const [DictList, setDictList] = useState<APIDict[]>([]);

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const queryDict = useCallback(async (params: APIManager.SearchDictParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryDictAPI(params);
        if (!response) return;
        setDictList(response.data);
        return response;
    }, []);

    // TODO: 添加
    const addDict = useCallback(async (params: APIDict)=> {
        return await addDictAPI(params);
    }, []);

    // TODO: 编辑
    const editDict = useCallback(async (params: APIDict)=> {
        return await editDictAPI(params);
    }, []);

    // TODO: 删除
    const deleteDict = useCallback(async (params: APIDict)=> {
        return await deleteDictAPI(params);
    }, []);

    // TODO: 删除
    const operateDict = useCallback(async (params: APIDict)=> {
        return await operateDictAPI(params);
    }, []);

    return {
        queryDict,
        DictList,
        addDict,
        editDict,
        deleteDict,
        operateDict,
    }
}