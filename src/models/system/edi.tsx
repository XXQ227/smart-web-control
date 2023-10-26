import {useCallback, useState} from "react";
import {addEDIAPI, deleteEDIAPI, editEDIAPI, operateEDIAPI, queryEDIAPI, queryEDIInfoAPI} from '@/services/smart/system/edi'

type APIEDI = APISystem.EDI;

export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: 数据
    const [EDIList, setEDIList] = useState<APIEDI[]>([]);

    //region TODO: 接口
    // TODO: 获取部门列表<详细数据>请求
    const queryEDI = useCallback(async (params: APISystem.SearchEDIParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryEDIAPI(params);
        if (!response) return;
        setEDIList(response.data);
        return response;
    }, []);

    /** 添加用户 */
    const addEDI = useCallback(async (params: APIEDI) => {
        return await addEDIAPI(params);
    }, []);

    /** 添加用户 */
    const queryEDIInfo = useCallback(async (params: APIEDI) => {
        return await queryEDIInfoAPI(params);
    }, []);

    /** 编辑用户 */
    const editEDI = useCallback(async (params: APIEDI) => {
        return await editEDIAPI(params);
    }, []);

    /** 删除用户 */
    const deleteEDI = useCallback(async (params: APIEDI) => {
        return await deleteEDIAPI(params);
    }, []);

    /** 操作用户 */
    const operateEDI = useCallback(async (params: APIEDI) => {
        return await operateEDIAPI(params);
    }, []);


    return {
        queryEDI,
        EDIList,
        addEDI,
        queryEDIInfo,
        editEDI,
        deleteEDI,
        operateEDI,
    }
}