import {useCallback, useState} from "react";
import {
    addInvoiceTypeAPI,
    deleteInvoiceTypeAPI,
    editInvoiceTypeAPI, operateInvoiceTypeAPI,
    queryInvoiceTypeAPI
} from "@/services/smart/system/invoiceType";

type APIInvoiceType = APISystem.InvoiceType;

export default () => {
    // TODO: 单票详情
    const [InvoiceTypeList, setInvoiceTypeList] = useState<APIInvoiceType[]>([]);

    //region TODO: 接口
    // TODO: 获取 发票类型 列表
    const queryInvoiceType = useCallback(async (params: APISystem.SearchPortParams) => {
        const response: API.Result = await queryInvoiceTypeAPI(params);
        if (!response) return;
        setInvoiceTypeList(response.data);
        return response;
    }, []);

    // TODO: 新增发票类型
    const addInvoiceType = useCallback(async (params: APIInvoiceType)=> {
        return await addInvoiceTypeAPI(params);
    }, [])

    // TODO: 编辑发票类型
    const editInvoiceType = useCallback(async (params: APIInvoiceType)=> {
        return await editInvoiceTypeAPI(params);
    }, [])

    // TODO: 删除发票类型
    const deleteInvoiceType = useCallback(async (params: APIInvoiceType)=> {
        return await deleteInvoiceTypeAPI(params);
    }, [])

    // TODO: 启用禁用发票类型
    const operateInvoiceType = useCallback(async (params: APIInvoiceType)=> {
        return await operateInvoiceTypeAPI(params);
    }, [])

    return {
        InvoiceTypeList,
        queryInvoiceType,
        addInvoiceType,
        editInvoiceType,
        deleteInvoiceType,
        operateInvoiceType,
    }
}