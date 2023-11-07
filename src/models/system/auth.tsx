import {useCallback} from "react";
import {
    addAuthResourceAPI,
    deleteAuthResourceAPI,
    editAuthResourceAPI,
    queryAuthResourceTreeAPI,
    queryRoleAPI,
    addRoleAPI,
    deleteRoleAPI,
    editRoleAPI,
    iamUserOrganizationConvertAPI,
    operateRoleAPI,
    queryRoleInfoAPI, queryRoleByUserAPI,
} from '@/services/smart/system/auth'
import {getChildrenListData} from '@/utils/units'

type APIAuthResource = APISystem.AuthResource;
type APIRole = APISystem.Role;

export default () => {
    // TODO: 基础数据

    //endregion

    //region TODO: 权限接口
    // TODO: 获取 权限 列表请求
    const queryAuthResourceTree = useCallback(async (params: APISystem.SearchAuthResourceParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryAuthResourceTreeAPI(params);
        if (!response) return;
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

    //region TODO: 角色接口
    // TODO: 获取 权限 列表请求
    const queryRole = useCallback(async (params: APISystem.SearchRoleParams) => {
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

    /** 查询角色对应的权限详情 */
    const queryRoleInfo = useCallback(async (params: APIRole) => {
        return await queryRoleInfoAPI(params);
    }, []);

    /** 编辑 权限  */
    const editRole = useCallback(async (params: APIRole) => {
        return await editRoleAPI(params);
    }, []);

    /** 删除 权限  */
    const deleteRole = useCallback(async (params: APIRole) => {
        return await deleteRoleAPI(params);
    }, []);

    /** 删除 权限  */
    const operateRole = useCallback(async (params: APIRole) => {
        return await operateRoleAPI(params);
    }, []);


    /** 查询用户对应角色和角色列表
     POST /base/web/role/queryRoleByUser
     接口ID：122434839
     接口地址：https://app.apifox.com/link/project/2684231/apis/api-122434839 */
    const queryRoleByUser = useCallback(async (params: APIRole) => {
        return await queryRoleByUserAPI(params);
    }, []);

    /** 切换公司组织  */
    const iamUserOrganizationConvert = useCallback(async (params: APIRole) => {
        return await iamUserOrganizationConvertAPI(params);
    }, []);




    return {
        queryAuthResourceTree,
        addAuthResource,
        editAuthResource,
        deleteAuthResource,

        queryRole,
        queryRoleInfo,
        addRole,
        editRole,
        deleteRole,
        operateRole,

        queryRoleByUser,

        iamUserOrganizationConvert,
    }
}
