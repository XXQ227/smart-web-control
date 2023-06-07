import {
    addSeaAPI, querySeaAPI, editSeaAPI, operateSeaAPI, deleteSeaAPI,
    addAirAPI, queryAirAPI, editAirAPI, operateAirAPI, deleteAirAPI,
    addLandAPI, queryLandAPI, editLandAPI, operateLandAPI, deleteLandAPI,
    addTradePlaceAPI, queryTradePlaceAPI, editTradePlaceAPI, operateTradePlaceAPI, deleteTradePlaceAPI,
} from '@/services/smart/manager/port';
import {useCallback} from "react";

type APIPort = APIManager.Port;

export default () => {

    //region TODO: 获取水运港口列表
    const querySea = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await querySeaAPI(params);
        if (!response) return;
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
    //endregion

    //region TODO: 获取水运港口列表
    const queryAir = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryAirAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增港口
    const addAir = useCallback(async (params: APIPort)=> {
        return await addAirAPI(params);
    }, []);

    // TODO: 编辑港口
    const editAir = useCallback(async (params: APIPort)=> {
        return await editAirAPI(params);
    }, []);

    // TODO: 删除港口
    const deleteAir = useCallback(async (params: APIPort)=> {
        return await deleteAirAPI(params);
    }, []);

    // TODO: 启用禁用港口
    const operateAir = useCallback(async (params: APIPort)=> {
        return await operateAirAPI(params);
    }, []);
    //endregion

    //region TODO: 获取陆运站点列表
    const queryLand = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryLandAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增港口
    const addLand = useCallback(async (params: APIPort)=> {
        return await addLandAPI(params);
    }, []);

    // TODO: 编辑港口
    const editLand = useCallback(async (params: APIPort)=> {
        return await editLandAPI(params);
    }, []);

    // TODO: 删除港口
    const deleteLand = useCallback(async (params: APIPort)=> {
        return await deleteLandAPI(params);
    }, []);

    // TODO: 启用禁用港口
    const operateLand = useCallback(async (params: APIPort)=> {
        return await operateLandAPI(params);
    }, []);
    //endregion

    //region TODO: 获取贸易地点列表
    const queryTradePlace = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryTradePlaceAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增港口
    const addTradePlace = useCallback(async (params: APIPort)=> {
        return await addTradePlaceAPI(params);
    }, []);

    // TODO: 编辑港口
    const editTradePlace = useCallback(async (params: APIPort)=> {
        return await editTradePlaceAPI(params);
    }, []);

    // TODO: 删除港口
    const deleteTradePlace = useCallback(async (params: APIPort)=> {
        return await deleteTradePlaceAPI(params);
    }, []);

    // TODO: 启用禁用港口
    const operateTradePlace = useCallback(async (params: APIPort)=> {
        return await operateTradePlaceAPI(params);
    }, []);
    //endregion

    return {
        querySea, addSea, editSea, deleteSea, operateSea,
        queryAir, addAir, editAir, deleteAir, operateAir,
        queryLand, addLand, editLand, deleteLand, operateLand,
        queryTradePlace, addTradePlace, editTradePlace, deleteTradePlace, operateTradePlace,
    }
}