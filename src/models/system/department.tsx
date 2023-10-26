import {useCallback} from "react";
import {
    queryDepartmentAPI, queryDepartmentInfoAPI, addDepartmentAPI,
    editDepartmentAPI, deleteDepartmentAPI, operateDepartmentAPI
} from '@/services/smart/system/department'

type APIDepartment = APISystem.Department;


export default () => {
    // TODO: 基础数据

    //endregion

    //region TODO: 接口
    // TODO: 获取费用模板列表
    const queryDepartment = useCallback(async (params: {name: string})=> {
        // TODO: 请求后台 API
        const response = await queryDepartmentAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 删除费用模板
    const addDepartment = useCallback(async (params: APIDepartment)=> {
        // TODO: 请求后台 API
        return await addDepartmentAPI(params);
    }, []);

    // TODO: 删除费用模板
    const queryDepartmentInfo = useCallback(async (params: APIDepartment)=> {
        // TODO: 请求后台 API
        return await queryDepartmentInfoAPI(params);
    }, []);

    // TODO: 删除费用模板
    const editDepartment = useCallback(async (params: APIDepartment)=> {
        // TODO: 请求后台 API
        return await editDepartmentAPI(params);
    }, []);

    // TODO: 删除费用模板
    const deleteDepartment = useCallback(async (params: APIDepartment)=> {
        // TODO: 请求后台 API
        return await deleteDepartmentAPI(params);
    }, []);

    // TODO: 删除费用模板
    const operateDepartment = useCallback(async (params: APIDepartment)=> {
        // TODO: 请求后台 API
        return await operateDepartmentAPI(params);
    }, []);
    //endregion

    return {
        queryDepartment, queryDepartmentInfo, addDepartment,
        editDepartment, deleteDepartment, operateDepartment
    }
}