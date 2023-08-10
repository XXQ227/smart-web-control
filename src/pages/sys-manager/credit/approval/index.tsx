import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormTextArea,
} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row, Space, Table} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg, getLabelByValue, keepDecimal, rowGrid} from '@/utils/units'
import '../style.less';
import {
    BUSINESS_TYPE,
    COLUMNS_CREDIT_SCORE,
    CREDIT_ASSESSMENT_SCORE_DATA, CREDIT_STANDING,
    NATURE_OF_COMPANY, POSITION_IN_INDUSTRY,
    PROPERTY_AS_CUSTOMER
} from '@/utils/common-data'
import {ArrowLeftOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons'
import arrow from '@/assets/img/left-arrow.png';
import moment from "moment/moment";
import ls from 'lodash'

const CreditApproval: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
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
    } = useModel('common', (res: any) => ({
        queryDictCommon: res.queryDictCommon,
        BusinessLineList: res.BusinessLineList,
    }))

    const [loading, setLoading] = useState<boolean>(false);
    const [CreditInfoVO, setCreditInfoVO] = useState<any>({});
    const [ScoreData, setScoreData] = useState<any[]>(CREDIT_ASSESSMENT_SCORE_DATA);
    const [creditApprovalState, setCreditApprovalState] = useState<string>('');

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
        if (id !== '0') {
            const result: API.Result = await queryCreditControlInfo({id});
            if (result.success) {
                console.log(result.data);
                // TODO: Company Qualification 的数据
                const customerProperty = PROPERTY_AS_CUSTOMER.find(item => item.value === result.data.customerProperty)
                result.data.customerProperty = customerProperty?.label;
                const enterpriseTypeValue = getLabelByValue(NATURE_OF_COMPANY, result.data.natureOfCompany);
                result.data.natureOfCompany = enterpriseTypeValue?.natureOfCompany;
                const creditStanding = CREDIT_STANDING.find(item => item.value === result.data.creditStanding)
                result.data.creditStanding = creditStanding?.label;
                const positionIndustry = POSITION_IN_INDUSTRY.find(item => item.value === result.data.positionIndustry)
                result.data.positionIndustry = positionIndustry?.label;
                // TODO: 需要除以 10000 的数据
                if (result.data.registeredCapital) result.data.registeredCapital = keepDecimal(result.data.registeredCapital / 10000);
                if (result.data.paidInCapital) result.data.paidInCapital = keepDecimal(result.data.paidInCapital / 10000);
                if (result.data.annualRevenue) result.data.annualRevenue = keepDecimal(result.data.annualRevenue / 10000);
                if (result.data.lastYearCreditLine) result.data.lastYearCreditLine = keepDecimal(result.data.lastYearCreditLine / 10000);
                if (result.data.lastYearAnnualRevenue) result.data.lastYearAnnualRevenue = keepDecimal(result.data.lastYearAnnualRevenue / 10000);
                if (result.data.lastYearGrossProfit) result.data.lastYearGrossProfit = keepDecimal(result.data.lastYearGrossProfit / 10000);
                if (result.data.estimatedAnnualRevenue) result.data.estimatedAnnualRevenue = keepDecimal(result.data.estimatedAnnualRevenue / 10000);
                if (result.data.estimatedGrossProfit) result.data.estimatedGrossProfit = keepDecimal(result.data.estimatedGrossProfit / 10000);
                if (result.data.creditLine) result.data.creditLine = keepDecimal(result.data.creditLine / 10000);
                // TODO: 时间范围
                const cooperationStartTime = moment(result.data.cooperationStartTime).format('YYYY-MM');
                const cooperationEndTime = moment(result.data.cooperationEndTime).format('YYYY-MM');
                result.data.cooperationTime = `${cooperationStartTime} ~ ${cooperationEndTime}`;
                const creditExpiryStartTime = moment(result.data.creditExpiryStartTime).format('YYYY-MM');
                const creditExpiryEndTime = moment(result.data.creditExpiryEndTime).format('YYYY-MM');
                result.data.creditExpiryTime = `${creditExpiryStartTime} ~ ${creditExpiryEndTime}`;
                // TODO: 毛利率
                result.data.lastYearMarginProfit = (result.data.lastYearGrossProfit / result.data.lastYearAnnualRevenue) * 100;
                result.data.estimatedMarginProfit = (result.data.estimatedGrossProfit / result.data.estimatedAnnualRevenue) * 100;

                result.data.businessType = getBusinessLabels(result.data?.businessType);
                result.data.lastYearPaymentOnCredit = result.data?.lastYearPaymentOnCredit === 0 ? 'In good condition' : result.data?.lastYearPaymentOnCredit ? `Overdue payments ${result.data?.lastYearPaymentOnCredit} Times` : result.data?.lastYearPaymentOnCredit;
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

    function getBusinessLabels(input: string) {
        if (input) {
            const selectedValues = input.split(',');
            const labels: string[] = [];
            for (const value of selectedValues) {
                const foundItem = BUSINESS_TYPE.find(item => item.value === value);
                if (foundItem) {
                    labels.push(foundItem.label);
                }
            }
            return labels.join(', ');
        }
        return ""
    }

    /**
     * @Description: TODO: 信控成绩
     * @author LLS
     * @date 2023/8/9
     * @param result 信控数据
     * @returns
     */
    function getCreditScoreInfo(result: any) {
        const newData = ls.cloneDeep(ScoreData);
        for (const item of newData) {
            switch (item.id) {
                case 1: // TODO: 注册资金
                    item.score = result.score1
                    break;
                case 2: // TODO: 注册时间（年限）
                    item.score = result.score2
                    break;
                case 3: // TODO: 行业地位
                    item.score = result.score3
                    break;
                case 4: // TODO: 信用等级
                    item.score = result.score4
                    break;
                case 5: // TODO: 预计月收入
                    item.score = result.score5
                    break;
                case 6: // TODO: 本年度预计营收毛利率
                    item.score = result.score6
                    break;
                default:
                    break;
            }
        }
        setScoreData(newData);
        result.totalScore = result.totalScore.toFixed(1);
        return result;
    }

    const handleOperateCredit = async (state: string)=> {
        setCreditApprovalState(state);
        form.validateFields()
            .then(async (value: any) => {
                console.log(value);
            }).catch(errorInfo => {
            console.log(errorInfo);
            /** TODO: 错误信息 */
            message.error(getFormErrorMsg(errorInfo));
        })
    }

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
                omitNil={false}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                formKey={'credit-approval'}
                // TODO: 设置默认值
                initialValues={CreditInfoVO}
                // TODO: 提交数据
                onFinish={handleOperateCredit}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.lengtd > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                // @ts-ignore
                request={async () => handleGetCreditInfo({id})}
            >
                <ProCard
                    className={'ant-card ant-credit-info-table'}
                    title={'Reference Information'}
                    headerBordered
                    collapsible
                >
                    <table>
                        <tbody>
                            {/*// TODO: 第一行 */}
                            <tr className={'ant-credit-tr-dark'}>
                                <td>Customer Name</td>
                                <td colSpan={5} className={'ant-value-left'}>
                                    {CreditInfoVO.customerName}
                                </td>
                                <td>Apply Date</td>
                                <td colSpan={2} className={'ant-value-left'}>{moment(CreditInfoVO.createTime).format("YYYY-MM-DD")}</td>
                            </tr>

                            {/*// TODO: 第二至五行 */}
                            <tr>
                                <td rowSpan={4}>Company <br/>Qualification</td>
                                <td>Customer Property</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.customerProperty}</td>
                                <td>Nature of a Company</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.natureOfCompany}</td>
                            </tr>
                            <tr>
                                <td>Legal Person/ Director</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.corporation}</td>
                                <td>Industry</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.industryName}</td>
                            </tr>
                            <tr>
                                <td>Credit Standing</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.creditStanding}</td>
                                <td>Position in Industry</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.positionIndustry}</td>
                            </tr>
                            <tr>
                                <td>Registered Capital</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.registeredCapital}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.registeredCapital ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Paid-in Capital</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.paidInCapital}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.paidInCapital ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Established Date</td>
                                <td className={'ant-value-left'}>{moment(CreditInfoVO.establishedDate).format('YYYY-MM-DD')}</td>
                                <td>Annual Revenue</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.annualRevenue}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.annualRevenue ? '(10K CNY)' : null}</span>
                                </td>
                            </tr>

                            {/*// TODO: 第六至七行 */}
                            <tr className={'ant-credit-tr-dark'}>
                                <td rowSpan={2}>Cooperation <br/>Review</td>
                                <td>In cooperation time</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.cooperationTime}</td>
                                <td>Business Type</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.businessType}</td>
                                <td>Our Team</td>
                                <td colSpan={3} className={'ant-value-left'}>{CreditInfoVO.teams}</td>
                            </tr>
                            <tr className={'ant-credit-tr-dark'}>
                                <td>Remark</td>
                                <td colSpan={7} className={'ant-value-left'}>{CreditInfoVO.cooperationRemark}</td>
                            </tr>

                            {/*// TODO: 第八至九行 */}
                            <tr>
                                <td rowSpan={2}>Last year (Summary)</td>
                                <td>Payment On Credit</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.lastYearPaymentOnCredit}</td>
                                <td>Credit Line</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.lastYearCreditLine}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.lastYearCreditLine ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Credit Days</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.lastYearCreditDays}</td>
                                <td>Actual Credit Days</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.lastYearActualCreditDays}</td>
                            </tr>
                            <tr>
                                <td>Shipment Volume</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.lastYearTotalShipmentVolume}</td>
                                <td>Annual Revenue</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.lastYearAnnualRevenue}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.lastYearAnnualRevenue ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Gross Profit</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.lastYearGrossProfit}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.lastYearGrossProfit ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Gross Profit Rate</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.lastYearMarginProfit ? (Math.round(CreditInfoVO.lastYearMarginProfit * 100) / 100).toFixed(2) + '%' : null}
                                </td>
                            </tr>

                            {/*// TODO: 第十行 */}
                            <tr className={'ant-credit-tr-dark'}>
                                <td>This year (Estimate)</td>
                                <td>Shipment Volume</td>
                                <td className={'ant-value-left'}>{CreditInfoVO.estimatedTotalShipmentVolume}</td>
                                <td>Annual Revenue</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.estimatedAnnualRevenue}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.estimatedAnnualRevenue ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Gross Profit</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.estimatedGrossProfit}
                                    <span className={'ant-span-unit'}> {CreditInfoVO.estimatedGrossProfit ? '(10K CNY)' : null}</span>
                                </td>
                                <td>Gross Profit Rate</td>
                                <td className={'ant-value-left'}>
                                    {CreditInfoVO.estimatedMarginProfit ? (Math.round(CreditInfoVO.estimatedMarginProfit * 100) / 100).toFixed(2) + '%' : null}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ProCard>

                <ProCard
                    className={'ant-card ant-credit-result-table'}
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
                    <Row gutter={24} className={'ant-row-score'}>
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
                    title={'Credit Approval'}
                    headerBordered
                    collapsible
                >
                    {/* 信控额度显示 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={9} xl={6} xxl={5}>
                            <Space className={'ant-credit-text'}>
                                <label>Credit Line : </label>
                                <span className={'ant-credit-line-days'}>{CreditInfoVO.creditLine}</span>
                                <span className={'ant-span-unit'}> {CreditInfoVO.creditLine ? '(10K CNY)' : null}</span>
                            </Space>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={7} xl={4} xxl={3}>
                            <Space className={'ant-credit-text'}>
                                <label>Credit Days : </label>
                                <span className={'ant-credit-line-days'}> {CreditInfoVO.creditDays} </span>
                            </Space>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={7} xxl={5}>
                            <Space className={'ant-credit-text'}>
                                <label>Period of credit : </label>
                                <span>{CreditInfoVO.cooperationTime}</span>
                            </Space>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={7} xxl={10}>
                            <Space className={'ant-credit-text'}>
                                <label>Business Line : </label>
                                <span>{CreditInfoVO.businessLineName}</span>
                            </Space>
                        </Col>
                    </Row>

                    {/* 审批操作 */}
                    <Row gutter={24} className={'ant-credit-approval-operate'}>
                        <Col xs={24} sm={24} md={24} lg={4} xl={3} xxl={3} className={'ant-credit-approval-operate-left'}>
                            <div
                                className={creditApprovalState === 'agree' ? 'ant-credit-approval-state-choose' : ''}
                                onClick={() => handleOperateCredit('agree')}
                            >
                                <CheckOutlined/> Agree
                            </div>
                            <div
                                className={creditApprovalState === 'disagree' ? 'ant-credit-approval-state-choose' : ''}
                                onClick={() => handleOperateCredit('disagree')}
                            >
                                <CloseOutlined/> Disagree
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={20} xl={21} xxl={21}>
                            <ProFormTextArea
                                required
                                name='remark'
                                label='Remark'
                                placeholder=''
                                fieldProps={{rows: 4}}
                                rules={[{required: true, message: 'Remark'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                    </Row>

                    {/* 流程显示 */}
                    {/* 所属公司审批 */}
                    <Row gutter={24} className={'ant-credit-approval-info'}>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>Terry Wong</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className="arrow">
                                        <img src={arrow} alt={'arrow'} />

                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>Terry Wong</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className="arrow">
                                        <img src={arrow} alt={'arrow'} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>Terry Wong</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className="arrow">
                                        <img src={arrow} alt={'arrow'} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>Terry Wong</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row gutter={24} className={'ant-credit-approval-info-to-financial-line'}>
                        <Col span={24}>
                            <div className="arrow"></div>
                            <div className="line3"></div>
                            <div className="line2"></div>
                            <div className="line"></div>
                        </Col>
                    </Row>

                    {/* 总部信控组 */}
                    <Row gutter={24} className={'ant-credit-approval-info'}>
                        <Col span={3}/>
                        <Col span={18} className={'ant-credit-approval-line-dashed'}>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <div className={'ant-approval-title-name'}>
                                                <span>市场部</span>
                                                <span>Operator (2023-03-12)</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <div className={'ant-approval-remark'}>
                                                Please Approve
                                            </div>
                                        </Col>
                                        <Col span={2}>
                                            <div className="arrow">
                                                <img src={arrow} alt={'arrow'} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <div className={'ant-approval-title-name'}>
                                                <span>运营部</span>
                                                <span>Operator (2023-03-12)</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <div className={'ant-approval-remark'}>
                                                Please Approve
                                            </div>
                                        </Col>
                                        <Col span={2}>
                                            <div className="arrow">
                                                <img src={arrow} alt={'arrow'} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <div className={'ant-approval-title-name'}>
                                                <span>财务部</span>
                                                <span>Operator (2023-03-12)</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={22}>
                                            <div className={'ant-approval-remark'}>
                                                Please Approve
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={3}/>
                    </Row>

                    <Row gutter={24} className={'ant-credit-approval-info-to-headquarters-line'}>
                        <Col span={24}>
                            <div className="arrow"></div>
                            <div className="line3"></div>
                            <div className="line2"></div>
                            <div className="line"></div>
                        </Col>
                    </Row>
                    {/* 总部财务、总经理审批 */}
                    <Row gutter={24} className={'ant-credit-approval-info'}>
                        <Col span={3}/>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>财务总监</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className="arrow">
                                        <img src={arrow} alt={'arrow'} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>分管领导</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className="arrow">
                                        <img src={arrow} alt={'arrow'} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div className={'ant-approval-title-name'}>
                                        <span>总经理</span>
                                        <span>Operator (2023-03-12)</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={22}>
                                    <div className={'ant-approval-remark'}>
                                        Please Approve
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={3}/>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={
                        <Button onClick={() => history.push({pathname: '/manager/credit'})} icon={<ArrowLeftOutlined/>}>
                            Back
                        </Button>
                    }
                >
                    {/*<Button type={'primary'} htmlType={'submit'}>提交</Button>*/}
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default CreditApproval;