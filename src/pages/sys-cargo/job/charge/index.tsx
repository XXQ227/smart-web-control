import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row} from 'antd';
import {history, useModel} from 'umi';
import {useIntl} from '@@/plugin-locale/localeExports';
import {colGrid, getTitleInfo, rowGrid} from '@/utils/units';
import ChargeTable from '@/pages/sys-cargo/job/charge/chargeTable';
import type {FormInstance} from 'antd/es/form'


const FormItem = Form.Item;
let isLoadingData = false;
const JobChargeInfo: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const {
        JobChargeInfo: {NBasicInfo, PayCGList, ReceiveCGList}, getCJobCGByID
    } = useModel('jobCharge', (res: any) => ({
        JobChargeInfo: res.JobChargeInfo,
        getCJobCGByID: res.getCJobCGByID,
    }));

    /** 实例化Form */
    const [form] = Form.useForm();
    const formRef = React.useRef<FormInstance>(null);

    const [jobID, setJobID] = useState(0);
    // TODO: 用来判断是否是第一次加载数据
    const [loading, setLoading] = useState(false);

    const [payCGList, setPayCGList] = useState<API.PRCGInfo[]>(PayCGList || []);
    const [receiveCGList, setReceiveCGList] = useState<API.PRCGInfo[]>(ReceiveCGList || []);
    const [updateState, setUpdateState] = useState(false);

    useEffect(() => {
        // TODO: 当【没有 ID && isLoadingData == false】时调用接口获取数据
        if (!jobID && !isLoadingData && params?.id !== ':id') {
            isLoadingData = true;
            getCJobCGByID({CJobID: Number(atob(params?.id))})
                // @ts-ignore
                .then((res: API.NJobDetailDto) => {
                    // TODO: 设置 ID 且初始化数据
                    setJobID(res?.ID);
                    setLoading(false);
                    setPayCGList(res.PayCGList || []);
                    setReceiveCGList(res.PayCGList || []);
                    isLoadingData = false;
                })
        }
    }, [getCJobCGByID, jobID, params?.id])


    /**
     * @Description: TODO: 操作数据
     * @author XXQ
     * @date 2023/4/11
     * @param data      操作后的数据
     * @param CGType    操作的 【AR / AP】
     * @returns
     */
    const handleChangeData = (data: any, CGType: number) => {
        if (CGType === 1) {
            setReceiveCGList(data);
        } else {
            setPayCGList(data);
        }
        setUpdateState(true);
    }

    /**
     * @Description: TODO: 保存费用操作
     * @author XXQ
     * @date 2023/4/11
     * @returns
     */
    const handleSave = () => {
        form.validateFields()
            .then(() => {
                /** 正确后的验证信息 */
                if (updateState) {
                    const apChangeList: API.PRCGInfo[] = payCGList.filter((item: API.PRCGInfo)=> item.isChange) || [];
                    const arChangeList: API.PRCGInfo[] = receiveCGList.filter((item: API.PRCGInfo)=> item.isChange) || [];
                    const isChangeCG: API.PRCGInfo[] = [...arChangeList, ...apChangeList];
                    console.log(isChangeCG, arChangeList );
                } else {
                    message.info('没有需要保存的数据')
                }
            })
            .catch((errorInfo) => {
                /** 错误信息 */
                console.log(errorInfo);
            });
    }

    /**
     * @Description: TODO: 提交失败。弹出错误提示
     * @author XXQ
     * @date 2023/4/14
     * @returns
     */
    const onFinishFailed = () => {
        form.validateFields()
            .catch((errorInfo) => {
                /** 错误信息 */
                const {errorFields} = errorInfo;
                if (errorFields?.length > 0) {
                    const errList = errorFields.map((x: any)=> x.errors[0]);
                    // TODO: 去重
                    const errArr: any = Array.from(new Set(errList));
                    const errInfo = errArr.toString().replace(/,/g, ',  /  ');
                    message.error(errInfo);
                }
            });
    };

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    // TODO: 获取列名<Title>
    const formLabel = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    const baseCGDON: any = {formRef, FormItem, handleChangeData};

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard title={'委托信息'} className={'ant-card'} bordered={true}>
                <Row gutter={rowGrid}>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('code', '业务编号')}>
                            {NBasicInfo?.Code}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {/*{Principal?.SalesManName}*/}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {/*{Principal?.SalesManName}*/}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {/*{Principal?.SalesManName}*/}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {/*{Principal?.SalesManName}*/}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {/*{Principal?.SalesManName}*/}
                        </FormItem>
                    </Col>
                </Row>
            </ProCard>

            <Form
                form={form}
                ref={formRef}
                name={'formCharge'}
                autoComplete={'off'}
                onFinish={handleSave}
                onFinishFailed={onFinishFailed}
            >
                <ProCard title={'费用信息'} className={'ant-card'} bordered={true} extra={
                    <div>
                        <span>Profit: </span>
                        <label>Profit: </label>
                        <label>Total Amount: </label>
                    </div>
                }>
                    {/* region AR */}
                    <Row gutter={24} className={'ant-margin-bottom-24'}>
                        <Col span={24}>
                            <ChargeTable
                                CGType={1}
                                {...baseCGDON}
                                CGList={receiveCGList}
                            />
                        </Col>
                    </Row>
                    {/* endregion AR */}

                    {/* region AP */}
                    <Row gutter={24}>
                        <Col span={24}>
                            <ChargeTable
                                CGType={2}
                                formRef={formRef}
                                FormItem={FormItem}
                                CGList={payCGList}
                                handleChangeData={handleChangeData}
                            />
                        </Col>
                    </Row>
                    {/* endregion AP */}
                </ProCard>
                <FooterToolbar extra={<Button onClick={() => history.goBack()}>返回</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>保存</Button>
                </FooterToolbar>
            </Form>
        </PageContainer>
    )
}
export default JobChargeInfo;