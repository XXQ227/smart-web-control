import {GetAPList, GetDetailByID,} from '@/services/smart/manager/account';
import type React from "react";
import {useCallback, useState} from "react";


interface T {

}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据

    //endregion

    // TODO: 单票详情
    const [AccountList, setAccountList] = useState<APIManager.AccountList[]>([]);
    const [CurrencyList, setCurrencyList] = useState<APIManager.APCurrency[]>([]);
    const [AccountPeriod, setAccountPeriod] = useState<APIManager.AccountPeriodResult>({
        AccountPeriod: {
            AccountMouth: '',
            BranchID: null,
            CNYRate: null,
            EndDate: '',
            ErrorMes: '',
            ExRates: [],
            ID: null,
            PeriodCode: '',
            StartDate: '',
            State: null,
            StateName: '',
            Type: null,
        },
    });

    //region TODO: 接口
    // TODO: 获取账期集合请求
    const getAPList = useCallback(async (params: {UserID: number, Year: string}) => {
        // TODO: 请求后台 API
        const response = await GetAPList(params);
        if (!response) return;
        const result: APIManager.AccountResult = {
            success: response.Result,
            total: response.Page?.ItemTotal,
            data: response.Content?.AccountPriodList,
        }
        setCurrencyList(response.Content?.Currencys);
        setAccountList(response.Content?.AccountPriodList);
        return result;
    }, []);

    // TODO: 获取账期详情请求
    const getDetailByID = useCallback(async (params: {UserID: number, ID: number}) => {
        // TODO: 请求后台 API
        const response = await GetDetailByID(params);
        if (!response) return;
        setAccountPeriod(response)
    }, []);


    return {
        getAPList,
        AccountList,
        CurrencyList,
        getDetailByID,
        AccountPeriod,
    }
}