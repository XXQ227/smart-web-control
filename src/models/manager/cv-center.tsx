import {
    GetCTPByStr,
    GetCTPByID,
    UploadCTCenter,
    addBusinessUnitAPI,
    queryBusinessUnitPropertyInfoAPI, addBusinessUnitPropertyAPI, queryBusinessUnitPropertyAPI
} from '@/services/smart/manager/cv-center';
import type React from "react";
import {useCallback, useState} from "react";
import {getLabel$Value, getTransIndustryListToLine} from '@/utils/units'

type APIBUInfo = APIManager.BUInfo;
type APIBUP = APIManager.BUP;
type APICTTypeItemList = APIManager.CTTypeItemList[];
type APICustomerProperty = APIManager.CustomerProperty[];
type APIBusinessLine = APIManager.BusinessLine[];
type APIIndustrys = APIManager.Industrys[];
type APIIndustrysTreeSelect = APIManager.IndustrysTreeSelect[][];

interface T {
    CVInfoList: APIBUInfo[],
    BUInfo: APIBUInfo,
    CustomerTypeList: APICTTypeItemList,
    VendorTypeList: APICTTypeItemList,
    IndustryList: APIIndustrys,
    CustomerPropertyList: APICustomerProperty,
    BusinessLineList: APIBusinessLine,
}

export default (callback: T, deps: React.DependencyList) => {
    // TODO: 单票详情
    /* TODO: 客户列表*/     const [CVInfoList, setCVInfoList] = useState<APIBUInfo[]>([]);
    /* TODO: CV 详情数据*/ const cvInfo: APIBUInfo = {
        ID: null,
        CTPID: null,
        CTTypeItem: '',
        CustSupCode: '',
        Freezen: null,
        NameFull: '',
        NameFullEN: '',
        Address: '',
        OracleID: '',
        OracleIDSupplier: '',
        Settlement: null,
        TaxCode: '',
        BusinessLine: '',
        BusinessLineList: [],
        CustomerPropertyID: null,
        CTTypeItemClient: null,
        CTTypeItemIDClient: null,
        CTTypeItemListSupplier: null,
        CTList: [],
    };
    /* TODO: CV 详情数据*/  const [BUInfo, setCVInfo] = useState<APIBUInfo>(cvInfo);
    /* TODO: 客户*/   const [CustomerTypeList, setCustomerTypeList] = useState<APICTTypeItemList>([]);
    /* TODO: 供应商*/  const [VendorTypeList, setVendorTypeList] = useState<APICTTypeItemList>([]);
    /* TODO: 行业*/   const [IndustryList, setIndustryList] = useState<APIIndustrysTreeSelect>([]);
    /* TODO: 客户属性*/ const [CustomerPropertyList, setCustomerPropertyList] = useState<APICustomerProperty>([]);
    /* TODO: 业务线*/  const [BusinessLineList, setBusinessLineList] = useState<APIBusinessLine>([]);

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getGetCTPByStr = useCallback(async (params: APIManager.CVSearchParams) => {
        // TODO: 请求后台 API
        const response: any = await GetCTPByStr(params);
        if (!response) return;
        // TODO: 定义返回结果
        const result: APIManager.CVResultInfo = {
            success: true,
            total: response.Page?.ItemTotal,
            data: response.Content,
        };
        setCVInfoList(result.data);
        return result;
    }, []);


    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const getGetCTPByID = useCallback(async (params: APIManager.GetCVInfoParams) => {
        // TODO: 请求后台 API
        const response: APIManager.GetCVInfoResult = await GetCTPByID(params);
        if (!response) return;
        const ctDetailInfo: APIBUInfo = response.CTDetailDto;
        if (ctDetailInfo.BusinessLine) {
            const blArr: string[] = ctDetailInfo.BusinessLine?.split(',');
            const blList: number[] = [];
            blArr?.map((x: any)=> {
                blList.push(Number(x));
            });
            ctDetailInfo.BusinessLineList = blList;
        }
        setCVInfo(response.CTDetailDto);
        if(response.CTTypeOpts?.length > 0) {
            const customerArr: APICTTypeItemList = getLabel$Value(response.CTTypeOpts[0]?.CTTypeItemList, 'ID', 'NameEN');
            const vendorArr: APICTTypeItemList = getLabel$Value(response.CTTypeOpts[1]?.CTTypeItemList, 'ID', 'NameEN');
            const customerPropertyArr: APICustomerProperty = getLabel$Value(response.CustomerPropertyList, 'Key', 'NameEN');
            const businessLineArr: APIBusinessLine = getLabel$Value(response.BusinessLine, 'ID', 'NameEN');
            // TODO: 客户行业数据
            const industryArr: APIIndustrysTreeSelect = [];
            if (response.Industrys?.length > 0) {
                const SupplyChainIndustryList: APIIndustrysTreeSelect = getTransIndustryListToLine(response.Industrys.filter((x: any) => x.BizPlateType == 1), 1);
                const ProjectIndustryList: APIIndustrysTreeSelect = getTransIndustryListToLine(response.Industrys.filter((x: any) => x.BizPlateType == 2), 2);
                const ContractIndustryList: APIIndustrysTreeSelect = getTransIndustryListToLine(response.Industrys.filter((x: any) => x.BizPlateType == 3), 3);
                const ECommerceIndustryList: APIIndustrysTreeSelect = getTransIndustryListToLine(response.Industrys.filter((x: any) => x.BizPlateType == 4), 4);
                const OtherIndustryList: APIIndustrysTreeSelect = getTransIndustryListToLine(response.Industrys.filter((x: any) => x.BizPlateType == 5), 5);
                industryArr.push(...SupplyChainIndustryList, ...ProjectIndustryList, ...ContractIndustryList, ...ECommerceIndustryList, ...OtherIndustryList)
            }
            /* TODO: 客户*/   setCustomerTypeList(customerArr);
            /* TODO: 供应商*/  setVendorTypeList(vendorArr);
            /* TODO: 客户属性*/ setCustomerPropertyList(customerPropertyArr);
            /* TODO: 业务线*/  setBusinessLineList(businessLineArr);
            /* TODO: 行业*/   setIndustryList(industryArr);
        }
        return response.CTDetailDto;
    }, []);

    const uploadCTCenter = useCallback(async (params: any) => {
        const response: any = await UploadCTCenter(params);
        if (!response) return;
        return response;
    }, []);




    // TODO: 新增业务单位
    const addBusinessUnit = useCallback(async (params: APIBUInfo)=> {
        return await addBusinessUnitAPI(params);
    }, [])

    //region TODO: 业务单位属性 接口
    // TODO: 获取 业务单位属性 列表
    const queryBusinessUnitProperty = useCallback(async (params: APIManager.SearchBUPParams) => {
        const response = await queryBusinessUnitPropertyAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 新增业务单位属性
    const addBusinessUnitProperty = useCallback(async (params: APIBUP)=> {
        return await addBusinessUnitPropertyAPI(params);
    }, [])

    // TODO: 获取 业务单位属性 详情
    const queryBusinessUnitPropertyInfo = useCallback(async (params: APIBUP)=> {
        return await queryBusinessUnitPropertyInfoAPI(params);
    }, [])
    //endregion

    return {
        CVInfoList,
        getGetCTPByStr,

        getGetCTPByID,
        BUInfo,
        CustomerTypeList,
        VendorTypeList,
        IndustryList,
        CustomerPropertyList,
        BusinessLineList,
        uploadCTCenter,



        addBusinessUnit,
        queryBusinessUnitProperty,
        addBusinessUnitProperty,
        queryBusinessUnitPropertyInfo,
    }
}