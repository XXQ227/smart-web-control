import {useCallback} from "react";
import {
    addAuthResourceAPI, deleteAuthResourceAPI, editAuthResourceAPI, queryAuthResourceTreeAPI,
    queryRoleAPI, addRoleAPI, deleteRoleAPI, editRoleAPI,
} from '@/services/smart/manager/auth'

type APIAuthResource = APIManager.AuthResource;
type APIRole = APIManager.Role;

export default () => {
    // TODO: 基础数据

    //endregion

    //region TODO: 权限接口
    // TODO: 获取 权限 列表请求
    const queryAuthResourceTree = useCallback(async (params: APIManager.SearchAuthResourceParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryAuthResourceTreeAPI(params);
        if (!response) return;
        if (response?.data) response.data = getChildrenListData(response.data);
        if (Number(params.id) === 0) {
            return response;
        } else {
            let result: any = {};
            result = response.data[0];
            return result;
        }
    }, []);

    /** 添加 权限  */
    const addAuthResource = useCallback(async (params: APIAuthResource) => {
        return await addAuthResourceAPI(params);
    }, []);

    /** 编辑 权限  */
    const editAuthResource = useCallback(async (params: APIAuthResource) => {
        return await editAuthResourceAPI(params);
    }, []);

    /** 删除 权限  */
    const deleteAuthResource = useCallback(async (params: APIAuthResource) => {
        return await deleteAuthResourceAPI(params);
    }, []);

    //region TODO: 角色接口
    // TODO: 获取 权限 列表请求
    const queryRole = useCallback(async (params: APIManager.SearchRoleParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryRoleAPI(params);
        if (!response) return;
        if (response?.data) response.data = getChildrenListData(response.data);
        return response;
    }, []);

    /** 添加 权限  */
    const addRole = useCallback(async (params: APIRole) => {
        return await addRoleAPI(params);
    }, []);

    /** 编辑 权限  */
    const editRole = useCallback(async (params: APIRole) => {
        return await editRoleAPI(params);
    }, []);

    /** 删除 权限  */
    const deleteRole = useCallback(async (params: APIRole) => {
        return await deleteRoleAPI(params);
    }, []);


    return {
        queryAuthResourceTree,
        addAuthResource,
        editAuthResource,
        deleteAuthResource,
        queryRole,
        addRole,
        editRole,
        deleteRole,
    }
}

// TODO: 处理数据里的 children 子集，如果 children 没有数据时，则删除 children
function getChildrenListData (data: any[]) {
    let result: any[] = [];
    if (data?.length > 0) {
        result = data.map((x: any)=> {
            if (x.children?.length === 0) {
                delete x.children;
            } else if (x.children?.length > 0) {
                x.children = getChildrenListData(x.children);
            }
            return x;
        })
    }
    return result;
}