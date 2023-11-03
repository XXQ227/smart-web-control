import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormDateRangePicker, ProFormRadio,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import {Button, Col, Descriptions, Form, InputNumber, message, Row, Space, Table} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getCreditScore, getFormErrorMsg, getLabelByValue, keepDecimal, rowGrid} from '@/utils/units'
import {
    PROPERTY_AS_CUSTOMER,
    BUSINESS_TYPE,
    COLUMNS_CREDIT_SCORE,
    CREDIT_ASSESSMENT_SCORE_DATA,
    POSITION_IN_INDUSTRY, NATURE_OF_COMPANY, CREDIT_STANDING
} from '@/utils/common-data'
import ls from 'lodash'
import FormItemSelect from '@/components/FormItemComponents/FormItemSelect'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import moment from 'moment'
import {LeftOutlined, SaveOutlined, SendOutlined} from "@ant-design/icons";

const FormItem = Form.Item;

const CreditForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    const id = atob(params?.id);
    const buId = params?.buId ? atob(params?.buId || '0') : '';

    const {
        queryCreditControlInfo, addCreditControl, editCreditControl,
    } = useModel('system.credit', (res: any) => ({
        addCreditControl: res.addCreditControl,
        queryCreditControlInfo: res.queryCreditControlInfo,
        editCreditControl: res.editCreditControl,
    }));

    const {
        queryBusinessUnitPropertyCreditInfo
    } = useModel('system.business-unit', (res: any) => ({
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
    const [lastYearMarginProfit, setLastYearMarginProfit] = useState<any>(0);
    const [estimatedMarginProfit, setGrossProfitMargin] = useState<any>(0);

    /**
     * @Description: TODO: 获取 信控 详情
     * @author XXQ
     * @date 2023/8/9
     * @returns
     */
    const handleGetCreditInfo = async () => {
        setLoading(true);
        if (BusinessLineList?.length === 0) {
            await queryDictCommon({dictCodes: ['business_line']});
        }
        if (buId && buId !== '0') {
            const result: API.Result = await queryBusinessUnitPropertyCreditInfo({id: buId});
            if (result.success) {
                result.data = getCreditScoreInfo(result.data);
                const customerProperty = PROPERTY_AS_CUSTOMER.find(item => item.value === result.data.customerProperty)
                const enterpriseTypeValue = getLabelByValue(NATURE_OF_COMPANY, result.data.natureOfCompany);
                result.data.customerProperty = customerProperty?.label;
                result.data.natureOfCompany = enterpriseTypeValue?.natureOfCompany;
                result.data.businessLineType = result.data?.businessLineType?.split(",").map((item: string) => item.trim());
                setCreditInfoVO(result.data || {});
            }
            setLoading(false);
            return result;
        } else if (id !== '0') {
            const result: API.Result = await queryCreditControlInfo({id});
            if (result.success) {
                form.setFieldsValue({
                    name: result.data.name,
                    servicesType: result.data.servicesType,
                    purposeOfCallType: result.data.purposeOfCallType
                });
                result.data.totalScore = result.data.totalScore || 0;
                // TODO: Company Qualification 的数据
                const customerProperty = PROPERTY_AS_CUSTOMER.find(item => item.value === result.data.customerProperty)
                const enterpriseTypeValue = getLabelByValue(NATURE_OF_COMPANY, result.data.natureOfCompany);
                result.data.customerProperty = customerProperty?.label;
                result.data.natureOfCompany = enterpriseTypeValue?.natureOfCompany;
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
                result.data.lastYearPaymentOnCredit = result.data.lastYearPaymentOnCredit === 0 ? 0 : result.data.lastYearPaymentOnCredit ? 1 : result.data.lastYearPaymentOnCredit;
                // TODO: 业务类型信控业务的主要类型和业务线数据转化
                result.data.businessType = result.data?.businessType?.split(",").map((item: string) => item.trim());
                result.data.businessLineType = result.data?.businessLineType?.split(",").map((item: string) => item.trim());
                result.data = getCreditScoreInfo(result.data);
                setCreditInfoVO(result.data || {});
            } else {
                message.error(result.message);
            }
            setLoading(false);
            return result;
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
                    op_value = keepDecimal(result.registeredCapital*needDivided);
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
                case 5: // TODO: 预计月收入
                    op_value = keepDecimal(result.estimatedAnnualRevenue*needDivided) / 12;
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
        result.totalScore = result.totalScore.toFixed(1);
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
                setLastYearMarginProfit((Math.round(profitMargin * 100) / 100).toFixed(2));
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
            target = getCreditScore(target, fieldName === 'positionIndustry' ? 3 : 4, val);
        } else if (['estimatedAnnualRevenue', 'estimatedGrossProfit'].includes(fieldName)) {
            const estimatedAnnualRevenue = form.getFieldValue('estimatedAnnualRevenue');
            const estimatedGrossProfit = form.getFieldValue('estimatedGrossProfit');
            // TODO: 月营业额
            if (estimatedAnnualRevenue) {
                target = getCreditScore(target, 5, Number(estimatedAnnualRevenue) * 10000 / 12);
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
                setGrossProfitMargin((Math.round(profitMargin * 100) / 100).toFixed(2));
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
     * @param val    模板数据
     * @returns
     */
    const onFinish = async (val: any) => {
        setLoading(true);
        const saveResult: any = {
            branchId: '0',
            ...val,
            annualRevenue: keepDecimal(val.annualRevenue * 10000),
            cooperationStartTime: val.cooperationTime[0],
            cooperationEndTime: val.cooperationTime[1],
            businessType: val?.businessType?.toString(),
            estimatedAnnualRevenue: keepDecimal(val.estimatedAnnualRevenue * 10000),
            estimatedGrossProfit: keepDecimal(val.estimatedGrossProfit * 10000),
            totalScore: CreditInfoVO.totalScore,
            score1: CreditInfoVO.score1,
            score2: CreditInfoVO.score2,
            score3: CreditInfoVO.score3,
            score4: CreditInfoVO.score4,
            score5: CreditInfoVO.score5,
            score6: CreditInfoVO.score6,
            creditLevel: CreditInfoVO.creditLevel,
            creditExpiryStartTime: val.creditExpiryTime[0],
            creditExpiryEndTime: val.creditExpiryTime[1],
            customerId: CreditInfoVO?.customerId || buId,
            bizApproveDept: 0,
            lastYearAnnualRevenue: keepDecimal(val.lastYearAnnualRevenue * 10000),
            lastYearGrossProfit: keepDecimal(val.lastYearGrossProfit * 10000),
            lastYearCreditLine: keepDecimal(val.lastYearCreditLine * 10000),
            lastYearPaymentOnCredit: form.getFieldValue('lastYearPaymentOnCreditNumber') || 0,
            creditLine: keepDecimal(val.creditLine * 10000),
            creditStatus: 0,
        };
        delete saveResult.cooperationTime;
        delete saveResult.creditExpiryTime;
        delete saveResult.lastYearPaymentOnCreditNumber;
        delete saveResult.businessLineType;
        let result: API.Result;
        if (id === '0') {
            result = await addCreditControl(saveResult);
        } else {
            saveResult.id = id;
            result = await editCreditControl(saveResult);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') {
                history.push({pathname: `/manager/credit/form/${btoa(result.data)}`});
            }
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
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
                initialValues={CreditInfoVO}
                formKey={'credit-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetCreditInfo()}
            >
                <ProCard
                    className={'ant-card'}
                    title={'Company Qualification'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col span={24}>
                            <Descriptions className={'headerList'} column={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4}}>
                                <Descriptions.Item label="Customer Name">{CreditInfoVO.customerName}</Descriptions.Item>
                                <Descriptions.Item label="Property (as Customer)">{CreditInfoVO.customerProperty}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Nature of Company">{CreditInfoVO.natureOfCompany}</Descriptions.Item>
                                <Descriptions.Item label="Industry">{CreditInfoVO.industryName}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Established Date">{moment(CreditInfoVO.establishedDate).format('YYYY-MM-DD')}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Registered Capital">{CreditInfoVO.registeredCapital}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Paid-in Capital">{CreditInfoVO.paidInCapital}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Legal Person/ Director">{CreditInfoVO.corporation}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={23} sm={23} md={12} lg={8} xl={8} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                name='annualRevenue'
                                label='Annual Revenue'
                                fieldProps={{suffix}}
                                rules={[{required: true, message: 'Annual Revenue'}]}
                            />
                        </Col>
                        <Col xs={23} sm={23} md={12} lg={8} xl={8} xxl={5}>
                            <FormItemSelect
                                required
                                label='Position in Industry'
                                name='positionIndustry'
                                options={POSITION_IN_INDUSTRY}
                                onSelect={(e: any) => handleScoreChange(e, 'positionIndustry', 3)}
                                rules={[{required: true, message: 'Position in Industry'}]}
                            />
                        </Col>
                        <Col xs={23} sm={23} md={12} lg={8} xl={8} xxl={5}>
                            <FormItemSelect
                                required
                                label='Credit Standing'
                                name='creditStanding'
                                options={CREDIT_STANDING}
                                onSelect={(e: any) => handleScoreChange(e, 'creditStanding', 4)}
                                rules={[{required: true, message: 'Credit Standing'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Cooperation Review'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={9} xl={6} xxl={5}>
                            <ProFormDateRangePicker
                                required
                                name="cooperationTime"
                                label="In cooperation time"
                                placeholder={['Start', 'End']}
                                rules={[{required: true, message: 'In cooperation time'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={15} xl={8} xxl={8}>
                            <ProFormText
                                name='teams'
                                placeholder=''
                                label='Our Team'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={23} xl={10} xxl={8}>
                            <ProFormCheckbox.Group
                                placeholder=''
                                name='businessType'
                                label='Business Type'
                                options={BUSINESS_TYPE}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={23} lg={24} xl={23} xxl={21}>
                            <ProFormTextArea
                                placeholder=''
                                label='Remark'
                                name='cooperationRemark'
                                fieldProps={{rows: 3}}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Last year\'s Summary'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={9} xxl={8}>
                            <ProFormText
                                placeholder=''
                                name='lastYearTotalShipmentVolume'
                                label='Total Shipment Volume'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={5} xxl={4}>
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
                        <Col xs={24} sm={24} md={12} lg={6} xl={5} xxl={4}>
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
                        <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                            <FormItem label={'Gross Profit Rate'} className={'ant-form-span-center'}>
                                <span> {lastYearMarginProfit || (Math.round(CreditInfoVO.lastYearMarginProfit * 100) / 100).toFixed(2)} % </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearCreditLine'
                                label='Credit Line'
                                className={'ant-input-suffix'}
                                fieldProps={{suffix}}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearCreditDays'
                                label='Credit Days'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearActualCreditDays'
                                label='Actual Credit Days'
                            />
                        </Col>
                        <Col xs={16} sm={24} md={24} lg={24} xl={10} xxl={10} className={'ant-col-payment-credit'}>
                            <Space direction="horizontal" align="center" className={'siteSpace'}>
                                {/*<FormItem label='Payment On Credit' name={'lastYearPaymentOnCredit'} style={{border: '1px solid green'}}>
                                    <Radio.Group
                                        name='lastYearPaymentOnCredit'
                                        onChange={handleLastYearPaymentOnCredit}
                                        options={[
                                            {value: 0, label: 'In good condition'},
                                            {value: 1, label: 'Overdue payments'},
                                        ]}
                                    />
                                </FormItem>*/}
                                <ProFormRadio.Group
                                    label="Payment On Credit"
                                    name={'lastYearPaymentOnCredit'}
                                    options={[
                                        {value: 0, label: 'In good condition'},
                                        {value: 1, label: 'Overdue payments'},
                                    ]}
                                    fieldProps={{
                                        onChange: handleLastYearPaymentOnCredit
                                    }}
                                />
                                <FormItem
                                    className={'payment-credit-number'}
                                    name={'lastYearPaymentOnCreditNumber'}
                                >
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        onChange={handleLastYearPaymentOnCreditNumber}
                                        onStep={handleLastYearPaymentOnCreditNumber}
                                    />
                                </FormItem>
                                <label>Times</label>
                            </Space>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Estimated income for this year'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={23} sm={23} md={18} lg={12} xl={9} xxl={8}>
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
                        <Col xs={23} sm={23} md={9} lg={6} xl={5} xxl={4}>
                            <FormItemInput
                                required
                                id={'estimatedAnnualRevenue'}
                                name={'estimatedAnnualRevenue'}
                                label={'Annual Revenue'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'estimatedAnnualRevenue', 5)}
                                rules={[{required: true, message: 'Annual Revenue'}]}
                            />
                        </Col>
                        <Col xs={23} sm={23} md={9} lg={6} xl={5} xxl={4}>
                            <FormItemInput
                                required
                                id={'estimatedGrossProfit'}
                                name={'estimatedGrossProfit'}
                                label={'Gross Profit'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'estimatedGrossProfit', 6)}
                                rules={[{required: true, message: 'Gross Profit'}]}
                            />
                        </Col>
                        <Col xs={23} sm={23} md={6} lg={8} xl={5} xxl={4}>
                            <FormItem label={'Gross Profit Rate'} className={'ant-form-span-center'}>
                                <span> {estimatedMarginProfit || (Math.round(CreditInfoVO.estimatedMarginProfit * 100) / 100).toFixed(2)} % </span>
                            </FormItem>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Credit Assessment'}
                    headerBordered
                    collapsible
                >
                    <Table
                        rowKey={'id'}
                        bordered={true}
                        pagination={false}
                        dataSource={ScoreData}
                        columns={COLUMNS_CREDIT_SCORE}
                        className={'ant-pro-table-edit ant-pro-table-credit'}
                    />
                    <Row gutter={rowGrid} className={'ant-row-score'}>
                        <Col span={24}>
                            <label>Assessment Results————</label>
                            <span>
                                <Space>
                                    <Space>Score: <b>{CreditInfoVO.totalScore || null}</b></Space>
                                    <label><Space>Credit Level: <b>{CreditInfoVO.creditLevel}</b></Space></label>
                                </Space>
                            </span>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Credit Result'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4} className={'ant-input-text-bold'}>
                            <ProFormText
                                required
                                placeholder=''
                                name='creditLine'
                                label='Credit Line'
                                fieldProps={{suffix}}
                                rules={[{required: true, message: 'Credit Line'}]}
                            />
                            {/*<FormItemInput
                                required
                                id={'creditLine'}
                                name={'creditLine'}
                                label={'Credit Line'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                rules={[{required: true, message: 'Credit Line'}]}
                            />*/}
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={4} className={'ant-input-text-center'}>
                            <ProFormText
                                required
                                placeholder=''
                                name='creditDays'
                                label='Credit Days'
                                rules={[{required: true, message: 'Credit Days'}]}
                                // allowClear={false}
                            />
                            {/*<FormItemInput
                                required
                                id={'creditDays'}
                                name={'creditDays'}
                                label={'Credit Days'}
                                className={'ant-input-suffix'}
                                suffix={<span className={'ant-input-suffix-span'}> Days</span>}
                                rules={[{required: true, message: 'Credit Days'}]}
                            />*/}
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormDateRangePicker
                                required
                                name="creditExpiryTime"
                                label="Period of credit"
                                placeholder={['Start', 'End']}
                                rules={[{required: true, message: 'Period of credit'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={11}>
                            <ProFormCheckbox.Group
                                disabled={true}
                                name='businessLineType'
                                label="Business Line"
                                options={BusinessLineList}
                            />
                        </Col>
                        <Col span={23}>
                            <ProFormTextArea
                                placeholder=''
                                name='remark'
                                label='Remark'
                                fieldProps={{rows: 3}}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={
                        <Button onClick={() => history.push({pathname: '/system/credit'})} icon={<LeftOutlined/>}>
                            Back
                        </Button>
                    }
                >
                    <Button key={'submit'} type={'primary'} htmlType={'submit'} icon={<SaveOutlined/>}>
                        Save
                    </Button>
                    <Button type={'primary'} icon={<SendOutlined/>}
                        // onClick={handleOperateBUP}
                    >
                        Save & Submit
                    </Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default CreditForm;