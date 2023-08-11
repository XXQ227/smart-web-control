import {
    addJobAPI, addSeaExportAPI,
    editJobAPI, editSeaExportAPI,
    queryJobInfoAPI,
    querySeaExportInfoAPI,
    querySeaImportInfoAPI
} from '@/services/smart/job/job-info';
import {useCallback, useState} from "react";



export default () => {
    //region TODO: 业务详情结构表
    //endregion

    const [ServiceTypeList, setServiceTypeList] = useState([]);

    // TODO: 单票详情

    //region TODO: 接口
    // TODO: 获取单票业务详情请求
    const queryJobInfo = useCallback(async (params: APIModel.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryJobInfoAPI(params);
        if (!response) return;
        if (response.success) {
            response.data.cargoInformationParam = response.data.cargoInformationResult || {};
            response.data.termsParam = response.data.termsResult || {};
            // TODO: job 的服务信息
            setServiceTypeList(response?.data?.serviceTypeList || []);
            delete response.data.cargoInformationResult;
            delete response.data.termsResult;
            delete response.data.service;
        }
        return response;
    }, []);

    // TODO: 新增单票
    // POST /engine/web/forwardJob/addJob
    // API ID:95322581
    // API URL:https://app.apifox.com/project/2684231/apis/api-95322581
    const addJob = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response: API.Result = await addJobAPI(params);
        if (!response) return;
        return response;
    }, []);


    // TODO: 编辑单票
    // POST /engine/web/forwardJob/editJob
    // API ID:95322699
    // API URL:https://app.apifox.com/project/2684231/apis/api-95322699
    const editJob = useCallback(async (params: any) => {
        // TODO: 请求后台 API
        const response: API.Result = await editJobAPI(params);
        if (!response) return;
        return response;
    }, []);



    // TODO: 查询海运进口服务信息
    // POST /engine/web/seaExport/querySeaExportInfo
    // API ID:98136955
    // API URL:https://app.apifox.com/project/2684231/apis/api-98136955
    const querySeaExportInfo = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await querySeaExportInfoAPI(params);
    }, []);

    // TODO: 新增海运进口服务信息
    // POST /engine/web/seaExport/addSeaExport
    // API ID:98135707
    // API URL:https://app.apifox.com/project/2684231/apis/api-98135707
    const addSeaExport = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        const response: API.Result = await addSeaExportAPI(params);
        if (response.success) {
        }
        return response;
    }, []);

    // TODO: 编辑海运进口服务信息
    // POST /engine/web/seaExport/editSeaExport
    // API ID:98137298
    // API URL:https://app.apifox.com/project/2684231/apis/api-98137298
    const editSeaExport = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await editSeaExportAPI(params);
    }, []);





    // TODO: 获取单票业务详情请求
    const querySeaImportInfo = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await querySeaImportInfoAPI(params);
    }, []);
    //endregion


    return {
        queryJobInfo,
        addJob,
        editJob,

        ServiceTypeList,

        querySeaExportInfo,
        addSeaExport,
        editSeaExport,

        querySeaImportInfo,
    }
}