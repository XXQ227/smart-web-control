import {useCallback, useState} from "react";
import {
    queryProjectAPI,
    queryProjectInfoAPI,
    addProjectAPI,
    editProjectAPI,
    deleteProjectAPI,
    operateProjectAPI
} from "@/services/smart/manager/project";

type APIProject = APIManager.Project;

export default () => {
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
        const response: API.Result = await queryProjectInfoAPI(params);
        if (!response) return;
        const data: any = response.data || {};
        if (response.success) {
            const portion: string[] = [];
            if (data.portionAFlag === 1) {
                portion.push('A');
            }
            if (data.portionBFlag === 1) {
                portion.push('B');
            }
            if (data.portionCFlag === 1) {
                portion.push('C');
            }
            data.portion = portion
        }
        delete response.code;
        return response;
    }, [])

    // TODO: 新增项目
    const addProject = useCallback(async (params: APIProject)=> {
        return await addProjectAPI(params);
    }, [])

    // TODO: 编辑项目
    const editProject = useCallback(async (params: APIProject)=> {
        return await editProjectAPI(params);
    }, [])

    // TODO: 删除项目
    const deleteProject = useCallback(async (params: APIProject)=> {
        return await deleteProjectAPI(params);
    }, [])

    // TODO: 启用禁用项目
    const operateProject = useCallback(async (params: APIProject)=> {
        return await operateProjectAPI(params);
    }, [])

    return {
        ProjectList,
        queryProject,
        queryProjectInfo,
        addProject,
        editProject,
        deleteProject,
        operateProject
    }
}