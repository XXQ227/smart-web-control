import {useCallback} from "react";
import {
    addBranchAPI,
    deleteBranchAPI,
    editBranchAPI,
    operateBranchAPI,
    queryBranchAPI,
    queryBranchInfoAPI
} from '@/services/smart/manager/branch'

type APIBranch = APIManager.Branch;

export default () => {

    //region TODO: 接口
    // TODO: 获取 公司 列表
    const queryBranch = useCallback(async (params: APIManager.SearchBranchParams) => {
        const response = await queryBranchAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 获取 公司 详情
    const queryBranchInfo = useCallback(async (params: APIBranch)=> {
        return await queryBranchInfoAPI(params);
    }, [])

    // TODO: 新增公司
    const addBranch = useCallback(async (params: APIBranch)=> {
        return await addBranchAPI(params);
    }, [])

    // TODO: 编辑公司
    const editBranch = useCallback(async (params: APIBranch)=> {
        return await editBranchAPI(params);
    }, [])

    // TODO: 删除公司
    const deleteBranch = useCallback(async (params: APIBranch)=> {
        return await deleteBranchAPI(params);
    }, [])

    // TODO: 启用禁用公司
    const operateBranch = useCallback(async (params: APIBranch)=> {
        return await operateBranchAPI(params);
    }, [])
    //endregion

    return {
        queryBranch,
        addBranch,
        queryBranchInfo,
        editBranch,
        deleteBranch,
        operateBranch,
    }
}