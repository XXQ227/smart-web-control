import {useCallback, useState} from "react";
import {
    addUserAPI,
    deleteUserAPI,
    editUserAPI,
    modifyPwdAPI,
    operateUserAPI,
    queryUserAPI
} from '@/services/smart/manager/users'

type APIUser = APIManager.User;

export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: 数据
    const [UserList, setUserList] = useState<APIUser[]>([]);

    //region TODO: 接口
    // TODO: 获取部门列表<详细数据>请求
    const queryUser = useCallback(async (params: APIManager.SearchUserParams) => {
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

    return {
        queryUser,
        UserList,
        addUser,
        editUser,
        deleteUser,
        operateUser,
        modifyPwd,
    }
}