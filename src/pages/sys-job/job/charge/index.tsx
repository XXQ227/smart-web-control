import React, {useEffect, useState, useRef} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row} from 'antd';
import {history, useModel, useIntl} from 'umi';
import {colGrid, getFormErrorMsg, getTitleInfo, rowGrid} from '@/utils/units';
import ChargeTable from '@/pages/sys-job/job/charge/chargeTable';
import type {FormInstance} from 'antd/es/form'


const FormItem = Form.Item;

// TODO: 数据类型1
type APICGInfo = APIModel.PRCGInfo;

let isLoadingData = false;
const JobChargeInfo: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    //region TODO: 数据层
    const {
        JobChargeInfo: {NBasicInfo, PayCGList, ReceiveCGList}, getCJobCGByID
    } = useModel('job.jobCharge', (res: any) => ({
        JobChargeInfo: res.JobChargeInfo,
        getCJobCGByID: res.getCJobCGByID,
    }));
    //endregion

    /** 实例化Form */
    const [form] = Form.useForm();
    const formRef = useRef<FormInstance>(null);
    // TODO: form.current 里【取值、改值】的方法
    const formCurrent: any = formRef?.current;

    const [jobID, setJobID] = useState(0);
    // TODO: 用来判断是否是第一次加载数据
    const [loading, setLoading] = useState(false);

    const [payCGList, setPayCGList] = useState<APICGInfo[]>(PayCGList || []);
    const [receiveCGList, setReceiveCGList] = useState<APICGInfo[]>(ReceiveCGList || []);
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
                    const apChangeList: APICGInfo[] = payCGList.filter((item: APICGInfo)=> item.isChange) || [];
                    const arChangeList: APICGInfo[] = receiveCGList.filter((item: APICGInfo)=> item.isChange) || [];
                    const isChangeCG: APICGInfo[] = [...arChangeList, ...apChangeList];
                    console.log(isChangeCG, arChangeList );
                } else {
                    message.info('没有需要保存的数据');
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    // TODO: 获取列名<Title>
    const formLabel = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    // TODO: 传给子组件的参数
    const baseCGDON: any = {form, formRef, formCurrent, FormItem, handleChangeData};

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
                onFinishFailed={handleSave}
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
                                {...baseCGDON}
                                CGList={payCGList}
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