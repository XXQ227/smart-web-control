import React, {useRef, useState} from 'react';
import Basic from "./basic";
import Pickup from "./pickup";
import Ports from "./port";
import Containers from "./containers";
import BillOfLoading from "./bill-of-loading";
import Remark from "./remark";
import '../style.less';
import {FooterToolbar, ProForm} from '@ant-design/pro-components';
import type {ProFormInstance} from '@ant-design/pro-components';
import {Button, Form, message, Modal, Spin} from 'antd';
import {ExclamationCircleFilled, LeftOutlined, SaveOutlined} from '@ant-design/icons';
import {history} from '@@/core/history';
import {getFormErrorMsg} from '@/utils/units';
import {useParams, useModel} from 'umi';
import moment from 'moment';

interface Props {
    headerInfo: any,
    handleChangeTabs: (value: string) => void,
    handleChangedTabName: (value: string) => void,
}
const { confirm } = Modal;
const FormItem = Form.Item;

const SeaExport: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    const urlParams: any = useParams();
    const jobId = atob(urlParams.id);

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
    const [isSave, setIsSave] = useState(false);
    const [state, setState] = useState('');
    const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
    const [isChange, setIsChange] = useState(false);

    /**
     * @Description: TODO: 获取海运出口信息
     * @author XXQ
     * @date 2023/7/26
     * @returns
     */
    async function handleQuerySeaExportInfo() {
        setLoading(true);
        try {
            let result: API.Result;
            if (jobId !== '0') {
                result = await querySeaExportInfo({id: jobId});
                // TODO: 把当前服务的 id 存下来
                if (result.data) {
                    setId(result.data.id);
                } else {
                    result.data = {blTypeId: '1', billOfLoadingEntity: []};
                }
            } else {
                result = {success: true, data: {blTypeId: '1'}};
            }
            setLoading(false);
            setSeaExportInfo(result.data || {});
            return result.data || {};
        } catch (e) {
            message.error(e);
            return {};
        }
    }

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const billOfLoadingEntityData = [];
            // TODO: 删除对应的 table 里的录入数据
            for (const item in values) {
                if (item.indexOf('_table_') > -1) {
                    delete values[item];
                } else if (typeof values[item] === 'object' && values[item]?.length > 0) {
                    // TODO: 提单信息处理
                    if (!['preBookingContainersEntityList', 'containersLoadingDetailEntityList', 'billOfLoadingEntity'].includes(item)) {
                        if (values.hasOwnProperty(item)) {
                            billOfLoadingEntityData.push(...values[item].map((val: any) => {
                                return {
                                    ...val,
                                    id: val.id.indexOf('ID_') > -1 ? '0' : val.id
                                }
                            }));
                        }
                        delete values[item];
                    }
                }
            }
            values.blTypeId = values.blTypeId ? Number(values.blTypeId) : '';
            // TODO: 时间需要另做处理
            if (values.closingTime) values.closingTime = moment(values.closingTime).format('YYYY-MM-DD hh:mm:ss');
            if (values.cyClosingDate) values.cyClosingDate = moment(values.cyClosingDate).format('YYYY-MM-DD hh:mm:ss');
            if (values.siCutOffTime) values.siCutOffTime = moment(values.siCutOffTime).format('YYYY-MM-DD hh:mm:ss');
            values.placeOfDate = values.placeOfDate ? values.placeOfDate : '';
            values.pickupDate = values.pickupDate ? values.pickupDate : '';
            values.polTerminalReceipt = values.polTerminalReceipt ? values.polTerminalReceipt : '';
            values.loadingDate = values.loadingDate ? values.loadingDate : '';
            // TODO: 组合 modal 跟后修改的（values） 的数据
            const params: any = {jobId, ...values};

            // TODO: 处理箱信息的 id 数据
            if (params.preBookingContainersEntityList?.length > 0) {
                params.preBookingContainersEntityList =
                    params.preBookingContainersEntityList.map((item: any) =>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id, jobId})
                    );
            }
            if (params.containersLoadingDetailEntityList?.length > 0) {
                params.containersLoadingDetailEntityList =
                    params.containersLoadingDetailEntityList.map((item: any) =>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id, jobId})
                    );
            }
            // TODO: 提单信息
            params.billOfLoadingEntity = billOfLoadingEntityData;
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
                message.success('Success!!!');
                if (id === '0') {
                    setId(result.data);
                    props.handleChangeTabs('sea-export');
                }
                setIsSave(true);
                await handleQuerySeaExportInfo();
                setState('add');
                setIsSave(false);
                props.handleChangedTabName('');
                setIsChange(false);
            } else {
                if (result.message) message.error(result.message);
            }
        } catch (e) {
            message.error(e);
        }
        setLoading(false);
    };

    /**
     * @Description: TODO: 当 ProForm 表单修改时，调用此方法
     * @author LLS
     * @date 2023/9/15
     * @param changeValues   ProForm 表单修改的参数
     * @returns
     */
    const handleProFormValueChange = (changeValues: any) => {
        Object.keys(changeValues).map((item: any) => {
            props.handleChangedTabName('Sea (Export)');
            setIsChange(true);
            if (item === 'mblNum') {
                setIsChangeValue(!isChangeValue);
            }
        })
    }

    /**
     * @Description: TODO: 返回
     * @author LLS
     * @date 2023/9/22
     * @returns
     */
    const handleBack = () => {
        if (isChange) {
            confirm({
                title: `Confirm return ?`,
                content: 'The current information has been modified.',
                icon: <ExclamationCircleFilled />,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    history.push({pathname: '/job/job-list'});
                }
            });
        } else {
            history.push({pathname: '/job/job-list'});
        }
    }

    const baseForm = {form, FormItem, serviceInfo: seaExportInfo, handleProFormValueChange};

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                formRef={formRef}
                layout="vertical"
                name={'formJobInfo'}
                className={'basicInfoProForm'}
                submitter={{
                    // 完全自定义整个区域
                    render: () =>
                        <FooterToolbar
                            style={{height: 55}}
                            extra={<Button icon={<LeftOutlined/>} onClick={handleBack}>Back</Button>}>
                            <Button icon={<SaveOutlined/>} key={'submit'} type={'primary'}
                                    htmlType={'submit'}>Save</Button>
                        </FooterToolbar>
                    ,
                }}
                initialValues={seaExportInfo}
                // TODO: 空间有改数据时触动
                onValuesChange={handleProFormValueChange}
                onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                request={async () => handleQuerySeaExportInfo()}
            >
                <Basic {...baseForm} title={'Basic'}/>

                {/* 提货信息 */}
                <Pickup title={'Pickup'}/>

                {/* 港口信息 */}
                <Ports {...baseForm} title={'Port'}/>

                <Containers {...baseForm}/>

                {/* 收发通信息 */}
                <BillOfLoading
                    {...baseForm} formRef={formRef} title={'Bill Of Loading'}
                    isSave={isSave} headerInfo={props.headerInfo} state={state} isChangeValue={isChangeValue}
                />

                <Remark title={'Remark'} />
            </ProForm>
        </Spin>
    )
}
export default SeaExport;