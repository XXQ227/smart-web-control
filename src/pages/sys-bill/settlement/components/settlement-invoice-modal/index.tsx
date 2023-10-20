import React, {Fragment, useEffect, useState} from 'react'
import type {ProColumns} from '@ant-design/pro-components';
import {ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea, ProTable} from '@ant-design/pro-components'
import {Button, Col, Form, message, Modal, Row} from 'antd'
import {useModel} from '@@/plugin-model/useModel'
import {formatNumToMoney, getFormErrorMsg, keepDecimal} from '@/utils/units'
import InputEditNumber from '@/components/InputEditNumber'
import moment from 'moment'
import '../../style.less'
import {BRANCH_ID} from '@/utils/auths'

interface Props {
    type: number;       // TODO: 核销类型:1-收款核销2-付款核销3-预付款核销
    hidden?: boolean;   // TODO: 是否隐藏操作按钮
    settleInfo: any;    // TODO: 核销发票数据
    settleChargeList: any[];
}

const SettlementInvoiceModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {type, hidden, settleInfo, settleChargeList} = props;

    const initSettleInfo: any = {
        method: 2, serverAmount: 0, discountAmount: 0, serverAmountStr: '0', discountAmountStr: '0',
        receivePayTime: moment(new Date()).format('YYYY-MM-DD'),    // TODO: 默认为当前时间
    };

    // TODO: 银行信息
    const bankList = [
        {value: '123456415354', label: '中国银行'},
        {value: '214520456845', label: '渣打银行'},
        {value: '524486532545', label: '汇丰银行'},
    ];




    // TODO: 核销列表数据
    const [open, setOpen] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);

    const [settleInfoState, setSettleInfoState] = useState<any>(initSettleInfo);

    const {
        invoiceWriteOff,
    } = useModel('accounting.settlement', (res: any) => ({
        invoiceWriteOff: res.invoiceWriteOff,
    }));

    useEffect(() => {

    }, [])


    /**
     * @Description: TODO: 核销弹框显示状态操作
     * @author XXQ
     * @date 2023/9/14
     * @param state     弹框状态
     * @returns
     */
    function handleModalOP(state: boolean) {
        if (state) {
            setDataSource(settleChargeList);
        } else {
            setDataSource([]);
        }
        setOpen(state);
    }

    /**
     * @Description: TODO: 修改当前核销数据
     * @author XXQ
     * @date 2023/9/18
     * @param filedName
     * @param val
     * @param index
     * @param option
     * @returns
     */
    function handleRowChange(filedName: string, val: any, index?: number, option?: any) {
        // TODO: 【filedName === 'amount' && typeof index === 'number'】：操作费用行的数据
        if (filedName === 'amount' && typeof index === 'number') {
            // TODO: 编辑费用行核销金额
            const newData: any[] = dataSource.slice(0);
            const target: any = dataSource[index];
            target[filedName] = Number(val);
            target[`${filedName}Str`] = formatNumToMoney(Number(val));
            form.setFieldsValue({[`${filedName}_table_${target.id}`]: val});
            target.ratio = keepDecimal((Number(val) / target.billInTaxAmount) * 100, 2) + '%';
            newData.splice(index, 1, target);

            // TODO: 获取总的核销金额填入 核销
            const settleAMT = newData.reduce((total: any, item: any) => total + (item.amount || 0), 0);
            // TODO: 更新 【settleChargeList】 数据，用做保存用
            form.setFieldsValue({settleChargeList: newData, amount: settleAMT});
            setDataSource(newData);
            setSettleInfoState((newSettleInfo: any) =>
                ({...newSettleInfo, amount: settleAMT, amountStr: formatNumToMoney(settleAMT)})
            );
        } else {
            const newSettleInfo: any = JSON.parse(JSON.stringify(settleInfoState));
            newSettleInfo[filedName] = val;
            // TODO: 编辑核销信息：需要联动处理其他数据时
            let setFiledObj: any = {[filedName]: val};
            if (filedName === 'method' && val === 2) {
                setFiledObj = {
                    ...setFiledObj,
                    bankAccount: 2,
                    serverAmount: 0.00,
                }
            } else if (filedName === 'bankAccount') {
                newSettleInfo.bankName = option.bankName;
            }
            if (['amount', 'serverAmount', 'discountAmount'].includes(filedName)) {
                newSettleInfo[`${filedName}Str`] = formatNumToMoney(val);
            }
            form.setFieldsValue(setFiledObj);
            setSettleInfoState(newSettleInfo);
        }
    }


    /**
     * @Description: TODO: 保存水单
     * @author XXQ
     * @date 2023/9/15
     * @returns
     */
    async function handleCreateSettle() {
        form.validateFields()
            .then(async (val: any) => {
                // TODO: 删除对应的 table 里的录入数据
                // @ts-ignore
                for (const key: string in val) {
                    if (key.indexOf('_table_') > -1) {
                        delete val[key];
                    }
                }
                try {
                    // TODO: 整理发票费用行数据数据
                    const invoiceList: any[] = [], invoNumArr: string[] = [];
                    let isPartial: boolean = false;
                    if (val.settleChargeList?.length > 0) {
                        val.settleChargeList.map((item: any) => {
                            // TODO: 当存在该发票号时
                            if (invoNumArr.includes(item.invoiceNum)) {
                                // TODO: 累加当前发票下费用的核销金额
                                invoiceList.map((cg: any)=> ({
                                    ...cg, amount: cg.amount + item.amount,
                                    chargeList: cg.chargeList.push(item),
                                }));
                            } else {
                                // TODO: 不存在该发票时，需要整理发票上传参数格式数据
                                const obj: any = {
                                    id: item.invoiceId, invoiceNum: item.invoiceNum, amount: item.amount,
                                    chargeList: [item],
                                }
                                invoiceList.push(obj);
                                invoNumArr.push(item.invoiceNum);
                            }
                            if (item.ratio !== '100%') {
                                isPartial = true;
                            }
                        })
                        delete val.settleChargeList;
                    }

                    const method: number = [2, 3].includes(val.method) ? val.method : 1;
                    let bankName: string = '';
                    // TODO: 【method === 1】：银行核销
                    if (method === 1) {
                        bankName = bankList.find((item: any) => item.value === val.method)?.label || '';
                    }

                    // TODO: 整理参数
                    const params: any = {
                        ...val,
                        method,         // TODO: 核销方式（到账类型）: * 1-银行核销 * 2-现金核销 * 3-Offset Settle(0金额代收代付核销)
                        bankName,       // TODO: 银行名
                        invoiceList,
                        status: isPartial ? 2 : 3,  // TODO: 核销状态 1-未核销 2-部份核销 3-全部核销
                        receivePayTime: moment(val.receivePayTime).format('YYYY-MM-DD'),
                        type, branchId: BRANCH_ID(),
                        settlementPartyId: settleInfo.businessId,
                        settlementPartyName: settleInfo.businessName,
                    };

                    const result: API.Result = await invoiceWriteOff(params);
                    if (result.success) {
                        message.success('success!');
                        handleModalOP(false);
                    } else {
                        if (result.message) message.error(result.message);
                    }
                } catch (e) {
                    message.error(e)
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    const columns: ProColumns[] = [
        {title: 'Job No.', dataIndex: 'jobCode'},
        {title: 'Invoice No.', dataIndex: 'invoiceNum'},
        // {title: 'Issue By', dataIndex: 'issueBy', width: 150, align: 'center'},
        // {title: 'Issue Date', dataIndex: 'issueDate', width: 100, align: 'center', valueType: 'date'},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 110, align: 'right'},
        {title: 'Bill Amount', dataIndex: 'billInTaxAmount', width: 110, align: 'right'},
        {title: 'Unsettled AMT', dataIndex: 'unWriteOffBillInTaxAmount', width: 110, align: 'right'},
        {title: 'Ratio', dataIndex: 'ratio', width: 80, align: 'center'},
        {
            title: 'Settle AMT', dataIndex: 'amount', width: 125, align: 'center',
            tooltip: 'Name is required; \n\r Must be a number with at most two decimal places.',
            render: (text, record: any, index) => (
                <Form.Item
                    name={`amount_table_${record.id}`}
                    rules={[
                        {required: true, message: 'Settle Amount'},
                        {pattern: /^\d+(\.\d{1,2})?$/, message: 'Must be a number with at most two decimal places.'},
                        // {validator: validatorSettleAmount},
                        ({}) => ({
                            validator(_, value) {
                                console.log(record.billInTaxAmount, value);
                                if (!!value) {
                                    if (Number(record.billInTaxAmount) >= value) {
                                        return Promise.resolve();
                                    } else if (Number(record.billInTaxAmount) <= value) {
                                        return Promise.reject(new Error(`The Settle Amount cannot exceed ${record.billInTaxAmount}.`));
                                    }
                                }
                                return Promise.reject(new Error('Settle Amount!'));
                            },
                        }),
                    ]}
                >
                    <InputEditNumber
                        value={record.amount} valueStr={record.amountStr}
                        handleChangeData={(val) => handleRowChange('amount', val, index)}
                    />
                </Form.Item>
            )
        },
    ];

    // TODO: 加总核销金额
    let settleTotal: number = 0, billInTaxTotal: number = 0;
    if (settleChargeList?.length > 0) {
        settleTotal = settleChargeList.reduce((total: any, item: any) => total + (item.amount || 0), 0);
        billInTaxTotal = settleChargeList.reduce((total: any, item: any) => total + (item.billInTaxAmount || 0), 0);
        settleTotal = keepDecimal(settleTotal);
        billInTaxTotal = keepDecimal(billInTaxTotal);
    }


    return (
        <Fragment>
            <Button
                type={'primary'} onClick={() => handleModalOP(true)} hidden={hidden}
                disabled={settleChargeList?.length === 0 || settleInfo.businessLineState || settleInfo.billCurrencyNameState}
            >Settle</Button>

            <Modal
                open={open}
                width={900}
                title={'Settlement'}
                cancelText={'Cancel'}
                okText={'Save Settle'}
                onOk={handleCreateSettle}
                onCancel={() => handleModalOP(false)}
            >
                <Form form={form} name={'modalForm'} layout={'vertical'} initialValues={initSettleInfo}>
                    <Row gutter={24} style={{marginBottom: 24}}>
                        <Col span={17}>Payer / Vendor：<b>{settleInfo.businessName}</b></Col>
                        <Col span={7}>Bill CURR：<b>{settleInfo.billCurrencyName}</b></Col>
                    </Row>

                    <hr/>

                    <Row gutter={24} style={{marginTop: 24}}>
                        <Col span={9}>
                            <ProFormSelect
                                placeholder={''}
                                // TODO: 核销方式（到账类型）:1-银行核销2-现金核销3-offset settle(0金额代收代付核销)
                                name="method"
                                label={'Account Type'}
                                rules={[{required: true, message: 'Account Type'}]}
                                fieldProps={{
                                    onSelect: (val: any) => handleRowChange('method', val, 0)
                                }}
                                options={[
                                    ...bankList,
                                    {label: 'CASH 現金', value: 2},
                                    {label: 'Hedge Offset 對沖抵消', value: 3},
                                ]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder={''}
                                name="bankAccount"
                                label={'Account No.'}
                                rules={[{required: settleInfoState.method !== 2, message: 'Account No.'}]}
                                fieldProps={{
                                    onSelect: (val: any, option: any) => handleRowChange('bankAccount', val, 0, option)
                                }}
                                options={[
                                    {label: '012-601-0-011722-3', value: 1, bankName: ''},
                                    {label: 'NONE', value: 2}
                                ]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder={''}
                                name="currencyName"
                                label={'Settle Currency'}
                                style={{minWidth: 150}}
                                options={['CNY', 'HKD', 'USD']}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormDatePicker
                                placeholder={''}
                                name={'receivePayTime'} label={'Accounting Date'}
                                rules={[{required: true, message: 'Account Type'}]}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            {/*// TODO: 到账/核销 金额*/}
                            <Form.Item
                                name={'amount'} label={'Amount'}
                                rules={[
                                    {required: true, message: 'Amount'},
                                    {
                                        pattern: /^\d+(\.\d{1,2})?$/,
                                        message: 'Must be a number with at most two decimal places.'
                                    }
                                ]}
                            >
                                <InputEditNumber
                                    disabled={true}
                                    value={settleInfoState.amount} valueStr={settleInfoState.amountStr}
                                    handleChangeData={(val) => handleRowChange('amount', val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/*// TODO: 银行手续费*/}
                            <Form.Item
                                name={'serverAmount'} label={'Bank Commission'}
                                rules={[
                                    {
                                        pattern: /^\d+(\.\d{1,2})?$/,
                                        message: 'Must be a number with at most two decimal places.'
                                    }
                                ]}
                            >
                                <InputEditNumber
                                    value={settleInfoState.serverAmount} valueStr={settleInfoState.serverAmountStr}
                                    handleChangeData={(val) => handleRowChange('serverAmount', val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/*// TODO: 折扣金额*/}
                            <Form.Item
                                name={'discountAmount'} label={'Discount Amount'}
                                rules={[
                                    {
                                        pattern: /^\d+(\.\d{1,2})?$/,
                                        message: 'Must be a number with at most two decimal places.'
                                    }
                                ]}
                            >
                                <InputEditNumber
                                    value={settleInfoState.discountAmount} valueStr={settleInfoState.discountAmountStr}
                                    handleChangeData={(val) => handleRowChange('discountAmount', val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/*// TODO: 流水号*/}
                            <ProFormText name={'serialNum'} label={'Transaction Reference Number'} placeholder={''}/>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{marginBottom: 24}}>
                        <Col span={24}>
                            <ProTable
                                rowKey={'id'}
                                search={false}
                                options={false}
                                bordered={true}
                                columns={columns}
                                pagination={false}
                                dataSource={dataSource || []}
                                className={'antd-pro-table-expandable ant-pro-table-edit ant-pro-table-settle-amount'}
                                footer={() => {
                                    return (
                                        <Row gutter={24}>
                                            <Col span={12}/>
                                            <Col span={12}>
                                                <span style={{float: 'right'}}>
                                                    Settle Total Amount:
                                                    <b style={{
                                                        color: settleTotal > billInTaxTotal ? '#D39E59' : '',
                                                        marginLeft: 12
                                                    }}>
                                                        {formatNumToMoney(settleTotal)}
                                                    </b>
                                                </span>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />
                            <ProFormText name={'settleChargeList'} hidden={true} />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <ProFormTextArea
                                name={'remark'} label={'Settle Remark'} placeholder={''} fieldProps={{rows: 4}}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Fragment>
    )
}

export default SettlementInvoiceModal;