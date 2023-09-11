import {useCallback} from "react";
import {
    cancelInvoiceAPI,
    createInvoiceAPI, editInvoiceAPI,
    queryInvoiceDetailByIdAPI, queryInvoicesAPI,
    queryPendingInvoicingChargesAPI
} from '@/services/smart/accounting/invoice'
import {formatNumToMoney} from '@/utils/units'



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
        const response: API.Result = await queryInvoicesAPI(params);
        if (!response) return;

        if (response.success) {
            response.data = response.data?.map((item: any) => ({
                ...item,
                billAmountStr: formatNumToMoney(item.billAmount),
            }))
        }

        return response;
    }, []);

    // TODO: 查询发票详细信息
    //   POST /accounting/web/invoice/queryInvoiceDetailById
    //   API ID:108244197
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108244197
    const queryInvoiceDetailById = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        // TODO: 请求后台 API
        const response: API.Result = await queryInvoiceDetailByIdAPI(params);
        if (!response) return;

        if (response.success) {
            response.data = response.data?.map((item: any) => ({
                ...item,
                billInTaxAmountStr: formatNumToMoney(item.billInTaxAmount),
            }))
        }

        return response;
    }, []);

    // TODO: 作废发票
    //   POST /accounting/web/invoice/cancelInvoice
    //   API ID:108246032
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108246032
    const cancelInvoice = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await cancelInvoiceAPI(params);
    }, []);

    // TODO: 修改发票
    //   POST /accounting/web/invoice/editInvoice
    //   API ID:108860414
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108860414
    const editInvoice = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await editInvoiceAPI(params);
    }, []);
    //endregion

    return {
        queryPendingInvoicingCharges,
        createInvoice,
        queryInvoiceDetailById,
        queryInvoices,
        cancelInvoice,
        editInvoice,
    }
}