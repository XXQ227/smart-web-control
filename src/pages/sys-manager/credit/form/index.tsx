import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormDateRangePicker,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import {Button, Col, Descriptions, Form, InputNumber, message, Radio, Row, Space, Table} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getCreditScore, getFormErrorMsg, keepDecimal} from '@/utils/units'
import {
    BUSINESS_TYPE,
    COLUMNS_CREDIT_SCORE,
    CREDIT_ASSESSMENT_SCORE_DATA,
    POSITION_IN_INDUSTRY
} from '@/utils/common-data'
import ls from 'lodash'
import FormItemSelect from '@/components/FormItemComponents/FormItemSelect'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import moment from 'moment'

const FormItem = Form.Item;

type APICredit = APIManager.Credit;

const CreditForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const {push} = history;
    const formRef = useRef<ProFormInstance>();
    const id = atob(params?.id);
    const buId = params?.buId ? atob(params?.buId || '0') : '';

    const {
        queryCreditControlInfo, addCreditControl, editCreditControl,
    } = useModel('manager.credit', (res: any) => ({
        addCreditControl: res.addCreditControl,
        queryCreditControlInfo: res.queryCreditControlInfo,
        editCreditControl: res.editCreditControl,
    }));
    const {queryBusinessUnitPropertyCreditInfo} = useModel('manager.cv-center', (res: any) => ({
        queryBusinessUnitPropertyCreditInfo: res.queryBusinessUnitPropertyCreditInfo,
    }));
    const {
        queryDictCommon, BusinessLineList
    } = useModel('common', (res: any) => ({
        queryDictCommon: res.queryDictCommon,
        BusinessLineList: res.BusinessLineList,
    }))

    const [loading, setLoading] = useState<boolean>(false);
    const [CreditInfoVO, setCreditInfoVO] = useState<any>({});
    const [ScoreData, setScoreData] = useState<any[]>(CREDIT_ASSESSMENT_SCORE_DATA);
    const [lastYearMarginProfit, setLastYearMarginProfit] = useState<number>(0);
    const [estimatedMarginProfit, setGrossProfitMargin] = useState<number>(0);

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCreditByID(paramsVal: APICredit) {
        setLoading(true);
        if (BusinessLineList?.length === 0) {
            await queryDictCommon({dictCodes: ['business_line']});
        }
        if (buId && buId !== '0') {
            const result: API.Result = await queryBusinessUnitPropertyCreditInfo({id: buId});
            result.data = getCreditScoreInfo(result.data);
            setCreditInfoVO(result.data || {});
            setLoading(false);
            return result.data;
        } else if (id !== '0') {
            const result: API.Result = await queryCreditControlInfo(paramsVal);
            if (result.success) {
                form.setFieldsValue({
                    name: result.data.name,
                    servicesType: result.data.servicesType,
                    purposeOfCallType: result.data.purposeOfCallType
                });
                result.data.totalScore = result.data.totalScore || 0;
                // TODO: 需要除以 10000 的数据
                if (result.data.annualRevenue) result.data.annualRevenue = keepDecimal(result.data.annualRevenue / 10000);
                if (result.data.lastYearAnnualRevenue) result.data.lastYearAnnualRevenue = keepDecimal(result.data.lastYearAnnualRevenue / 10000);
                if (result.data.lastYearGrossProfit) result.data.lastYearGrossProfit = keepDecimal(result.data.lastYearGrossProfit / 10000);
                if (result.data.lastYearCreditLine) result.data.lastYearCreditLine = keepDecimal(result.data.lastYearCreditLine / 10000);
                if (result.data.estimatedAnnualRevenue) result.data.estimatedAnnualRevenue = keepDecimal(result.data.estimatedAnnualRevenue / 10000);
                if (result.data.estimatedGrossProfit) result.data.estimatedGrossProfit = keepDecimal(result.data.estimatedGrossProfit / 10000);
                if (result.data.creditLine) result.data.creditLine = keepDecimal(result.data.creditLine / 10000);
                // TODO: 时间范围
                result.data.creditExpiryTime = [result.data.creditExpiryStartTime, result.data.creditExpiryEndTime];
                result.data.cooperationTime = [result.data.cooperationStartTime, result.data.cooperationEndTime];
                // TODO: 毛利率
                result.data.lastYearMarginProfit = (result.data.lastYearGrossProfit / result.data.lastYearAnnualRevenue) * 100;
                result.data.estimatedMarginProfit = (result.data.estimatedGrossProfit / result.data.estimatedAnnualRevenue) * 100;
                // TODO: 赊销次数
                result.data.lastYearPaymentOnCreditNumber = result.data.lastYearPaymentOnCredit ? result.data.lastYearPaymentOnCredit : null;
                result.data.lastYearPaymentOnCredit = result.data.lastYearPaymentOnCredit ? 1 : 0;
                result.data = getCreditScoreInfo(result.data);
            } else {
                message.error(result.message);
            }
            setCreditInfoVO(result.data || {});
            setLoading(false);
            return result.data;
        } else {
            setLoading(false);
            return {totalScore: 0};
        }
    }

    /**
     * @Description: TODO: 信控成绩
     * @author XXQ
     * @date 2023/7/17
     * @param result 信控数据
     * @returns
     */
    function getCreditScoreInfo(result: any) {
        result.totalScore = 0;
        let newData = ls.cloneDeep(ScoreData);
        // TODO: 当第一次创建信控时，把 【注册资金、注册时间、年营收】 的计分先计算出来
        const needDivided = buId && buId !== '0' ? 1 : 10000;
        newData = newData.map((item: any) => {
            let op_value: any = null;
            switch (item.id) {
                case 1: // TODO: 注册资金
                    op_value = keepDecimal(result.annualRevenue*needDivided);
                    break;
                case 2: // TODO: 注册时间（年限）
                    op_value = result.establishedDate;
                    break;
                case 3: // TODO: 行业地位
                    op_value = result.positionIndustry;
                    break;
                case 4: // TODO: 信用等级
                    op_value = result.creditStanding;
                    break;
                case 5: // TODO: 本年度预计应收
                    op_value = keepDecimal(result.estimatedAnnualRevenue*needDivided);
                    break;
                case 6: // TODO: 本年度预计营收毛利率
                    if (result.estimatedGrossProfit && result.estimatedAnnualRevenue) {
                        op_value = keepDecimal(Number(result.estimatedGrossProfit) / Number(result.estimatedAnnualRevenue) * 100);
                    } else {
                        op_value = 0;
                    }
                    break;
                default:
                    break;
            }
            // TODO: 获取成绩分数
            const target: any = getCreditScore(item, item.id, op_value);
            result[`score${target.id}`] = target.score;
            result.totalScore += keepDecimal(target.totalScore);
            return target;
        });
        setScoreData(newData);
        result.creditLevel = getCreditLevel(result.totalScore);
        return result;
    }

    // TODO: 赊销执行情况 ==> Payment On Credit
    const handleLastYearPaymentOnCredit = (val: any) => {
        form.setFieldsValue({lastYearPaymentOnCreditNumber: val?.target.value || null});
    }
    const handleLastYearPaymentOnCreditNumber = (val: any) => {
        console.log(val);
        form.setFieldsValue({lastYearPaymentOnCredit: 1});
    }

    /**
     * @Description: TODO: 信控等级
     * @author XXQ
     * @date 2023/7/17
     * @param op_value 分数
     * @returns
     */
    function getCreditLevel(op_value: number) {
        let creditLevel = '';
        if (op_value < 1) {
            creditLevel = 'C';
        } else if (1 <= op_value && op_value < 2) {
            creditLevel = 'B';
        } else if (2 <= op_value && op_value < 3) {
            creditLevel = 'A';
        } else if (3 <= op_value && op_value < 4) {
            creditLevel = 'AA';
        } else if (4 <= op_value) {
            creditLevel = 'AAA';
        }
        return creditLevel;
    }

    /**
     * @Description: TODO: 分数评估
     * @author XXQ
     * @date 2023/7/17
     * @param val
     * @param fieldName
     * @returns
     */
    const handleCreditChange = (val: any, fieldName: string) => {
        if (['lastYearAnnualRevenue', 'lastYearGrossProfit'].includes(fieldName)) {
            const annualRevenue = form.getFieldValue('lastYearAnnualRevenue');
            const grossProfit = form.getFieldValue('lastYearGrossProfit');
            // TODO: 计算当年毛利率
            if (annualRevenue && grossProfit) {
                const profitMargin = keepDecimal(Number(grossProfit) / Number(annualRevenue) * 100);
                setLastYearMarginProfit(profitMargin);
            }
        }
    }

    /**
     * @Description: TODO: 分数评估
     * @author XXQ
     * @date 2023/7/17
     * @param val
     * @param fieldName
     * @param rowKey
     * @returns
     */
    const handleScoreChange = (val: any, fieldName: string, rowKey: number) => {
        const newData = ls.cloneDeep(ScoreData);
        let target: any = newData.find((item: any) => item.id === rowKey) || {};
        // TODO: 行业地位, 信用情况
        if (['positionIndustry', 'creditStanding'].includes(fieldName)) {
            target.score = val;
            CreditInfoVO[`score${target.id}`] = target.score;
            target = getCreditScore(target, fieldName === 'positionIndustry' ? 4 : 3, val);
        } else if (['estimatedAnnualRevenue', 'estimatedGrossProfit'].includes(fieldName)) {
            const estimatedAnnualRevenue = form.getFieldValue('estimatedAnnualRevenue');
            const estimatedGrossProfit = form.getFieldValue('estimatedGrossProfit');
            // TODO: 年营业额
            if (estimatedAnnualRevenue) {
                target = getCreditScore(target, 5, Number(estimatedAnnualRevenue) * 10000);
                CreditInfoVO.score5 = target.score;
            }
            // TODO: 计算当年毛利率
            if (estimatedAnnualRevenue && estimatedGrossProfit) {
                const profitMargin = keepDecimal(Number(estimatedGrossProfit) / Number(estimatedAnnualRevenue) * 100);
                // TODO: 当前操作数据为 年营业额 时,需要再计算毛利率
                if (rowKey === 5) {
                    let target6 = newData.find((item: any) => item.id === 6);
                    target6 = getCreditScore(target6, 6, profitMargin);
                    CreditInfoVO.score6 = target6.score;
                    newData.splice(5, 1, target6);
                } else {
                    // TODO: 否则直接计算毛利率
                    target = getCreditScore(target, 6, profitMargin);
                }
                setGrossProfitMargin(profitMargin);
            }
        }
        // TODO: 单独拿到成绩，用来评定客户信控等级
        let totalScore: number = 0;
        newData.map(item=> totalScore += item.totalScore);
        // TODO: 获取客户信控等级
        CreditInfoVO.totalScore = keepDecimal(totalScore);
        CreditInfoVO.creditLevel = getCreditLevel(totalScore);
        setCreditInfoVO(CreditInfoVO || {});
        // TODO: 更新评分数据
        newData.splice(rowKey - 1, 1, target);
        setScoreData(newData);
    }

    /**
     * @Description: TODO: 保存模板数据
     * @author XXQ
     * @date 2023/6/25
     * @param values    模板数据
     * @returns
     */
    const handleSave = async (values: any) => {
        setLoading(true);

        const saveResult: any = {
            id,
            branchId: '0',
            ...values,
            businessType: values.businessType.toString(),
            cooperationStartTime: values.cooperationTime[0],
            cooperationEndTime: values.cooperationTime[1],
            creditExpiryStartTime: values.creditExpiryTime[1],
            creditExpiryEndTime: values.creditExpiryTime[1],
            lastYearPaymentOnCredit: form.getFieldValue('lastYearPaymentOnCreditNumber') || 0,
            customerId: CreditInfoVO.customerId || buId,
            score1: CreditInfoVO.score1,
            score2: CreditInfoVO.score2,
            score3: CreditInfoVO.score3,
            score4: CreditInfoVO.score4,
            score5: CreditInfoVO.score5,
            score6: CreditInfoVO.score6,
            totalScore: CreditInfoVO.totalScore,
            creditLevel: CreditInfoVO.creditLevel,
            bizApproveDept: 0,
            creditBusinessList: '',

            annualRevenue: keepDecimal(values.annualRevenue * 10000),
            lastYearAnnualRevenue: keepDecimal(values.lastYearAnnualRevenue * 10000),
            lastYearGrossProfit: keepDecimal(values.lastYearGrossProfit * 10000),
            lastYearCreditLine: keepDecimal(values.lastYearCreditLine * 10000),
            estimatedAnnualRevenue: keepDecimal(values.estimatedAnnualRevenue * 10000),
            estimatedGrossProfit: keepDecimal(values.estimatedGrossProfit * 10000),
            creditLine: keepDecimal(values.creditLine * 10000),
        };
        delete values.cooperationTime;
        delete values.creditExpiryTime;
        let result: API.Result;
        if (id === '0') {
            result = await addCreditControl(saveResult);
        } else {
            result = await editCreditControl(saveResult);
        }
        setLoading(false);
        if (result.success) {
            message.success('Success!');
            if (id === '0') {
                history.push({pathname: `/manager/charge-template/form/${btoa(result.data)}`});
            }
        } else {
            message.error(result.message);
        }
    }

    const suffix = <span className={'ant-input-suffix-span'}>10K CNY</span>;

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={CreditInfoVO || {}}
                formKey={'branch-information'}
                // TODO: 提交数据
                onFinish={handleSave}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                // @ts-ignore
                request={async () => handleGetCreditByID({id})}
            >
                <ProCard title={'Company Qualification'} className={'ant-card'}>
                    <Row gutter={24} style={{marginBottom: 12}}>
                        <Col span={24}>
                            <Descriptions column={4}>
                                <Descriptions.Item label="Customer">{CreditInfoVO.customerName}</Descriptions.Item>
                                <Descriptions.Item label="Property">{CreditInfoVO.customer}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Nature of Company">{CreditInfoVO.natureOfCompany}</Descriptions.Item>
                                <Descriptions.Item label="Industry">{CreditInfoVO.industryName}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Established Date">{moment(CreditInfoVO.establishedDate).format('YYYY-MM-DD')}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Registered Capital">{CreditInfoVO.registeredCapital}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Legal Person/ Director">{CreditInfoVO.legalPersonDirector}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                placeholder=''
                                name='annualRevenue'
                                label='Annual Revenue'
                                fieldProps={{suffix}}
                                rules={[{required: true, message: 'Annual Revenue'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <FormItemSelect
                                required
                                name={'positionIndustry'}
                                label={'Position in industry'}
                                options={POSITION_IN_INDUSTRY} FormItem={FormItem}
                                onSelect={(e: any) => handleScoreChange(e, 'positionIndustry', 3)}
                                rules={[{required: true, message: 'Position in industry'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <FormItemSelect
                                required
                                label='Credit Standing'
                                name={'creditStanding'}
                                options={POSITION_IN_INDUSTRY} FormItem={FormItem}
                                onSelect={(e: any) => handleScoreChange(e, 'creditStanding', 4)}
                                rules={[{required: true, message: 'Credit Standing'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Cooperation Review'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <ProFormDateRangePicker
                                name="cooperationTime" label="In cooperation time"
                                placeholder={['Start', 'End']}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormText
                                name='teams'
                                placeholder=''
                                label='Our Team'
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormCheckbox.Group
                                placeholder=''
                                name='businessType'
                                label='Business Typ'
                                options={BUSINESS_TYPE}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea
                                placeholder=''
                                label='Remark'
                                name='cooperationRemark'
                                fieldProps={{rows: 3}}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Last year\'s Summary'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                placeholder=''
                                name='lastYearTotalShipmentVolume'
                                label='Total Shipment Volume'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                label='Annual Revenue'
                                name='lastYearAnnualRevenue'
                                className={'ant-input-suffix'}
                                fieldProps={{
                                    suffix,
                                    onChange: (val: any) => handleCreditChange(val, 'lastYearAnnualRevenue')
                                }}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearGrossProfit'
                                label='Gross Profit'
                                className={'ant-input-suffix'}
                                fieldProps={{
                                    suffix,
                                    onChange: (val: any) => handleCreditChange(val, 'lastYearGrossProfit')
                                }}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItem label={'Gross Profit Rate'} className={'ant-form-span-center'}>
                                <span> {lastYearMarginProfit || CreditInfoVO.lastYearMarginProfit} % </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearCreditLine'
                                label='Credit Line'
                                className={'ant-input-suffix'}
                                fieldProps={{suffix}}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearCreditDays'
                                label='Credit Days'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearActualCreditDays'
                                label='Actual Credit Days'
                            />
                        </Col>
                        <Col span={12} className={'ant-col-payment-credit'}>
                            <Space>
                                <FormItem label='Payment On Credit' name={'lastYearPaymentOnCredit'}>
                                    <Radio.Group
                                        name='lastYearPaymentOnCredit'
                                        onChange={handleLastYearPaymentOnCredit}
                                        options={[
                                            {value: 0, label: 'in good condition'},
                                            {value: 1, label: 'Overdue payments'},
                                        ]}
                                    />
                                </FormItem>
                                <FormItem
                                    className={'payment-credit-number'}
                                    name={'lastYearPaymentOnCreditNumber'}
                                >
                                    <InputNumber
                                        min={1} max={10}
                                        onChange={handleLastYearPaymentOnCreditNumber}
                                        onStep={handleLastYearPaymentOnCreditNumber}
                                    />
                                </FormItem>
                            </Space>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Estimated income for this year'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                placeholder=''
                                name='estimatedTotalShipmentVolume'
                                label='Total Shipment Volume'
                                rules={[{required: true, message: 'Total Shipment Volume'}, {
                                    max: 200,
                                    message: 'length: 200'
                                }]}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItemInput
                                required
                                placeholder=''
                                id={'estimatedAnnualRevenue'}
                                name={'estimatedAnnualRevenue'}
                                label={'Annual Revenue'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                FormItem={FormItem}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'estimatedAnnualRevenue', 5)}
                                rules={[{required: true, message: 'Annual Revenue'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItemInput
                                required
                                placeholder=''
                                id={'estimatedGrossProfit'}
                                name={'estimatedGrossProfit'}
                                label={'Gross Profit'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                FormItem={FormItem}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'estimatedGrossProfit', 6)}
                                rules={[{required: true, message: 'Gross Profit'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItem label={'Gross Profit Rate'} className={'ant-form-span-center'}>
                                <span> {estimatedMarginProfit || CreditInfoVO.estimatedMarginProfit} % </span>
                            </FormItem>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Credit Assessment'} className={'ant-card'}>
                    <Table
                        rowKey={'id'}
                        bordered={true}
                        pagination={false}
                        dataSource={ScoreData}
                        columns={COLUMNS_CREDIT_SCORE}
                        className={'ant-pro-table-edit'}
                    />
                    <Row gutter={24} className={'ant-row-score'}>
                        <Col span={24}>
                            <label>Assessment Results————</label>
                            <span>
                                <Space>
                                    <Space>Score: {CreditInfoVO.totalScore}</Space>
                                    <label><Space>Credit Level: {CreditInfoVO.creditLevel}</Space></label>
                                </Space>
                            </span>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Credit Result'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={4}>
                            <FormItemInput
                                required
                                placeholder=''
                                id={'creditLine'}
                                name={'creditLine'}
                                label={'Credit Line'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                FormItem={FormItem}
                                rules={[{required: true, message: 'Credit Line'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItemInput
                                required
                                placeholder=''
                                id={'creditDays'}
                                name={'creditDays'}
                                label={'Credit Days'}
                                className={'ant-input-suffix'}
                                suffix={<span className={'ant-input-suffix-span'}> Days</span>}
                                FormItem={FormItem}
                                rules={[{required: true, message: 'Credit Days'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormDateRangePicker
                                required
                                name="creditExpiryTime" label="Period of credit"
                                placeholder={['Start', 'End']}
                            />
                        </Col>
                        {/*<Col span={8}>
                            <ProFormCheckbox.Group
                                name='businessLine' label="Business Line" options={BusinessLineList}
                            />
                        </Col>*/}
                        <Col span={24}>
                            <ProFormTextArea placeholder='' name='remark' label='Remark' fieldProps={{rows: 3}}/>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => push({pathname: '/manager/credit'})}>Back</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default CreditForm;