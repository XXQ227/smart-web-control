import type React from "react";
import {useCallback, useState} from "react";
import {DelTempByID, GetCGTempList, GetVOByID, SaveCGTemp} from '@/services/smart/manager/charge-template'
import {getLabel$Value, getTableDataFormat} from '@/utils/units'

type CGTempItems = APIManager.CGTempItems;
type APIValue$Label = API.APIValue$Label;


interface T {
}


export default (callback: T, deps: React.DependencyList) => {
    // TODO: 基础数据
    //endregion

    // TODO: 单票详情
    const [CGTempList, setCGTempList] = useState([]);
    const [CGTempInfo, setCGTempInfo] = useState({});
    const [CurrencyList, setCurrencyList] = useState<any[]>([]);
    const [PayMethodList, setPayMethodList] = useState<any[]>([]);
    const [ARInvoTypeList, setARInvoTypeList] = useState<any[]>([]);
    const [APInvoTypeList, setAPInvoTypeList] = useState<any[]>([]);
    const [ARList, setARList] = useState<CGTempItems[]>([]);
    const [APList, setAPList] = useState<CGTempItems[]>([]);
    const [PurposeOfCallList, setPurposeOfCallList] = useState<any[]>([]);
    const [ServicesList, setServicesList] = useState<any[]>([]);

    //region TODO: 接口
    // TODO: 获取费用模板列表
    const getCGTempList = useCallback(async (params: APIManager.SearchCGTempParams) => {
        // TODO: 请求后台 API
        const response: any = await GetCGTempList(params);
        if (!response) return;
        if(response.Result) setCGTempList(response.Content);
        return getTableDataFormat(response);
    }, []);


    // TODO: 获取模板详情信息
    const getVOByID = useCallback(async (params: APIManager.CGTempByIDParams) => {
        // TODO: 请求后台 API
        const response = await GetVOByID(params);
        if (!response) return;
        const currencyArr: APIValue$Label[] = getLabel$Value(response.CurrencyOpts);
        const payMethodArr: APIValue$Label[] = getLabel$Value(response.PayMethodOpts);
        const arInvoTypeArr: APIValue$Label[] = getLabel$Value(response.RInvoTypeOpts);
        const apInvoTypeArr: APIValue$Label[] = getLabel$Value(response.PInvoTypeOpts);
        const servicesArr: APIValue$Label[] = getLabel$Value(response.ServicesList, 'ID', 'NameEN');
        const purposeofCallArr: APIValue$Label[] = getLabel$Value(response.PurposeofCallList, 'ID', 'NameEN');
        let arCGArr: CGTempItems[] = [], apCGArr: CGTempItems[] = [];
        if(response.CGTempDetailDto) {
            arCGArr = response.CGTempDetailDto.CGTempItems?.filter((x: CGTempItems)=> x.CGTypeID === 1) || [];
            apCGArr = response.CGTempDetailDto.CGTempItems?.filter((x: CGTempItems)=> x.CGTypeID === 2) || [];
            response.CGTempDetailDto.ARList = arCGArr || [];
            response.CGTempDetailDto.APList = apCGArr || [];
        }
        const result = {
            CGTempVO: response.CGTempDetailDto,
            CurrencyList: currencyArr,
            PayMethodList: payMethodArr,
            PurposeOfCallList: purposeofCallArr,
            ServicesList: servicesArr,
            RInvoTypeOpts: arInvoTypeArr,
            PInvoTypeOpts: apInvoTypeArr,
            ARList: arCGArr,
            APList: apCGArr,
        }
        setCGTempInfo(response.CGTempDetailDto || {});
        setCurrencyList(currencyArr);
        setPayMethodList(payMethodArr);
        setARInvoTypeList(arInvoTypeArr);
        setAPInvoTypeList(apInvoTypeArr);
        setARList(arCGArr);
        setAPList(apCGArr);
        setPurposeOfCallList(purposeofCallArr);
        setServicesList(servicesArr);
        return result;
    }, []);

    // TODO: 删除费用模板
    const delTempByID = useCallback(async (params: { ID: number})=> {
        // TODO: 请求后台 API
        const response = await DelTempByID(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 删除费用模板
    const saveCGTemp = useCallback(async (params: APIManager.SaveCGItem)=> {
        // TODO: 请求后台 API
        const response = await SaveCGTemp(params);
        if (!response) return;
        return response;
    }, []);


    return {
        getCGTempList,
        CGTempList,
        getVOByID,
        CGTempInfo,
        CurrencyList,
        PayMethodList,
        ARInvoTypeList,
        APInvoTypeList,
        ARList,
        APList,
        PurposeOfCallList,
        ServicesList,
        delTempByID,
        saveCGTemp,
    }
}