import {useCallback, useState} from "react";
import {queryProjectAPI} from "@/services/smart/manager/project";

type APIProject = APIManager.Project;

export default () => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    const [ProjectList, setProjectList] = useState<APIProject[]>([]);

    //region TODO: 接口
    // TODO: 查询项目列表
    const queryProject = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryProjectAPI(params);
        if (!response) return;
        setProjectList(response.data);
        return response;
    }, []);


    return {
        ProjectList,
        queryProject,
    }
}