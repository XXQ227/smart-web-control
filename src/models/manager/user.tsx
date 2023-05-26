import {useCallback, useState} from "react";
import {queryUser} from '@/services/smart/manager/users'

type APIUser = APIManager.User;

export default () => {
    // TODO: 基础数据

    //endregion

    // TODO: 数据
    const [UserList, setUserList] = useState<APIUser[]>([]);
    //region TODO: 接口
    // TODO: 获取部门列表<详细数据>请求
    const queryUserList = useCallback(async (params: APIManager.SearchUserParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryUser(params);
        if (!response) return;
        setUserList(response.data);
        return response;
    }, []);


    return {
        queryUserList,
        UserList,
    }
}