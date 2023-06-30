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
import {Button, Col, Form, InputNumber, message, Radio, Row, Space, Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {history, useModel, useParams} from 'umi'
import {getCreditScore, getFormErrorMsg, keepDecimal} from '@/utils/units'
import {BUSINESS_TYPE, CREDIT_ASSESSMENT_SCORE_DATA, POSITION_IN_INDUSTRY} from '@/utils/common-data'
import ls from 'lodash'
import FormItemSelect from '@/components/FormItemComponents/FormItemSelect'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'

const FormItem = Form.Item;

type APICredit = APIManager.Credit;

const CreditForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const {push, location: {pathname}} = history;
    const formRef = useRef<ProFormInstance>();
    const id = atob(params?.id);

    const {
        queryCreditControlInfo, //addCreditControl, editCreditControl,
    } = useModel('manager.credit', (res: any) => ({
        addCreditControl: res.addCreditControl,
        queryCreditControlInfo: res.queryCreditControlInfo,
        editCreditControl: res.editCreditControl,
    }));
    const {
        queryDictCommon, BusinessLineList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        BusinessLineList: res.BusinessLineList,
    }))

    const [loading, setLoading] = useState<boolean>(false);
    const [CreditInfoVO, setCreditInfoVO] = useState<any>({});
    const [ScoreData, setScoreData] = useState<any[]>(CREDIT_ASSESSMENT_SCORE_DATA);
    const [grossProfitMargin, setGrossProfitMargin] = useState<number>(0);

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
        if (id !== '0') {
            const result: API.Result = await queryCreditControlInfo(paramsVal);
            if (result.success) {
                form.setFieldsValue({
                    name: result.data.name,
                    servicesType: result.data.servicesType,
                    purposeOfCallType: result.data.purposeOfCallType
                });
                const ctInfo = result.data?.CTInfo || {};
                result.data.totalScore = result.data.totalScore || 0;
                if (!result.data.totalScore) {
                    let newData = ls.cloneDeep(ScoreData);
                    // TODO: 当第一次创建信控时，把 【注册资金、注册时间、年营收】 的计分先计算出来
                    newData = newData.map((item: any) => {
                        let op_value: any = null;
                        switch (item.id) {
                            case 1: // TODO: 注册资金
                                op_value = ctInfo.registeredCapital;
                                break;
                            case 2: // TODO: 注册时间（年限）
                                op_value = '2008-06-23';
                                break;
                            case 5: // TODO: 年营收
                                op_value = ctInfo.estimatedIncome;
                                break;
                            default:
                                break;
                        }
                        const target: any = getCreditScore(item, item.id, op_value);
                        result.data.totalScore = target.totalScore;
                        return target;
                    });
                    setScoreData(newData);
                    result.data.creditLevel = getCreditLevel(result.data.totalScore);
                }
            } else {
                message.error(result.message);
            }
            setCreditInfoVO(result.data);
            setLoading(false);
            return result.data;
        } else {
            setLoading(false);
            return {totalScore: 0};
        }
    }

    // TODO: 赊销执行情况 ==> Payment On Credit
    const handleLastYearPaymentOnCredit = (val: any) => {
        form.setFieldsValue({lastYearPaymentOnCreditNumber: val?.target.value || null});
    }
    const handleLastYearPaymentOnCreditNumber = (val: any) => {
        console.log(val);
        form.setFieldsValue({lastYearPaymentOnCredit: 1});
    }

    function getCreditLevel (op_value: number) {
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
    const handleScoreChange = (val: any, fieldName: string, rowKey: number) => {
        const newData = ls.cloneDeep(ScoreData);
        console.log(CreditInfoVO);
        let target: any = newData.find((item: any) => item.id === rowKey) || {};
        if (['customerLevel', 'creditRatingType'].includes(fieldName)) {
            target.score = val;
            target = getCreditScore(target, fieldName === 'customerLevel' ? 4 : 3, val);
        } else if (['annualRevenue', 'grossProfit'].includes(fieldName)) {
            const annualRevenue = form.getFieldValue('annualRevenue');
            const grossProfit = form.getFieldValue('grossProfit');
            // TODO: 计算当年毛利率
            if (annualRevenue && grossProfit) {
                const profitMargin = keepDecimal(Number(grossProfit)/Number(annualRevenue)*100);
                target = getCreditScore(target, 6, profitMargin);
                setGrossProfitMargin(profitMargin);
            }
        }
        // TODO: 单独拿到成绩，用来评定客户信控等级
        let totalScore: number = 0;
        newData.map(item=> totalScore += item.totalScore);
        // TODO: 获取客户信控等级
        CreditInfoVO.totalScore = totalScore;
        CreditInfoVO.creditLevel = getCreditLevel(totalScore);
        setCreditInfoVO(CreditInfoVO);
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
        const saveId = pathname.indexOf('/copy') > -1 ? '' : id;
        const saveResult: any = {
            id: saveId,
            branchId: '0',
            ...values,
        };
        console.log(saveResult)
        /*let result: API.Result;
        if (saveId === '0') {
            result = await addCreditControl(saveResult);
        } else {
            result = await editCreditControl(saveResult);
        }*/
        setLoading(false);
        /*if (result.success) {
            message.success('Success!');
            if (saveId === '0') {
                history.push({pathname: `/manager/charge-template/form/${btoa(result.data)}`})
            }
        } else {
            message.error(result.message);
        }*/
    }

    const suffix = <span className={'ant-input-suffix-span'}>10K CNY</span>;

    const columns: ColumnsType<APICredit> = [
        {title: 'Assessment Item', dataIndex: 'assessmentItem', align: 'center', width: '21%',},
        {title: 'Score Weight', dataIndex: 'scoreWeight', align: 'center', width: '8%',},
        {title: 'Score 1', dataIndex: 'score1', align: 'center', width: '15%',},
        {title: 'Score 2', dataIndex: 'score2', align: 'center', width: '15%',},
        {title: 'Score 3', dataIndex: 'score3', align: 'center', width: '10%',},
        {title: 'Score 4', dataIndex: 'score4', align: 'center', width: '14%',},
        {title: 'Score 5', dataIndex: 'score5', align: 'center', width: '9%',},
        {title: 'Score', dataIndex: 'score', align: 'center', width: '8%',},
    ];

    console.log()

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                form={form}
                omitNil={false}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput={true}
                formKey={'charge-template'}
                // TODO: 设置默认值
                initialValues={CreditInfoVO}
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
                        <Col span={8}>
                            <Space>
                                <b>Customer: </b>
                                <span>{CreditInfoVO.settlementPartyName}</span>
                            </Space>
                        </Col>
                        <Col span={8}>
                            <Space>
                                <b>Property: </b>
                                <span>{CreditInfoVO.Property}</span>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <b>Nature of Company: </b>
                                <span>{'央企'}</span>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <b>Industry: </b>
                                <span>其他</span>
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{marginBottom: 12}}>
                        <Col span={8}>
                            <Space>
                                <b>Established Date: </b>
                                <span>{CreditInfoVO.settlementPartyName}</span>
                            </Space>
                        </Col>
                        <Col span={8}>
                            <Space>
                                <b>Registered Capital: </b>
                                <span>{CreditInfoVO.Property}</span>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <b>Legal Person/ Director: </b>
                                <span>{'央企'}</span>
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='earning'
                                placeholder=''
                                label='Annual Revenue'
                            />
                        </Col>
                        <Col span={5}>
                            <FormItemSelect
                                required
                                label='Position in industry'
                                id={'customerLevel'} name={'customerLevel'}
                                options={POSITION_IN_INDUSTRY} FormItem={FormItem}
                                onSelect={(e: any) => handleScoreChange(e, 'customerLevel', 3)}
                            />
                        </Col>
                        <Col span={5}>
                            <FormItemSelect
                                required
                                label='Credit Standing'
                                id={'creditRatingType'} name={'creditRatingType'}
                                options={POSITION_IN_INDUSTRY} FormItem={FormItem}
                                onSelect={(e: any) => handleScoreChange(e, 'creditRatingType', 4)}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Cooperation Review'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <ProFormDateRangePicker
                                name="timeRange" label="In cooperation time"
                                placeholder={['Start', 'End']}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormText
                                name='ourTeam'
                                placeholder=''
                                label='Our Team'
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormCheckbox.Group
                                placeholder=''
                                name='businessTyp'
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
                                name='lastYearVolume'
                                label='Total Shipment Volume'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearAnnualRevenue'
                                label='Annual Revenue'
                                className={'ant-input-suffix'}
                                fieldProps={{suffix}}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='lastYearGrossProfit'
                                label='Gross Profit'
                                className={'ant-input-suffix'}
                                fieldProps={{suffix}}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItem label={'Gross Profit Rate'} className={'ant-form-span-center'}>
                                <span> {5} % </span>
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
                                <FormItem className={'payment-credit-number'} name={'lastYearPaymentOnCreditNumber'}>
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
                                name='volume'
                                label='Total Shipment Volume'
                            />
                        </Col>
                        <Col span={4}>
                            <FormItemInput
                                required
                                placeholder=''
                                id={'annualRevenue'}
                                name={'annualRevenue'}
                                label={'Annual Revenue'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                FormItem={FormItem}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'annualRevenue', 6)}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItemInput
                                required
                                placeholder=''
                                id={'grossProfit'}
                                name={'grossProfit'}
                                label={'Gross Profit'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                FormItem={FormItem}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'grossProfit', 6)}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItem label={'Gross Profit Rate'} className={'ant-form-span-center'}>
                                <span> {grossProfitMargin || CreditInfoVO.grossProfitMargin} % </span>
                            </FormItem>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Credit Assessment'} className={'ant-card'}>
                    <Table
                        rowKey={'id'}
                        bordered={true}
                        pagination={false}
                        columns={columns}
                        dataSource={ScoreData}
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
                                placeholder=''
                                id={'creditLine'}
                                name={'creditLine'}
                                label={'Credit Line'}
                                className={'ant-input-suffix'}
                                suffix={suffix}
                                FormItem={FormItem}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'annualRevenue', 6)}
                            />
                        </Col>
                        <Col span={4}>
                            <FormItemInput
                                placeholder=''
                                id={'creditDays'}
                                name={'creditDays'}
                                label={'Credit Days'}
                                className={'ant-input-suffix'}
                                suffix={<span className={'ant-input-suffix-span'}> Days</span>}
                                FormItem={FormItem}
                                onChange={(e: any) => handleScoreChange(e?.target?.value, 'annualRevenue', 6)}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormDateRangePicker
                                name="periodCredit" label="Period of credit"
                                placeholder={['Start', 'End']}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormCheckbox.Group
                                name='businessLine'
                                label="Business Line"
                                options={BusinessLineList}
                            />
                        </Col>
                        <Col span={24}>
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
                    extra={<Button
                        onClick={() => push({pathname: '/manager/charge-template'})}>返回</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default CreditForm;