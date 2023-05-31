import type React from "react";
import {useCallback, useState} from "react";
import {GetBranchList, GetBranchInfo, addBranchAPI} from '@/services/smart/manager/branch'

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
        address: 'UNIT F & G, 20/F., MG TOWER, 133 HOI BUN ROAD, KWUN TONG, HONG KONG',
        bankAccountIds: '',
        cityName: '',
        code: '0829683',
        contactName: '凌根华',
        createTime: '',
        createUserId: undefined,
        createUserName: '',
        defaultPortId: undefined,
        deleteFlag: '',
        enableFlag: '',
        funcCurrencyName: '',
        id: null,
        nameFullEn: 'SINOTRANS (HK) LOGISTICS LIMITED',
        nameFullLocal: '中國外運(香港)控股有限公司',
        nameShortEn: 'SHK LOG',
        nameShortLocal: '外运香港',
        orgCreateId: '100687',
        orgId: '1513',
        phone: '62891222',
        taxNum: '0829683',
        updateTime: '',
        updateUserId: undefined,
        updateUserName: ''
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

    const addBranch = useCallback(async (params: APIBranch)=> {
        return await addBranchAPI(params);
    }, [])

    return {
        getBranchList,
        BranchList,
        getBranchInfo,
        BranchInfo,
        addBranch,
    }
}