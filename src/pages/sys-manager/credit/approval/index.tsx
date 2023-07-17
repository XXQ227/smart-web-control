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
import {getFormErrorMsg} from '@/utils/units'
import '../style.less';
import {COLUMNS_CREDIT_SCORE, CREDIT_ASSESSMENT_SCORE_DATA} from '@/utils/common-data'
import {CheckOutlined, CloseOutlined} from '@ant-design/icons'
import arrow from '@/assets/img/left-arrow.png';

type APICredit = APIManager.Credit;

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
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCreditByID(paramsVal: APICredit) {
        setLoading(true);
        if (BusinessLineList?.lengtd === 0) {
            await queryDictCommon({dictCodes: ['business_line']});
        }
        if (id !== '0') {
            const result: API.Result = await queryCreditControlInfo(paramsVal);
            setCreditInfoVO(result.data);
            // setScoreData(newData);
            setLoading(false);
            return result.data;
        } else {
            setLoading(false);
            return {totalScore: 0};
        }
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
                autoFocusFirstInput={true}
                formKey={'charge-template'}
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
                request={async () => handleGetCreditByID({id})}
            >
                <ProCard title={'Reference Information'} className={'ant-card ant-credit-info-table'}>
                    <table>
                        <tbody>
                        {/*// TODO: 第一行 */}
                        <tr className={'ant-credit-tr-dark'}>
                            <td>Customer</td>
                            <td colSpan={5} className={'ant-value-left'}>
                                {'Customer'}
                            </td>
                            <td>Apply Date</td>
                            <td colSpan={2} className={'ant-value-left'}>{'2021-05-20'}</td>
                        </tr>

                        {/*// TODO: 第二至五行 */}
                        <tr>
                            <td rowSpan={4}>Company <br/>Qualification</td>
                            <td>Customer Property</td>
                            <td colSpan={3} className={'ant-value-left'}>{''}</td>
                            <td>Nature of a Company</td>
                            <td colSpan={3} className={'ant-value-left'}>{' '}</td>
                        </tr>
                        <tr>
                            <td>Legal Person/ Director</td>
                            <td colSpan={3} className={'ant-value-left'}>{' '}</td>
                            <td>Industry</td>
                            <td colSpan={3} className={'ant-value-left'}>{' '}</td>
                        </tr>
                        <tr>
                            <td>Credit Standing</td>
                            <td colSpan={3} className={'ant-value-left'}>{' '}</td>
                            <td>Position in Industry</td>
                            <td colSpan={3} className={'ant-value-left'}>{' '}</td>
                        </tr>
                        <tr>
                            <td>Registered Capital</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Paid-in Capital</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Established Date</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Annual Revenue</td>
                            <td className={'ant-value-left'}>{' '}</td>
                        </tr>

                        {/*// TODO: 第六至七行 */}
                        <tr className={'ant-credit-tr-dark'}>
                            <td rowSpan={2}>Cooperation <br/>Review</td>
                            <td>In cooperation time</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Business Type</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Our Team</td>
                            <td colSpan={3} className={'ant-value-left'}>{' '}</td>
                        </tr>
                        <tr className={'ant-credit-tr-dark'}>
                            <td>Remark</td>
                            <td colSpan={7} className={'ant-value-left'}>{' '}</td>
                        </tr>

                        {/*// TODO: 第八至九行 */}
                        <tr>
                            <td rowSpan={2}>Last year (Summary)</td>
                            <td>Payment on credit</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Credit Line</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Credit Days</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Actual Credit Days</td>
                            <td className={'ant-value-left'}>{' '}</td>
                        </tr>
                        <tr>
                            <td>Shipment Volume</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Annual Revenue</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Gross Profit</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Gross Profit Rate</td>
                            <td className={'ant-value-left'}>{' '}</td>
                        </tr>

                        {/*// TODO: 第十行 */}
                        <tr className={'ant-credit-tr-dark'}>
                            <td>This year (Estimate)</td>
                            <td>Shipment Volume</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Annual Revenue</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Gross Profit</td>
                            <td className={'ant-value-left'}>{' '}</td>
                            <td>Gross Profit Rate</td>
                            <td className={'ant-value-left'}>{' '}</td>
                        </tr>
                        </tbody>
                    </table>
                </ProCard>

                <ProCard title={'Credit Assessment'} className={'ant-card ant-credit-result-table'}>
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

                <ProCard title={'Credit Approval'} className={'ant-card'}>
                    {/* 信控额度显示 */}
                    <Row gutter={24}>
                        <Col span={5}>
                            <Space>
                                <label>Credit Line : </label>
                                <span className={'ant-credit-line-days'}> 10 </span>
                                <span>  (10K CNY) </span>
                            </Space>
                        </Col>
                        <Col span={5}>
                            <Space>
                                <label>Credit Days : </label>
                                <span className={'ant-credit-line-days'}> 60 </span>
                            </Space>
                        </Col>
                        <Col span={7}>
                            <Space>
                                <label>Period of credit : </label>
                                <label>{}</label>
                            </Space>
                        </Col>
                        <Col span={7}>
                            <Space>
                                <label>Business Line : </label>
                                <label>{}</label>
                            </Space>
                        </Col>
                    </Row>

                    {/* 审批操作 */}
                    <Row gutter={24} className={'ant-credit-approval-operate'}>
                        <Col span={2}>
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
                        <Col span={22}>
                            <ProFormTextArea
                                required
                                name='remark'
                                label='Remark'
                                placeholder=''
                                fieldProps={{rows: 3}}
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

                <FooterToolbar extra={<Button onClick={() => history.push('/manager/credit')}>Back</Button>}>
                    {/*<Button type={'primary'} htmlType={'submit'}>提交</Button>*/}
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default CreditApproval;