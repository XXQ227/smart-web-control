import {useCallback} from "react";
import {
    cancelInvoiceAPI,
    createInvoiceAPI,
    queryInvoiceDetailByIdAPI, queryInvoicesAPI,
    queryPendingInvoicingChargesAPI
} from '@/services/smart/accounting/invoice'



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

    // TODO: 查询发票列表
    //   POST /accounting/web/invoice/queryInvoices
    //   API ID:108243845
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108243845
    const queryInvoices = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await queryInvoicesAPI(params);
    }, []);

    // TODO: 查询发票详细信息
    //   POST /accounting/web/invoice/queryInvoiceDetailById
    //   API ID:108244197
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108244197
    const queryInvoiceDetailById = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await queryInvoiceDetailByIdAPI(params);
    }, []);

    // TODO: 作废发票
    //   POST /accounting/web/invoice/cancelInvoice
    //   API ID:108246032
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108246032
    const cancelInvoice = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await cancelInvoiceAPI(params);
    }, []);
    //endregion

    return {
        queryPendingInvoicingCharges,
        createInvoice,
        queryInvoiceDetailById,
        queryInvoices,
        cancelInvoice,
    }
}