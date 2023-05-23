import type React from "react";
import {useCallback, useState} from "react";
import {GetBranchList, GetBranchInfo} from '@/services/smart/manager/branch'

type APIBranch = APIManager.Branch;

interface T {
    BranchList: APIBranch[],
    BranchInfo: APIBranch,
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据

    //endregion

    // TODO: Branch List 数据
    const [BranchList, setBranchList] = useState<APIBranch[]>([]);
    const [BranchInfo, setBranchInfo] = useState<APIBranch>({
        address: '',
        bank_account_ids: '',
        city_name: '',
        code: '',
        contact_name: '',
        create_time: '',
        create_user_id: null,
        create_user_name: '',
        default_port_id: null,
        delete_flag: '',
        enable_flag: '',
        func_currency_name: '',
        id: null,
        name_full_en: '',
        name_full_local: '',
        name_short_en: '',
        name_short_local: '',
        org_create_id: null,
        org_id: null,
        phone: '',
        tax_num: '',
        update_time: '',
        update_user_id: null,
        update_user_name: ''
    });

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getBranchList = useCallback(async (params: APIManager.SearchBranchParams) => {
        // TODO: 请求后台 API
        const response = await GetBranchList(params);
        if (!response) return;
        const result: APIManager.BranchResult = {
            data: response.Content,
            success: response.Result,
            total: response.Page?.ItemTotal
        }
        setBranchList(response.Content);
        return result;
    }, []);

    const getBranchInfo = useCallback(async (params: {ID: number})=> {
        const response = await GetBranchInfo(params);
        setBranchInfo(response.Content);
        return response;
    }, [])

    return {
        getBranchList,
        BranchList,
        getBranchInfo,
        BranchInfo,
    }
}