import {useCallback} from "react";
import {createInvoiceAPI, queryPendingInvoicingChargesAPI} from '@/services/smart/accounting/invoice'



export default () => {
    // TODO: 基础数据

    //region TODO: 接口

    // TODO: 查询待开票费用
    //   POST /accounting/web/invoice/queryPendingInvoicingCharges
    //   API ID:106401292
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-106401292
    const queryPendingInvoicingCharges = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await queryPendingInvoicingChargesAPI(params);
    }, []);
    //endregion


    // TODO: 查询待开票费用
    //   POST /accounting/web/invoice/queryPendingInvoicingCharges
    //   API ID:106401292
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-106401292
    const createInvoice = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await createInvoiceAPI(params);
    }, []);
    //endregion

    return {
        queryPendingInvoicingCharges,
        createInvoice,
    }
}