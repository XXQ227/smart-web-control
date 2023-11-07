import {useCallback, useState} from "react";
import {
    queryBranchCurrencyCommonAPI,
    queryDepartmentCommonAPI,
    queryBankNumCommonAPI,
    queryDictCommonAPI, queryDictDetailCommonAPI, queryInvoiceTypeCommonAPI
} from '@/services/smart/common'
import {queryAccountPeriodCommonAPI, queryStartAccountPeriodInfoAPI} from '@/services/smart/system/account'
import {getTransferDate} from '@/utils/units'



export default () => {
    // TODO: Service 数据 ==> 用于费用模板处
    const [ServicesList, setServicesList] = useState([]);
    const [DivisionList, setDivisionList] = useState([]);
    const [PurposeOfCallList, setPurposeOfCallList] = useState([]);
    const [PayMethodList, setPayMethodList] = useState([]);
    const [CurrencyList, setCurrencyList] = useState<any[]>([]);
    const [BusinessLineList, setBusinessLineList] = useState([]);
    const [IndustryList, setIndustryList] = useState([]);
    const [VendorTypeList, setVendorTypeList] = useState([]);
    const [CTNModelList, setCTNModelList] = useState([]);
    const [AccountPeriodList, setAccountPeriodList] = useState([]);
    const [InvoTypeList, setInvoTypeList] = useState([]);
    const [BranchCurrency, setBranchCurrency] = useState([]);
    const [funcCurrencyName, setFuncCurrencyName] = useState('');
    const [bankAccountList, setBankAccountList] = useState([]);

    // TODO: 获取字典数据
    const queryDictCommon = useCallback(async (params: {dictCodes: any}) => {
        // TODO: 请求后台 API
        const response = await queryDictCommonAPI(params);
        if (!response) return;
        if (response.data?.length > 0) {
            response.data.map((item: any) => {
                switch (item.dictCode) {
                    case 'services':
                        setServicesList(item.data);
                        break;
                    case 'purpose_of_call':
                        setPurposeOfCallList(item.data);
                        break;
                    case 'currency':
                        if (item.data?.length > 0) {
                            const currResult: any[] = item.data.map((curr: any)=>
                                ({value: curr.label, label: curr.label}));
                            setCurrencyList(currResult);
                        }
                        break;
                    case 'pay_method':
                        setPayMethodList(item.data);
                        break;
                    case 'business_line':
                        setBusinessLineList(item.data);
                        break;
                    case 'industry':
                        setIndustryList(item.data);
                        break;
                    case 'vendor_type':
                        setVendorTypeList(item.data);
                        break;
                    case 'ctn_model':
                        setCTNModelList(item.data);
                        break;
                    default: break;
                }
            })
        }
    }, []);


    // TODO: 获取字典数据
    const queryDictCommonReturn = useCallback(async (params: {dictCodes: any}) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryDictCommonAPI(params);
        if (!response) return;
        if (response.success) {
            return response.data
        } else {
            return [];
        }
    }, []);

    // TODO: 获取字典详情(通用接口)
    const queryDictDetailCommon = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await queryDictDetailCommonAPI(params);
        if (!response) return;
    }, []);


    // TODO: 通用账期查询
    // POST /base/web/accountPeriod/queryAccountPeriodCommon
    // API ID:98908726
    // API URL:https://app.apifox.com/project/2684231/apis/api-98908726
    const queryAccountPeriodCommon = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryAccountPeriodCommonAPI(params);
        if (!response) return;
        if (response.success) {
            if (response.data?.length > 0) {
                const accountArr: any = response.data.slice(0).map((item: any)=> {
                    item.oldLabel = item.label;
                    item.label = getTransferDate(item.label) + (item.type === 2 ? '(APPEND)' : '');
                    return item;
                });
                setAccountPeriodList(accountArr);
            }
        }
    }, []);

    // TODO: 查询当前开启账期
    // POST /base/web/accountPeriod/queryStartAccountPeriodInfo
    // API ID:100610076
    // API URL:https://app.apifox.com/project/2684231/apis/api-100610076
    const queryStartAccountPeriodInfo = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await queryStartAccountPeriodInfoAPI(params);
        if (!response) return;
        return response;
    }, []);

    // TODO: 获取发票类型通用信息
    // POST /base/web/invoiceType/queryInvoiceTypeCommon
    // API ID:89997977
    // API URL:https://app.apifox.com/project/2684231/apis/api-89997977
    const queryInvoiceTypeCommon = useCallback(async (params: {name: string, branchId: any}) => {
        // TODO: 请求后台 API
        const response = await queryInvoiceTypeCommonAPI(params);
        if (!response) return;
        if (response.success) {
            setInvoTypeList(response.data || []);
        }
    }, []);

    // TODO: 查询公司币种通用列表
    // POST /base/web/branch/queryBranchCurrencyCommon
    // API ID:113532987
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-113532987
    const queryBranchCurrencyCommon = useCallback(async (params: {name: string, branchId: any}) => {
        // TODO: 请求后台 API
        const response = await queryBranchCurrencyCommonAPI(params);
        if (!response) return;
        if (response.success) {
            setBranchCurrency(response?.data?.branchCurrencies || []);
            setFuncCurrencyName(response?.data?.funcCurrencyName);
        }
    }, []);

    // TODO: 查询部门通用列表
    // POST /base/web/department/queryDepartmentCommon
    // API ID:91943884
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-91943884
    const queryDepartmentCommon = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await queryDepartmentCommonAPI(params);
        if (!response) return;
        if (response.success) {
            setDivisionList(response.data || []);
        }
    }, []);

    // TODO: 查询银行账户信息
    // POST /base/web/bankAccount/queryBankNumCommon
    // API ID:121211594
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-121211594
    const queryBankNumCommon = useCallback(async (params: {branchId: any, bankCurrencyName: string}) => {
        // TODO: 请求后台 API
        const response = await queryBankNumCommonAPI(params);
        if (!response) return;
        if (response.success) {
            setBankAccountList(response?.data || [])
        }
        return response;
    }, []);

    return {
        queryDictCommon,
        queryDictCommonReturn,
        queryDictDetailCommon,
        ServicesList,
        PurposeOfCallList,
        PayMethodList,
        CurrencyList,
        BusinessLineList,
        IndustryList,
        VendorTypeList,
        CTNModelList,
        queryAccountPeriodCommon,
        AccountPeriodList,
        queryStartAccountPeriodInfo,
        queryInvoiceTypeCommon,
        InvoTypeList,
        queryBranchCurrencyCommon,
        BranchCurrency,
        funcCurrencyName,
        queryDepartmentCommon,
        DivisionList,
        queryBankNumCommon,
        bankAccountList,
    }
}