import React, {useEffect, useState} from 'react';
import Basic from "./basic";
import Ports from "./port";
import Remark from "@/pages/sys-job/job/sea-export/remark";
import Containers from "@/pages/sys-job/job/sea-export/containers";
import {Button, Form, message, Spin} from 'antd'
import '../style.less'
import type {RouteChildrenProps} from 'react-router'
import {FooterToolbar, ProForm} from '@ant-design/pro-components'
import {LeftOutlined, SaveOutlined} from '@ant-design/icons'
import {history} from '@@/core/history'
import {getFormErrorMsg} from '@/utils/units'
import {useModel} from 'umi'
import {useParams} from 'umi'
import moment from 'moment/moment'

const FormItem = Form.Item;

const SeaImport: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const urlParams: any = useParams();
    const jobId = atob(urlParams.id);

    useEffect(() => {

    }, [])
    //endregion

    const {
        querySeaImportInfo, addSeaImport, editSeaImport
    } = useModel('job.job', (res: any) => ({
        querySeaImportInfo: res.querySeaImportInfo,
        addSeaImport: res.addSeaImport,
        editSeaImport: res.editSeaImport,
    }));

    const [loading, setLoading] = useState(false);
    const [seaImportInfo, setSeaImportInfo] = useState<any>({});
    const [id, setId] = useState<string>('0');


    /**
     * @Description: TODO: 获取海运出口信息
     * @author XXQ
     * @date 2023/7/26
     * @returns
     */
    async function handleQuerySeaImportInfo() {
        setLoading(true);
        // TODO: 获取用户数据
        let result: API.Result;
        if (jobId !== '0') {
            result = await querySeaImportInfo({id: jobId});
            // TODO: 把当前服务的 id 存下来
            if (result.data) {
                setId(result.data.id);
            } else {
                result.data = {blTypeId: 1};
            }
            setLoading(false);
        } else {
            result = {success: true, data: {blTypeId: 1}};
            setLoading(false);
        }
        setSeaImportInfo(result.data || {});
        return result.data || {};
    }


    // TODO: 保存进口服务单票
    const handleFinish = async (values: Record<string, any>) => {
        try {
            // @ts-ignore
            for (const item: string in values) {
                if (item.indexOf('_table_') > -1) {
                    delete values[item];
                }
            }
            // TODO: 时间需要另做处理
            if (values.eta) values.eta = moment(values.eta).format('YYYY-MM-DD hh:mm:ss');
            if (values.dischargingDate) values.dischargingDate = moment(values.dischargingDate).format('YYYY-MM-DD hh:mm:ss');
            if (values.completeDate) values.completeDate = moment(values.completeDate).format('YYYY-MM-DD hh:mm:ss');

            const params: any = {jobId, ...seaImportInfo, ...values};

            if (params.containersLoadingDetailEntityList?.length > 0) {
                params.containersLoadingDetailEntityList =
                    params.containersLoadingDetailEntityList.map((item: any)=>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id, jobId})
                    );
            }

            let result: API.Result;
            if (id === '0') {
                params.id = '0';
                result = await addSeaImport(params);
            } else {
                params.id = id;
                result = await editSeaImport(params);
            }
            if (result.success) {
                message.success('success!!!');
                if (id === '0') setId(result?.data?.id || '0');
            } else {
                if (result.message) message.error(result.message);
            }
        } catch {
            // console.log
        }
    };


    const baseForm = {form, FormItem};

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                omitNil={false}
                layout="vertical"
                name={'formJobInfo'}
                className={'basicInfoProForm'}
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
                            <FooterToolbar
                                style={{height: 55}}
                                extra={<Button icon={<LeftOutlined/>} onClick={() => history.goBack()}>Back</Button>}>
                                <Button icon={<SaveOutlined/>} key={'submit'} type={'primary'}
                                        htmlType={'submit'}>Save</Button>
                            </FooterToolbar>
                        );
                    },
                }}
                onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                initialValues={seaImportInfo}
                request={async () => handleQuerySeaImportInfo()}
            >
                <Basic {...baseForm} title={'Basic'}/>

                {/* 港口信息 */}
                <Ports {...baseForm} title={'Port'} jobServiceInfo={seaImportInfo || {}}/>

                <Containers{...baseForm} jobServiceInfo={seaImportInfo || {}} type={'import'}/>

                <Remark type={'import'} title={'Remark'}/>
            </ProForm>
        </Spin>
    )
}
export default SeaImport;