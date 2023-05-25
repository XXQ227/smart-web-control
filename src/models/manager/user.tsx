import type React from "react";
import {useCallback, useState} from "react";
import {queryUser} from '@/services/smart/manager/users'

type APIDepartment = APIManager.Department;

interface T {
    DepartmentList: APIDepartment[],
    DepartmentInfo: APIDepartment,
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据

    //endregion

    // TODO: Department List 数据
    //region TODO: 接口
    // TODO: 获取部门列表<详细数据>请求
    const queryUserList = useCallback(async (params: APIManager.SearchUserParams) => {
        // TODO: 请求后台 API
        const response = await queryUser(params);
        if (!response) return;
        return response;
    }, []);


    return {
        queryUserList,
    }
}