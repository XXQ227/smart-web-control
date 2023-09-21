import {
    queryJobInfoAPI,
    addJobAPI,
    editJobAPI,
    querySeaExportInfoAPI,
    addSeaExportAPI,
    editSeaExportAPI,
    querySeaImportInfoAPI,
    addSeaImportAPI,
    editSeaImportAPI,
    queryLocalDeliveryInfoAPI,
    addLocalDeliveryAPI,
    editLocalDeliveryAPI, deleteLocalDeliveryAPI, deleteBillOfLoadingAPI
} from '@/services/smart/job/job-info';
import {useCallback, useState} from "react";

export default () => {
    const [jobHeaderInfo, setJobHeaderInfo] = useState({});
    const [ServiceTypeList, setServiceTypeList] = useState([]);
    // TODO: 用于分配实装数据
    const [CargoInfo, setCargoInfo] = useState<any>({});
    const [jobInfo, setJobInfo] = useState<any>({});

    //region TODO: 接口
    // region job
    // TODO: 获取单票业务详情数据
    const queryJobInfo = useCallback(async (params: APIModel.GetCJobByID) => {
        // TODO: 请求后台 API
        const response: API.Result = await queryJobInfoAPI(params);
        if (!response) return;
        if (response.success) {
            response.data.cargoInformationParam = response?.data?.cargoInformationResult || {};
            response.data.termsParam = response?.data?.termsResult || {};
            // TODO: job 的服务信息
            setJobHeaderInfo(response?.data?.jobCommonInformationResult || {});
            setServiceTypeList(response?.data?.serviceTypeList || []);
            setCargoInfo(response?.data?.cargoInformationResult || {});
            setJobInfo(response?.data || {});
            delete response?.data?.cargoInformationResult;
            delete response?.data?.termsResult;
            delete response?.data?.service;
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
        // TODO: 更新货信息数据
        if (response.success) {
            setCargoInfo(params?.cargoInformationParam || {});
        }
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
        // TODO: 更新货信息数据
        if (response.success) {
            setCargoInfo(params?.cargoInformationParam || {});
        }
        return response;
    }, []);
    //endregion


    //region 出口
    // TODO: 查询海运出口服务信息
    // POST /engine/web/seaExport/querySeaExportInfo
    // API ID:98136955
    // API URL:https://app.apifox.com/project/2684231/apis/api-98136955
    const querySeaExportInfo = useCallback(async (params: {id: string}) => {
        const response: API.Result = await querySeaExportInfoAPI(params);
        // TODO: 请求后台 API
        if (response.success) {
            /*if (response.data.billOfLoadingEntity?.length > 0) {
                response.data.billOfLoadingEntity = response.data.billOfLoadingEntity.map((item: any, index: number)=>
                    ({...item, id: `${index + 1}`})
                )
            } else {
                response.data.billOfLoadingEntity = [];
            }*/
            delete response.data?.service;
        }
        return response;
    }, []);

    // TODO: 新增海运出口服务信息
    // POST /engine/web/seaExport/addSeaExport
    // API ID:98135707
    // API URL:https://app.apifox.com/project/2684231/apis/api-98135707
    const addSeaExport = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await addSeaExportAPI(params);
    }, []);

    // TODO: 编辑海运出口服务信息
    // POST /engine/web/seaExport/editSeaExport
    // API ID:98137298
    // API URL:https://app.apifox.com/project/2684231/apis/api-98137298
    const editSeaExport = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await editSeaExportAPI(params);
    }, []);

    // TODO: 删除收发通信息
    // POST /engine/web/seaExport/deleteBillOfLoading
    // API ID:108838763
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-108838763
    const deleteBillOfLoading = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await deleteBillOfLoadingAPI(params);
    }, []);
    //endregion


    //region 进口
    // TODO: 查询海运进口服务信息
    // POST /engine/web/seaImport/querySeaImportInfo
    // API ID:98133423
    // API URL:https://app.apifox.com/project/2684231/apis/api-98133423
    const querySeaImportInfo = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await querySeaImportInfoAPI(params);
    }, []);

    // TODO: 新增海运进口服务信息
    // POST /engine/web/seaImport/addSeaImport
    // API ID:98135707
    // API URL:https://app.apifox.com/project/2684231/apis/api-98135707
    const addSeaImport = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await addSeaImportAPI(params);
    }, []);

    // TODO: 编辑海运进口服务信息
    // POST /engine/web/seaImport/editSeaImport
    // API ID:98137298
    // API URL:https://app.apifox.com/project/2684231/apis/api-98137298
    const editSeaImport = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await editSeaImportAPI(params);
    }, []);
    //endregion


    //region 本地交付
    // TODO: 查询本地交付服务信息
    // POST /engine/web/localDelivery/queryLocalDeliveryInfo
    // API ID:98140491
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-98140491
    const queryLocalDeliveryInfo = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await queryLocalDeliveryInfoAPI(params);
    }, []);

    // TODO: 新增本地交付服务信息
    // POST /engine/web/localDelivery/addLocalDelivery
    // API ID:98140362
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-98140362
    const addLocalDelivery = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await addLocalDeliveryAPI(params);
    }, []);

    // TODO: 编辑本地交付服务信息
    // POST /engine/web/localDelivery/editLocalDelivery
    // API ID:98141148
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-98141148
    const editLocalDelivery = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await editLocalDeliveryAPI(params);
    }, []);

    // TODO: 删除本地交付服务信息
    // POST /engine/web/localDelivery/deleteLocalDelivery
    // API ID:98141899
    // API URL:https://app.apifox.com/link/project/2684231/apis/api-98141899
    const deleteLocalDelivery = useCallback(async (params: {id: string}) => {
        // TODO: 请求后台 API
        return await deleteLocalDeliveryAPI(params);
    }, []);
    //endregion


    //endregion


    return {
        queryJobInfo,
        CargoInfo,
        jobInfo,

        addJob,
        editJob,

        jobHeaderInfo,
        ServiceTypeList,

        querySeaExportInfo,
        addSeaExport,
        editSeaExport,
        deleteBillOfLoading,

        querySeaImportInfo,
        addSeaImport,
        editSeaImport,

        queryLocalDeliveryInfo,
        addLocalDelivery,
        editLocalDelivery,
        deleteLocalDelivery,
    }
}