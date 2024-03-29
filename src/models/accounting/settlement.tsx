import {useCallback} from "react";
import {
    deleteWriteOffAPI, invoiceWriteOffAPI, queryUnWriteOffInvoiceAPI, queryWriteOffAPI, queryWriteOffInfoAPI
} from '@/services/smart/accounting/settlement'


export default () => {
    // TODO: 基础数据

    //region TODO: 接口

    // TODO: 查询待核销发票列表
    //   POST /accounting/web/writeOff/queryUnWriteOffInvoice
    //   API ID:108911367
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108911367
    const queryUnWriteOffInvoice = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await queryUnWriteOffInvoiceAPI(params);
    }, []);

    // TODO: 查询核销记录列表
    //   POST /accounting/web/writeOff/queryWriteOff
    //   API ID:108910659
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108910659
    const queryWriteOff = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await queryWriteOffAPI(params);
    }, []);

    // TODO: 查询核销记录详情
    //   POST /accounting/web/writeOff/queryWriteOffInfo
    //   API ID:108910965
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108910965
    const queryWriteOffInfo = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await queryWriteOffInfoAPI(params);
    }, []);

    // TODO: 删除核销记录
    //   POST /accounting/web/writeOff/deleteWriteOff
    //   API ID:108911128
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-108911128
    const deleteWriteOff = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await deleteWriteOffAPI(params);
    }, []);

    // TODO: 发票核销
    //   POST /accounting/web/writeOff/invoiceWriteOff
    //   API ID:111583235
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-111583235
    const invoiceWriteOff = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        return await invoiceWriteOffAPI(params);
    }, []);


    //endregion



    return {
        queryUnWriteOffInvoice,
        queryWriteOff,
        queryWriteOffInfo,
        deleteWriteOff,
        invoiceWriteOff,
    }
}