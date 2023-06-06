import {
    addSeaAPI,
    querySeaAPI,
    editSeaAPI,
    operateSeaAPI, deleteSeaAPI
} from '@/services/smart/manager/port';
import {useCallback, useState} from "react";

type APIPort = APIManager.Port;

export default () => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    const [PortList, setPortList] = useState<APIPort[]>([]);

    //region TODO: 接口
    // TODO: 获取港口列表
    const querySea = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await querySeaAPI(params);
        if (!response) return;
        setPortList(response.data);
        return response;
    }, []);

    // TODO: 新增港口
    const addSea = useCallback(async (params: APIPort)=> {
        return await addSeaAPI(params);
    }, []);

    // TODO: 编辑港口
    const editSea = useCallback(async (params: APIPort)=> {
        return await editSeaAPI(params);
    }, []);

    // TODO: 删除港口
    const deleteSea = useCallback(async (params: APIPort)=> {
        return await deleteSeaAPI(params);
    }, []);

    // TODO: 启用禁用港口
    const operateSea = useCallback(async (params: APIPort)=> {
        return await operateSeaAPI(params);
    }, []);


    return {
        PortList,
        querySea,
        addSea,
        editSea,
        deleteSea,
        operateSea
    }
}