import React, {useEffect, useState} from 'react';
import {RouteChildrenProps} from 'react-router'
import BasicInfo from './basic-info';
import Cargo from './cargo';
import Payment from './payment';
import styles from '@/pages/sys-job/job/style.less'
import {FooterToolbar, ProCard, ProForm, ProFormTextArea} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Spin} from 'antd'
import {LeftOutlined, SaveOutlined} from '@ant-design/icons'
import {history} from '@@/core/history'
import {getFormErrorMsg, rowGrid} from '@/utils/units'
import {useModel, useParams} from 'umi'

const FormItem = Form.Item;

const JobInfo: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const id = atob(params.id);
    const [form] = Form.useForm();


    const {
        queryJobInfo
    } = useModel('job.job', (res: any) => ({
        queryJobInfo: res.queryJobInfo,
    }));

    const {
        queryUserCommon
    } = useModel('manager.user', (res: any) => ({
        queryUserCommon: res.queryUserCommon,
    }));

    const [CJobInfo, setCJobInfo] = useState<any>({
        basicInfo: {
            businessType: 1,
            salesId: '1658001055903371265',
            project: 3,
            IsSettleJob: true,
        },
        terms: {
            incotermsId: 1,
            serviceTypeId: '15',
            serviceTypeName: 'CFS/DOOR',
            payMethod: 1,
            payableAtId: '',
            payableAtName: '',
        },
        cargoInfo: {
            qty: 200,
            grossWeight: 2000,
            measurement: 3245,
            packagingMethodId: 1,
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    }, [])

    //endregion

    /**
     * @Description: TODO: 获取单票基础信息
     * @author XXQ
     * @date 2023/7/26
     * @param paramsVal     查询参数
     * @returns
     */
    async function handleQueryJobInfo(paramsVal: any) {
        // alert('loading Job Info !!!');
        // setLoading(true);
        // TODO: 获取用户数据
        await queryUserCommon({branchId: '0'});
        let result: API.Result;
        if (paramsVal.id !== '0') {
            result = await queryJobInfo(paramsVal);
        } else {
            result = {success: true, data: {}};
        }

        // setLoading(false);
        // setCJobInfo(result.data || {});
        return result.data;
    }

    const handleFinish = async (values: Record<string, any>) => {
        try {
            console.log(values)
            // await fakeSubmitForm(values);
            message.success('提交成功');
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
                initialValues={CJobInfo}
                className={styles.basicInfoProForm}
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
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
                // @ts-ignore
                request={async () => handleQueryJobInfo({id})}
            >
                <BasicInfo title={'Basic Information'} basicInfo={{BizType3ID: 1}}/>

                <Cargo title={'Cargo'}/>

                <Payment {...baseForm} terms={CJobInfo.terms} title={'Payment & Shipping Terms'}/>

                <ProCard title={'Remark'} bordered={true} className={'ant-card pro-form-payment'} headerBordered
                         collapsible>
                    <Row gutter={rowGrid}>
                        <Col span={24}>
                            <ProFormTextArea
                                placeholder=''
                                name="BizRemark"
                                label="Job Remark"
                                fieldProps={{rows: 4}}
                            />
                        </Col>
                    </Row>
                </ProCard>
                <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/job/job-list'})}>返回</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </Spin>
    )
}
export default JobInfo;