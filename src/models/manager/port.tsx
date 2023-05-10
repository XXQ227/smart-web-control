import {GetPortList, GetPortByID} from '@/services/smart/manager/port';
import type React from "react";
import {useCallback, useState} from "react";

type APIPort = APIManager.Port;

interface T {
    PortList: APIPort[]
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    const [PortList, setPortList] = useState<APIPort[]>([]);
    const [PortInfo, setPortInfo] = useState<APIPort>({
        ID: null,
        Name: '',
        Code: '',
        CityID: null,
        CityName: '',
        CountryID: null,
        CountryName: '',
        Freezen: false,
        TransportTypeID: null,
        TransportTypeName: '',
    });

    //region TODO: 接口
    // TODO: 获取港口列表请求
    const getGetPortList = useCallback(async (params: APIManager.SearchPortParams) => {
        // TODO: 请求后台 API
        const response: any = await GetPortList(params);
        if (!response) return;
        const result: APIManager.PortResult = {
            success: response.Result,
            total: response.Page?.ItemTotal,
            data: response.Content,
        }
        setPortList(result.data);
        return result;
    }, []);

    // TODO: 获取港口详情请求
    const getGetPortByID = useCallback(async (params: { ID: number }) => {
        // TODO: 请求后台 API
        const response: any = await GetPortByID(params);
        if (!response) return;
        setPortInfo(response);
        return response;
    }, []);


    return {
        PortList,
        getGetPortList,
        PortInfo,
        getGetPortByID,
    }
}