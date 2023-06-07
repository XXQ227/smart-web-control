import {useCallback, useState} from "react";
import {queryProjectAPI, queryProjectInfoAPI} from "@/services/smart/manager/project";

type APIProject = APIManager.Project;

export default () => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    const [ProjectList, setProjectList] = useState<APIProject[]>([]);

    //region TODO: 接口
    // TODO: 获取 项目 列表
    const queryProject = useCallback(async (params: APIManager.SearchPortParams) => {
        const response: API.Result = await queryProjectAPI(params);
        if (!response) return;
        setProjectList(response.data);
        return response;
    }, []);

    // TODO: 获取 项目 详情
    const queryProjectInfo = useCallback(async (params: {id: string})=> {
        return await queryProjectInfoAPI(params);
    }, [])


    return {
        ProjectList,
        queryProject,

        queryProjectInfo,
    }
}