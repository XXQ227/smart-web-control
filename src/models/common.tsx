import {useCallback, useState} from "react";
import {
    queryDictCommonAPI, queryDictDetailCommonAPI
} from '@/services/smart/common'



export default () => {
    // TODO: Service 数据 ==> 用于费用模板处
    const [ServicesList, setServicesList] = useState([]);
    const [PurposeOfCallList, setPurposeOfCallList] = useState([]);
    const [PayMethodList, setPayMethodList] = useState([]);
    const [CurrencyList, setCurrencyList] = useState<any[]>([]);
    const [BusinessLineList, setBusinessLineList] = useState([]);
    const [IndustryList, setIndustryList] = useState([]);
    const [VendorTypeList, setVendorTypeList] = useState([]);

    //region TODO: 接口
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
                    default: break;
                }
            })
        }
    }, []);

    // TODO: 获取字典详情(通用接口)
    const queryDictDetailCommon = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response = await queryDictDetailCommonAPI(params);
        if (!response) return;
        console.log(response);
    }, []);


    return {
        queryDictCommon,
        queryDictDetailCommon,
        ServicesList,
        PurposeOfCallList,
        PayMethodList,
        CurrencyList,
        BusinessLineList,
        IndustryList,
        VendorTypeList,
    }
}