import {useCallback} from "react";
import {
    addAuthResourceAPI, deleteAuthResourceAPI, editAuthResourceAPI, queryAuthResourceTreeAPI
} from '@/services/smart/manager/auth'

type APIAuthResource = APIManager.AuthResource;

export default () => {
    // TODO: 基础数据

    //endregion

    //region TODO: 接口
    // TODO: 获取 权限 列表请求
    const queryAuthResourceTree = useCallback(async (params: APIManager.SearchAuthResourceParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryAuthResourceTreeAPI(params);
        if (!response) return;
        if (response?.data) response.data = getChildrenListData(response.data);
        return response;
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

    return {
        queryAuthResourceTree,
        addAuthResource,
        editAuthResource,
        deleteAuthResource,
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