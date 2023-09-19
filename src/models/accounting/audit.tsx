import {useCallback} from "react";
import {auditJobAPI, queryAuditJobAPI} from '@/services/smart/accounting/audit'


export default () => {

    //region TODO: 审核接口
    // TODO: 查询待审核单票列表
    //   POST /accounting/web/audit/queryAuditJob
    //   API ID:109008485
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-109008485
    const queryAuditJob = useCallback(async (params: APIModel.SearchJobParams) => {
        // TODO: 请求后台 API
        return await queryAuditJobAPI(params);
    }, []);


    // TODO: 审核单票
    //   POST /accounting/web/audit/auditJob
    //   API ID:110745257
    //   API URL:https://app.apifox.com/link/project/2684231/apis/api-110745257
    const auditJob = useCallback(async (params: APIModel.SearchJobParams) => {
        // TODO: 请求后台 API
        return await auditJobAPI(params);
    }, []);
    //endregion


    return {
        queryAuditJob,
        auditJob,
    }
}