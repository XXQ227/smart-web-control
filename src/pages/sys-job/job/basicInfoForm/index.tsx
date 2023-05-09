import React, {useEffect, useState} from 'react';
import {history, useModel, useIntl} from 'umi';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row, Descriptions} from 'antd';
import {getUserID} from '@/utils/auths';
import BasicInfo from '../basicInfoForm/basicInfo';
import Cargo from '../basicInfoForm/cargo';
import Payment from '../basicInfoForm/payment';
import {colGrid, getBusinessLineName, getStatus, getTitleInfo, rowGrid} from '@/utils/units'
import styles from './style.less';
import moment from 'moment';
import ProForm from "@ant-design/pro-form";

const FormItem = Form.Item;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;

const BasicInfoForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    //region TODO: 数据层
    const {
        CommonBasicInfo: {SalesManList, FinanceDates},
        CJobInfo, CJobInfo: {NBasicInfo, NBasicInfo: {Principal}, LockDate, CargoInfo},
        getCJobInfoByID
    } = useModel('job.job', (res: any) => ({
        CJobInfo: res.CJobInfo,
        CommonBasicInfo: res.CommonBasicInfo,
        getCJobInfoByID: res.getCJobInfoByID,
    }));
    //endregion

    /** 实例化Form */
    const [form] = Form.useForm();

    const [jobID, setJobID] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // TODO: 当【没有 ID && isLoadingData == false】时调用接口获取数据
        if (!jobID && !isLoadingData && params?.id !== ':id') {
            isLoadingData = true;
            getCJobInfoByID({
                CJobID: Number(atob(params?.id)),
                BizType4ID: Number(atob(params?.bizType4id)),
                UserID: getUserID()
            })
                // @ts-ignore
                .then((res: APIModel.NJobDetailDto) => {
                    // TODO: 设置 ID 且初始化数据
                    setJobID(res?.ID);
                    setLoading(false);
                    isLoadingData = false;
                })
        }
    }, [getCJobInfoByID, jobID, params?.bizType4id, params?.id])
    //endregion

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/4/18
     * @returns
     */
    /*const handleSave = () => {
        form.validateFields()
            .then((value) => {
                console.log('value: ', value);
            })
            .catch((errorInfo) => {
                // TODO: 提交失败。弹出错误提示
                console.log('errorInfo: ' + errorInfo);
                /!** 错误信息 *!/
                const {errorFields} = errorInfo;
                if (errorFields?.length > 0) {
                    const errList = errorFields.map((x: any) => x.errors[0]);
                    // TODO: 去重
                    const errArr: any = Array.from(new Set(errList));
                    const errInfo = errArr.toString().replace(/,/g, ',  /  ');
                    message.error(errInfo);
                }
            });
    }*/

    const handleFinish = async (values: Record<string, any>) => {
        try {
            console.log(values)
            // await fakeSubmitForm(values);
            message.success('提交成功');
        } catch {
            // console.log
        }
    };

    // 初始化（或用于 message 提醒）
    //const intl = useIntl();
    // TODO: 获取列名<Title>
    //const formLabel = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    const baseParams: any = {form, FormItem};
    const basicInfoParams: any = {CJobInfo, NBasicInfo, SalesManList, FinanceDates};
    const cargoParams: any = {CargoInfo, NBasicInfo};

    const description = (
        <Descriptions className={styles.headerList} size="small" column={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 7}}>
            <Descriptions.Item label="Business Line">{getBusinessLineName(NBasicInfo?.BusinessLineID)}</Descriptions.Item>
            <Descriptions.Item label="Job No.">{NBasicInfo?.Code}</Descriptions.Item>
            <Descriptions.Item label="Shipment Type">{NBasicInfo?.BizTypeEN}</Descriptions.Item>
            <Descriptions.Item label="Sales">{Principal?.SalesManName}</Descriptions.Item>
            <Descriptions.Item label="Creator" >{NBasicInfo?.Operator}</Descriptions.Item>
            <Descriptions.Item label="Taking Date">{!!LockDate ? moment(LockDate).format("YYYY-MM-DD") : ""}</Descriptions.Item>
            <Descriptions.Item label="Last Modified">{NBasicInfo?.LastEditor} / {NBasicInfo?.LastEditDate ? moment(NBasicInfo?.LastEditDate).format("YYYY-MM-DD") : ""}</Descriptions.Item>
        </Descriptions>
    );

    // @ts-ignore
    return (
        <PageContainer
            className={styles.pageContainer}
            title={false}
            content={description}
            loading={loading}
            header={{
                // title: props?.title,
                breadcrumb: {},
            }}
        >
            {/*<ProCard className={'ant-card'}>
                <Form
                    layout={'inline'}
                    name={'showBasicInfo'}
                >
                    <Row gutter={rowGrid}>
                        <Col {...colGrid}>
                            <FormItem label={formLabel('code', '业务编号')}>
                                {NBasicInfo?.Code}
                            </FormItem>
                        </Col>
                        <Col {...colGrid}>
                            <FormItem label={formLabel('sales', '销售')}>
                                {Principal?.SalesManName}
                            </FormItem>
                        </Col>
                        <Col {...colGrid}>
                            <FormItem label={formLabel('sales', '销售')}>
                                {Principal?.SalesManName}
                            </FormItem>
                        </Col>
                        <Col {...colGrid}>
                            <FormItem label={formLabel('sales', '销售')}>
                                {Principal?.SalesManName}
                            </FormItem>
                        </Col>
                        <Col {...colGrid}>
                            <FormItem label={formLabel('sales', '销售')}>
                                {Principal?.SalesManName}
                            </FormItem>
                        </Col>
                        <Col {...colGrid}>
                            <FormItem label={formLabel('sales', '销售')}>
                                {Principal?.SalesManName}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </ProCard>*/}
            {/*<Form
                form={form}
                // ref={formRef}
                name={'formBasic'}
                layout={'vertical'}
                autoComplete={'off'}
                onFinish={handleSave}
                onFinishFailed={handleSave}
                onValuesChange={()=> console.log(123456)}
            >
                <BasicInfo
                    {...baseParams}
                    title={'委托信息'}
                    {...principalParams}
                />

                <FooterToolbar extra={<Button onClick={() => history.goBack()}>返回</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </Form>*/}
            <ProForm
                className={styles.proForm}
                layout="vertical"
                submitter={{
                    // 完全自定义整个区域
                    render: (props, doms) => {
                        return (
                            <FooterToolbar extra={<Button onClick={() => history.goBack()}>返回</Button>}>
                                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                            </FooterToolbar>
                        );
                    },
                }}
                onFinish={handleFinish}
                initialValues={CJobInfo}
            >
                <ProForm.Group>
                    <BasicInfo
                        {...baseParams}
                        title={'Basic Information'}
                        {...basicInfoParams}
                    />
                    <Cargo
                        title={'Cargo'}
                        {...cargoParams}
                    />
                    <Payment
                        title={'Payment & Shipping Terms'}
                        NBasicInfo={NBasicInfo}
                    />
                    <Payment
                        title={'Remark'}
                        NBasicInfo={NBasicInfo}
                    />
                </ProForm.Group>
                <ProForm.Item>

                </ProForm.Item>
            </ProForm>
        </PageContainer>
    )
}
export default BasicInfoForm;