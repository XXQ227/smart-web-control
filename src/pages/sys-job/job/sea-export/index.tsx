import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router'
import Basic from "./basic";
import Pickup from "./pickup";
import Ports from "./port";
import Containers from "./containers";
import BillOfLoading from "./bill-of-loading";
import Remark from "./remark";
import '../style.less'
import {FooterToolbar, ProForm} from '@ant-design/pro-components'
import {Button, Form, message, Spin} from 'antd'
import {LeftOutlined, SaveOutlined} from '@ant-design/icons'
import {history} from '@@/core/history'
import {getFormErrorMsg} from '@/utils/units'
import {useParams, useModel} from 'umi'
import moment from 'moment'

const FormItem = Form.Item;

const SeaExport: React.FC<RouteChildrenProps> = (props) => {
    const [form] = Form.useForm();
    const urlParams: any = useParams();
    const jobId = atob(urlParams.id);

    const  {} = props;

    const {
        querySeaExportInfo, addSeaExport, editSeaExport,
    } = useModel('job.job', (res: any) => ({
        querySeaExportInfo: res.querySeaExportInfo,
        addSeaExport: res.addSeaExport,
        editSeaExport: res.editSeaExport,
    }));

    const [loading, setLoading] = useState(false);
    const [seaExportInfo, setSeaExportInfo] = useState<any>({});
    const [id, setId] = useState<string>('0');


    /**
     * @Description: TODO: 获取海运出口信息
     * @author XXQ
     * @date 2023/7/26
     * @returns
     */
    async function handleQuerySeaExportInfo() {
        setLoading(true);
        // TODO: 获取用户数据
        let result: API.Result;
        if (jobId !== '0') {
            result = await querySeaExportInfo({id: jobId});
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

        // setLoading(false);
        setSeaExportInfo(result.data || {});
        return result.data || {};
    }

    const handleFinish = async (values: any) => {
        try {
            // @ts-ignore // TODO: 删除对应的 table 里的录入数据
            for (const item: string in values) {
                if (item.indexOf('_table_') > -1) {
                    delete values[item];
                }
            }
            // TODO: 时间需要另做处理
            if (values.closingTime) values.closingTime = moment(values.closingTime).format('YYYY-MM-DD hh:mm:ss');
            if (values.cyClosingDate) values.cyClosingDate = moment(values.cyClosingDate).format('YYYY-MM-DD hh:mm:ss');
            if (values.siCutOffTime) values.siCutOffTime = moment(values.siCutOffTime).format('YYYY-MM-DD hh:mm:ss');
            // TODO: 组合 modal 跟后修改的（values） 的数据
            const params: any = {jobId, ...seaExportInfo, ...values};

            // TODO: 处理箱信息的 id 数据
            if (params.preBookingContainersEntityList?.length > 0) {
                params.preBookingContainersEntityList =
                    params.preBookingContainersEntityList.map((item: any)=>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id, jobId})
                    );
            }
            if (params.containersLoadingDetailEntityList?.length > 0) {
                params.containersLoadingDetailEntityList =
                    params.containersLoadingDetailEntityList.map((item: any)=>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id, jobId})
                    );
            }
            if (params.billOfLoadingEntity?.length > 0) {
                params.billOfLoadingEntity = params.billOfLoadingEntity.map((item: any)=>
                    ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id, jobId})
                );
            }

            let result: API.Result;
            if (id === '0') {
                params.id = '0';
                result = await addSeaExport(params);
                setId(result.data);
            } else {
                params.id = id;
                result = await editSeaExport(params);
            }
            if (result.success) {
                message.success('success!!!');
                if (id === '0') setId(result.data);
            } else {
                message.error(result.message);
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
                        console.log('123');
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                initialValues={seaExportInfo}
                // @ts-ignore
                request={async () => handleQuerySeaExportInfo()}
            >
                <Basic {...baseForm} title={'Basic'} seaExportInfo={seaExportInfo}/>

                {/* 提货信息 */}
                <Pickup title={'Pickup'}/>

                {/* 港口信息 */}
                <Ports {...baseForm} title={'Port'} seaExportInfo={seaExportInfo}/>

                <Containers {...baseForm} jobServiceInfo={seaExportInfo}/>

                {/* 收发通信息 */}
                <BillOfLoading title={'Bill Of Loading'}/>

                <Remark title={'Remark'} />
            </ProForm>
        </Spin>
    )
}
export default SeaExport;