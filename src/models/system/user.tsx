import {useCallback, useState} from "react";
import {
    addUserAPI,
    deleteUserAPI,
    editUserAPI,
    modifyPwdAPI,
    operateUserAPI,
    queryUserAPI, queryUserCommonAPI
} from '@/services/smart/system/users'

type APIUser = APISystem.User;

export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: 数据
    const [UserList, setUserList] = useState<APIUser[]>([]);

    // TODO: 销售数据
    const [SalesList, setSalesList] = useState<any[]>([]);

    //region TODO: 接口
    // TODO: 获取部门列表<详细数据>请求
    const queryUser = useCallback(async (params: APISystem.SearchUserParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryUserAPI(params);
        if (!response) return;
        setUserList(response.data);
        return response;
    }, []);

    /** 添加用户 */
    const addUser = useCallback(async (params: APIUser) => {
        return await addUserAPI(params);
    }, []);

    /** 编辑用户 */
    const editUser = useCallback(async (params: APIUser) => {
        return await editUserAPI(params);
    }, []);

    /** 删除用户 */
    const deleteUser = useCallback(async (params: APIUser) => {
        return await deleteUserAPI(params);
    }, []);

    /** 操作用户 */
    const operateUser = useCallback(async (params: APIUser) => {
        return await operateUserAPI(params);
    }, []);

    /** 修改密码 */
    const modifyPwd = useCallback(async (params: APIUser) => {
        return await modifyPwdAPI(params);
    }, []);

    /** 查询用户数据 */
    const queryUserCommon = useCallback(async (params: APIUser) => {
        const response: API.Result =  await queryUserCommonAPI(params);
        setSalesList(response.data);
    }, []);

    return {
        queryUser,
        UserList,
        addUser,
        editUser,
        deleteUser,
        operateUser,
        modifyPwd,

        queryUserCommon,
        SalesList,
    }
}