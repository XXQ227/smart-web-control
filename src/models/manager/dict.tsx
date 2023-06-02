import {useCallback, useState} from "react";
import {
    addDictAPI, deleteDictAPI, editDictAPI, operateDictAPI, queryDictAPI,
    addDictDetailAPI, deleteDictDetailAPI, editDictDetailAPI, operateDictDetailAPI, queryDictDetailAPI,
} from '@/services/smart/manager/dict'

type APIDict = APIManager.Dict;
type APIDictDetail = APIManager.DictDetail;


export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: Dict List 数据
    const [DictList, setDictList] = useState<APIDict[]>([]);

    //region TODO: Dict 接口
    // TODO: 获取字典类型列表
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
    //endregion

    //region TODO: Dict Detail 字典详情接口
    // TODO: 获取字典详情列表
    const queryDictDetail = useCallback(async (params: APIManager.SearchDictDetailParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryDictDetailAPI(params);
        if (!response) return;
        setDictList(response.data);
        return response;
    }, []);

    // TODO: 添加 字典详情
    const addDictDetail = useCallback(async (params: APIDictDetail)=> {
        return await addDictDetailAPI(params);
    }, []);

    // TODO: 编辑 字典详情
    const editDictDetail = useCallback(async (params: APIDictDetail)=> {
        return await editDictDetailAPI(params);
    }, []);

    // TODO: 删除 字典详情
    const deleteDictDetail = useCallback(async (params: APIDictDetail)=> {
        return await deleteDictDetailAPI(params);
    }, []);

    // TODO: 删除 字典详情
    const operateDictDetail = useCallback(async (params: APIDictDetail)=> {
        return await operateDictDetailAPI(params);
    }, []);
    //endregion

    return {
        queryDict,
        DictList,
        addDict,
        editDict,
        deleteDict,
        operateDict,
        queryDictDetail,
        addDictDetail,
        editDictDetail,
        deleteDictDetail,
        operateDictDetail,
    }
}