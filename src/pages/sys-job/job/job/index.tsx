import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import BasicInfo from './basic-info';
import Cargo from './cargo';
import Payment from './payment';
import {FooterToolbar, ProCard, ProForm, ProFormTextArea} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row, Spin} from 'antd';
import {LeftOutlined, SaveOutlined} from '@ant-design/icons';
import {history} from '@@/core/history';
import {getFormErrorMsg, rowGrid} from '@/utils/units';
import {useModel, useParams} from 'umi';

const FormItem = Form.Item;

const JobInfo: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const id = atob(params.id);
    const [form] = Form.useForm();

    const {
        queryJobInfo, addJob, editJob
    } = useModel('job.job', (res: any) => ({
        queryJobInfo: res.queryJobInfo,
        addJob: res.addJob,
        editJob: res.editJob,
    }));

    const {
        queryUserCommon, SalesList
    } = useModel('manager.user', (res: any) => ({
        queryUserCommon: res.queryUserCommon,
        SalesList: res.SalesList,
    }));

    const {
        queryDictCommon, BusinessLineList,
        queryAccountPeriodCommon, AccountPeriodList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        BusinessLineList: res.BusinessLineList,
        queryAccountPeriodCommon: res.queryAccountPeriodCommon,
        AccountPeriodList: res.AccountPeriodList,
    }))

    const [CJobInfo, setCJobInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);
    //endregion

    /**
     * @Description: TODO: 获取单票基础信息
     * @author XXQ
     * @date 2023/7/26
     * @param paramsVal     查询参数
     * @returns
     */
    async function handleQueryJobInfo(paramsVal: any) {
        setLoading(true);
        try {
            // TODO: 获取用户数据
            if (SalesList?.length === 0) await queryUserCommon({branchId: '0'});
            // TODO: 业务线
            if (BusinessLineList?.length === 0) await queryDictCommon({dictCodes: ['business_line']});
            // TODO: 账期
            if (AccountPeriodList?.length === 0) await queryAccountPeriodCommon({branchId: '1665596906844135426', name: ''});
            let result: API.Result;
            if (paramsVal.id !== '0') {
                result = await queryJobInfo(paramsVal);
                setLoading(false);
                setCJobInfo(result.data || {});
            } else {
                setLoading(false);
                result = {success: true, data: {}};
            }
            return result.data;
        } catch (e) {
            message.error(e);
            return {};
        }
    }

    /**
     * @Description: TODO: 保存单票信息
     * @author XXQ
     * @date 2023/8/7
     * @param values
     * @returns
     */
    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            console.log(values)
            let result: API.Result;
            values.branchId = '1665596906844135426';
            values.businessLine = 1;
            values.orderStatus = 0;
            if (id === '0') {
                if (values.accountPeriodId) {
                    const target: any = AccountPeriodList.find((item: any)=> item.value === values.accountPeriodId);
                    values.accountPeriodInformation = target.label;
                }
                result = await addJob(values);
            } else {
                result = await editJob({...CJobInfo,...values, id});
            }
            if (result?.success) {
                setLoading(false);
                message.success('Success!!!');
                await handleQueryJobInfo({id: id === '0' ? result.data : id})
                if (id === '0') {
                    history.push({pathname: `/job/job-info/form/${btoa(result.data)}`})
                }
            } else {
                if (result.message) message.error(result.message);
                setLoading(false);
            }
        } catch (e) {
            message.error(e)
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
                initialValues={CJobInfo}
                className={'basicInfoProForm'}
                submitter={{
                    // 完全自定义整个区域
                    render: () =>
                        <FooterToolbar
                            style={{height: 55}}
                            extra={
                                <Button
                                    icon={<LeftOutlined/>}
                                    onClick={() => history.push({pathname: '/job/job-list'})}
                                >Back</Button>
                            }>
                            <Button
                                icon={<SaveOutlined/>}
                                key={'submit'} type={'primary'} htmlType={'submit'}
                            >Save</Button>
                        </FooterToolbar>
                    ,
                }}
                onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                request={async () => handleQueryJobInfo({id})}
            >
                <BasicInfo {...baseForm} title={'Basic Information'} CJobInfo={CJobInfo}/>

                <Cargo title={'Cargo'}/>

                <Payment {...baseForm} termsParam={CJobInfo.termsParam || {}} title={'Payment & Shipping Terms'}/>

                <ProCard title={'Remark'} bordered={true} className={'ant-card pro-form-payment'} headerBordered
                         collapsible>
                    <Row gutter={rowGrid}>
                        <Col span={24}>
                            <ProFormTextArea
                                placeholder=''
                                name="remark"
                                label="Job Remark"
                                fieldProps={{rows: 4}}
                            />
                        </Col>
                    </Row>
                </ProCard>
            </ProForm>
        </Spin>
    )
}
export default JobInfo;