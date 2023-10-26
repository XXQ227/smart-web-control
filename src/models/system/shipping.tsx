import {useCallback} from "react";
import {
    addLineAPI,
    addVesselAPI,
    addVoyageAPI, deleteLineAPI, deleteVesselAPI,
    deleteVoyageAPI, editLineAPI, editVesselAPI,
    editVoyageAPI, operateLineAPI, operateVesselAPI,
    operateVoyageAPI, queryLineAPI, queryVesselAPI,
    queryVoyageAPI, queryVoyageInfoAPI
} from "@/services/smart/system/shipping";

type APIVoyage = APISystem.Voyage;
type APIVessel = APISystem.Vessel;
type APILine = APISystem.Line;

export default () => {

    //region TODO: 查询 航次 列表
    const queryVoyage = useCallback(async (params: APISystem.SearchShippingParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryVoyageAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 获取 项目 详情
    const queryVoyageInfo = useCallback(async (params: {id: string})=> {
        return await queryVoyageInfoAPI(params);
    }, [])

    // TODO: 增加航次
    const addVoyage = useCallback(async (params: APIVoyage)=> {
        return await addVoyageAPI(params);
    }, []);

    // TODO: 编辑航次
    const editVoyage = useCallback(async (params: APIVoyage)=> {
        return await editVoyageAPI(params);
    }, []);

    // TODO: 删除航次
    const deleteVoyage = useCallback(async (params: APIVoyage)=> {
        return await deleteVoyageAPI(params);
    }, []);

    // TODO: 启用禁用航次
    const operateVoyage = useCallback(async (params: APIVoyage)=> {
        return await operateVoyageAPI(params);
    }, []);
    //endregion

    // region TODO: 查询 船舶 列表
    const queryVessel = useCallback(async (params: APISystem.SearchShippingParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryVesselAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增船舶
    const addVessel = useCallback(async (params: APIVessel)=> {
        return await addVesselAPI(params);
    }, []);

    // TODO: 编辑船舶
    const editVessel = useCallback(async (params: APIVessel)=> {
        return await editVesselAPI(params);
    }, []);

    // TODO: 删除船舶
    const deleteVessel = useCallback(async (params: APIVessel)=> {
        return await deleteVesselAPI(params);
    }, []);

    // TODO: 启用禁用船舶
    const operateVessel = useCallback(async (params: APIVessel)=> {
        return await operateVesselAPI(params);
    }, []);
    //endregion

    // region TODO: 查询 航线 列表
    const queryLine = useCallback(async (params: APISystem.SearchShippingParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryLineAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增航线
    const addLine = useCallback(async (params: APILine)=> {
        return await addLineAPI(params);
    }, []);

    // TODO: 编辑航线
    const editLine = useCallback(async (params: APILine)=> {
        return await editLineAPI(params);
    }, []);

    // TODO: 删除航线
    const deleteLine = useCallback(async (params: APILine)=> {
        return await deleteLineAPI(params);
    }, []);

    // TODO: 启用禁用航线
    const operateLine = useCallback(async (params: APILine)=> {
        return await operateLineAPI(params);
    }, []);
    //endregion

    return {
        queryVoyage, queryVoyageInfo, addVoyage, editVoyage, deleteVoyage, operateVoyage,
        queryVessel, addVessel, editVessel, deleteVessel, operateVessel,
        queryLine, addLine, editLine, deleteLine, operateLine,
    }
}