import type React from "react";
import {useCallback, useState} from "react";
import {GetDepartmentList, SaveDepartment} from '@/services/smart/manager/department'

type APIDepartment = APIManager.Department;

interface T {
    DepartmentList: APIDepartment[],
    DepartmentInfo: APIDepartment,
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据

    //endregion

    // TODO: Department List 数据
    const [DepartmentList, setDepartmentList] = useState<APIDepartment[]>([]);

    //region TODO: 接口
    // TODO: 获取部门列表<详细数据>请求
    const getDepartmentList = useCallback(async (params: APIManager.SearchDeptParams) => {
        // TODO: 请求后台 API
        const response = await GetDepartmentList(params);
        if (!response) return;
        const data: any = response.Content?.map((x: any)=> ({...x, id: x.ID}));
        const result: APIManager.DepartmentResult = {
            data: data,
            success: response.Result,
            total: response.Page?.ItemTotal
        }
        setDepartmentList(response.Content);
        return result;
    }, []);

    // TODO: 保存部门信息
    const saveDepartment = useCallback(async (params: APIManager.Department) => {
        // TODO: 请求后台 API
        const response = await SaveDepartment(params);
        if (!response) return;
        const result: APIManager.SaveDepartment = {
            id: response.Content,
            success: response.Result,
        }
        return result;
    }, []);

    return {
        getDepartmentList,
        DepartmentList,
        saveDepartment,
    }
}