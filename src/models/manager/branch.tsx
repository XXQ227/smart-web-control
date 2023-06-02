import {useCallback, useState} from "react";
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
    // TODO: 基础数据

    //endregion

    // TODO: Branch List 数据
    const [BranchList, setBranchList] = useState<APIBranch[]>([]);

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const queryBranch = useCallback(async (params: APIManager.SearchBranchParams) => {
        // TODO: 请求后台 API
        const response = await queryBranchAPI(params);
        if (!response) return;
        setBranchList(response.data);
        return response;
    }, []);

    // TODO: 添加银行公司
    const addBranch = useCallback(async (params: APIBranch)=> {
        return await addBranchAPI(params);
    }, [])

    // TODO: 获取 Branch 详情
    const queryBranchInfo = useCallback(async (params: {id: string})=> {
        // TODO: 请求后台 API
        return await queryBranchInfoAPI(params);
    }, [])

    // TODO: 获取 Branch 详情
    const editBranch = useCallback(async (params: APIBranch)=> {
        return await editBranchAPI(params);
    }, [])

    // TODO: 获取 Branch 详情
    const deleteBranch = useCallback(async (params: APIBranch)=> {
        return await deleteBranchAPI(params);
    }, [])

    // TODO: 获取 Branch 详情
    const operateBranch = useCallback(async (params: APIBranch)=> {
        return await operateBranchAPI(params);
    }, [])

    return {
        queryBranch,
        BranchList,
        addBranch,
        queryBranchInfo,
        editBranch,
        deleteBranch,
        operateBranch,
    }
}