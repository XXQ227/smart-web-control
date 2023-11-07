import React, {Fragment, useEffect, useState} from 'react'
import type {ProColumns} from '@ant-design/pro-components';
import {ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea, ProTable} from '@ant-design/pro-components'
import {Button, Col, Divider, Form, message, Modal, Row} from 'antd'
import {useModel} from '@@/plugin-model/useModel'
import {formatNumToMoney, getFormErrorMsg, keepDecimal, rowGrid} from '@/utils/units'
import InputEditNumber from '@/components/InputEditNumber'
import moment from 'moment'
import '../../style.less'
import {BRANCH_ID, USER_ID, USER_NAME} from '@/utils/auths'
import SearchTable from "@/components/SearchTable";
import type {ColumnsType} from "antd/es/table";

interface Props {
    status: string;       // TODO: 状态: 1-未核销 2-部分核销 3-全部核销
    type: number;        // TODO: 核销类型:1-收款核销 2-付款核销 3-预付款核销
    hidden?: boolean;    // TODO: 是否隐藏操作按钮
    settleInfo: any;     // TODO: 核销发票数据
    settleChargeList: any[];
    handleUpdateData: () => void,   // TODO: 核销成功后更新数据
}

const SettlementInvoiceModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {status, type, hidden, settleInfo, settleChargeList} = props;

    const initSettleInfo: any = {
        method: 2, serverAmount: 0, discountAmount: 0, serverAmountStr: '0', discountAmountStr: '0',
        accountingDate: moment(new Date()).format('YYYY-MM-DD'),    // TODO: 默认为当前时间
        offsetInvoiceNum: '', transactionReferenceNumber: '',
    };

    // TODO: 核销列表数据
    const [open, setOpen] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [bankAccountNumList, setBankAccountNumList] = useState<any[]>([]);

    const [settleInfoState, setSettleInfoState] = useState<any>(initSettleInfo);

    const {
        invoiceWriteOff,
    } = useModel('accounting.settlement', (res: any) => ({
        invoiceWriteOff: res.invoiceWriteOff,
    }));

    const {
        queryBankNumCommon, bankAccountList
    } = useModel('common', (res: any)=> ({
        queryBankNumCommon: res.queryBankNumCommon,
        bankAccountList: res.bankAccountList,
    }));

    useEffect(() => {
        if (settleInfoState.method === 1 && bankAccountNumList?.length === 0) {
            handleQueryBankNumCommon().then(r => console.log(r));
        }
    }, [settleInfoState])

    /**
     * @Description: TODO: 查询银行账户信息
     * @author LLS
     * @date 2023/9/14
     * @returns
     */
    async function handleQueryBankNumCommon() {
        try {
            const result: any = await queryBankNumCommon({branchId: BRANCH_ID(), bankCurrencyName: settleInfo.billCurrencyName});
            if (result?.success) {
                result.data = result?.data?.map((item: any) => ({
                    label: item.bankName + ' ' + item.bankNum, value: item.id
                }))
                setBankAccountNumList(result?.data);
            } else {
                message.error(result?.message);
            }
        } catch (e) {
            message.error(e);
        }
    }

    /**
     * @Description: TODO: 核销弹框显示状态操作
     * @author XXQ
     * @date 2023/9/14
     * @param state     弹框状态
     * @returns
     */
    async function handleModalOP(state: boolean) {
        if (state) {
            console.log(settleChargeList);
            setDataSource(settleChargeList);
        } else {
            // 清空控件数据
            form.resetFields();
            setDataSource([]);
            setSettleInfoState(initSettleInfo);
            setBankAccountNumList([]);
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
            if (filedName === 'method') {
                if (val === 2) {
                    setFiledObj = {
                        ...setFiledObj,
                        bankAccountId: null,
                        transactionReferenceNumber: null,
                        serverAmount: 0.00,
                    }
                }
            } else if (filedName === 'bankAccountId') {
                newSettleInfo.bankName = bankAccountList?.find((item: any) => item.id === val)?.bankName || '';
                newSettleInfo.bankAccount = bankAccountList?.find((item: any) => item.id === val)?.bankNum || '';
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
                    let bankAccount: string = '';
                    // TODO: 【method === 1】：银行核销
                    if (method === 1) {
                        bankName = bankAccountList.find((item: any) => item.id === val.bankAccountId)?.bankName || '';
                        bankAccount = bankAccountList.find((item: any) => item.id === val.bankAccountId)?.bankNum || '';
                    }

                    console.log(val);
                    // TODO: 整理参数
                    const params: any = {
                        ...val,
                        method,         // TODO: 核销方式（到账类型）: * 1-银行核销 * 2-现金核销 * 3-Offset Settle(0金额代收代付核销)
                        bankName,       // TODO: 银行名称
                        bankAccount,    // TODO: 银行账号
                        invoiceList,
                        status: isPartial ? 2 : 3,  // TODO: 核销状态 1-未核销 2-部份核销 3-全部核销
                        accountingDate: moment(val.accountingDate).format('YYYY-MM-DD'),
                        type,
                        branchId: BRANCH_ID(),
                        businessId: settleInfo.businessId,
                        businessName: settleInfo.businessName,
                        currencyName: settleInfo.billCurrencyName,
                        enableFlag: 0,
                        deleteFlag: 0,
                        createUserId: USER_ID(),
                        createUserName: USER_NAME(),
                        createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        updateUserId: USER_ID(),
                        updateUserName: USER_NAME(),
                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    };

                    const result: API.Result = await invoiceWriteOff(params);
                    if (result.success) {
                        message.success('Success!!!');
                        await handleModalOP(false);
                        // TODO: 核销成功后更新数据
                        props.handleUpdateData();
                    } else {
                        message.error(result.message);
                    }
                } catch (e) {
                    message.error(e);
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    const columns: ProColumns[] = [
        {title: 'Job No.', dataIndex: 'jobCode', align: 'center'},
        {title: 'Invoice No.', dataIndex: 'invoiceNum', align: 'center'},
        {title: 'Issue By', dataIndex: 'invoiceCreateUserName', width: 100, align: 'center'},
        {title: 'Issue Date', dataIndex: 'invoiceCreateTime', width: 100, align: 'center', valueType: 'date'},
        // {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 120, align: 'center'},
        {title: 'Bill Amount', dataIndex: 'billInTaxAmount', width: status === '1' ? 120 : 100, align: 'right',
            render: (text) => {return formatNumToMoney(text)},
        },
        {title: 'Unsettled AMT', dataIndex: 'unWriteOffBillInTaxAmount', width: status === '1' ? 120 : 100, align: 'right',
            render: (text) => {return formatNumToMoney(text)},
        },
        {title: 'Ratio', dataIndex: 'ratio', width: status === '1' ? 80 : 70, align: 'right'},
        {
            title: 'Settle AMT', dataIndex: 'amount', width: 120, align: 'center',
            tooltip: 'Settle AMT is required; \n\r Must be a number with at most two decimal places.',
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
                        value={record.amount} valueStr={record.amountStr} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange('amount', val, index)}
                    />
                </Form.Item>
            )
        },
    ];
    if (status === '1') {
        columns.splice(5, 1,);
    }

    // TODO: 加总核销金额
    let settleTotal: number = 0, billInTaxTotal: number = 0;
    if (settleChargeList?.length > 0) {
        settleTotal = settleChargeList.reduce((total: any, item: any) => total + (item.amount || 0), 0);
        billInTaxTotal = settleChargeList.reduce((total: any, item: any) => total + (item.billInTaxAmount || 0), 0);
        settleTotal = keepDecimal(settleTotal);
        billInTaxTotal = keepDecimal(billInTaxTotal);
    }

    /**
     * @Description: TODO: 动态改值
     * @author LLS
     * @date 2023/11/1
     * @param filedName
     * @param offsetInvoiceNum
     * @param option
     * @returns
     */
    const handleChange = (filedName: string, offsetInvoiceNum: any, option: any) => {
        /*const setValueObj: any = {termsParam: {[filedName]: val}};
        switch (filedName) {
            case 'offsetInvoiceNum':
                setValueObj.termsParam.payableAtNameEn = option?.name;
                break;
            default: break;
        }
        form.setFieldsValue(setValueObj);*/
        // props.handleProFormValueChange(setValueObj);
    }

    const offsetInvoiceColumns: ColumnsType<any> = [
        { title: 'InvoiceNum', align: 'center', dataIndex: 'invoiceNum'},
        { title: 'Bill CURR', align: 'center', width: 120, dataIndex: 'currencyName'},
        { title: 'Bill AMT', align: 'center', width: 260, dataIndex: 'billInTaxAmount'},
        { title: 'Issue Date', dataIndex: 'createTime', width: 260, align: 'center'},
    ];

    return (
        <Fragment>
            <Button
                type={'primary'} onClick={() => handleModalOP(true)} hidden={hidden}
                disabled={settleChargeList?.length === 0 || settleInfo.businessLineState || settleInfo.billCurrencyNameState || settleInfo.businessNameState}
            >Settle</Button>

            <Modal
                className={'ant-add-modal'}
                open={open}
                width={900}
                title={'Settlement'}
                cancelText={'Cancel'}
                okText={'Save Settle'}
                onOk={handleCreateSettle}
                onCancel={() => handleModalOP(false)}
            >
                <Divider />
                <Form form={form} name={'modalForm'} layout={'vertical'} initialValues={initSettleInfo}>
                    <Row gutter={rowGrid} style={{marginBottom: 24}}>
                        <Col span={17}>Payer / Vendor：<b style={{fontSize: 16}}>{settleInfo.businessName}</b></Col>
                        <Col span={7} style={{textAlign: "right"}}>Bill CURR：<b style={{fontSize: 16}}>{settleInfo.billCurrencyName}</b></Col>
                    </Row>
                    <hr/>
                    <Row gutter={rowGrid} style={{marginTop: 24}}>
                        <Col span={[1, 2].includes(settleInfoState.method) ? 7 : 8}>
                            <ProFormSelect
                                placeholder={''}
                                // TODO: 核销方式（到账类型）:1-银行核销2-现金核销3-offset settle(0金额代收代付核销)
                                name="method"
                                label={'Settle Type'}
                                rules={[{required: true, message: 'Settle Type'}]}
                                fieldProps={{
                                    onSelect: (val: any) => handleRowChange('method', val, 0)
                                }}
                                options={[
                                    {label: 'Bank 銀行', value: 1},
                                    {label: 'CASH 現金', value: 2},
                                    {label: 'Hedge Offset 對沖抵消', value: 3},
                                ]}
                            />
                        </Col>
                        <Col span={16} hidden={[1, 2].includes(settleInfoState.method)}>
                            {/* TODO: 被抵消的发票号 */}
                            <Form.Item
                                label={'Offset Invoice Num'}
                                name={'offsetInvoiceNum'}
                                rules={[{required: settleInfoState.method === 3, message: 'Offset Invoice Num'}]}
                            >
                                <SearchTable
                                    qty={10}
                                    rowKey={'invoiceId'}
                                    modalWidth={900}
                                    showHeader={true}
                                    title={'Offset Invoice Num'}
                                    // selectedIDs={}
                                    text={settleInfoState?.offsetInvoiceNum}
                                    customizeColumns={offsetInvoiceColumns}
                                    url={"/apiAccounting/writeOff/queryWriteOffInvoices"}
                                    query={{invoiceType: type, businessId: settleInfo.businessId, currencyName: settleInfo.billCurrencyName}}
                                    name={'offsetInvoiceNum'}
                                    handleChangeData={(val: any, option: any) => handleChange('offsetInvoiceNum', val, option)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={11} hidden={[2, 3].includes(settleInfoState.method)}>
                            <ProFormSelect
                                placeholder={''}
                                name="bankAccountId"
                                label={'Bank Account Number'}
                                rules={[{required: settleInfoState.method === 1, message: 'Bank Account Number'}]}
                                fieldProps={{
                                    onSelect: (val: any, option: any) => handleRowChange('bankAccountId', val, 0, option)
                                }}
                                /*options={[
                                    {label: '012-601-0-011722-3', value: 1, bankName: ''},
                                    {label: 'NONE', value: 2}
                                ]}*/
                                options={bankAccountNumList}
                            />
                        </Col>
                        <Col span={6}>
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
                        <Col span={6} hidden={[2, 3].includes(settleInfoState.method)}>
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
                        <Col span={6} hidden={settleInfoState.method === 3}>
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
                        <Col span={7} hidden={[2, 3].includes(settleInfoState.method)}>
                            {/*// TODO: 流水号*/}
                            <Form.Item
                                name={'transactionReferenceNumber'}
                                label={'Transaction Reference Number'}
                                rules={[
                                    {required: settleInfoState.method === 1, message: 'Transaction Reference Number'},
                                   /*{
                                        pattern: /^\d+(\.\d{1,2})?$/,
                                        message: 'Must be a number with at most two decimal places.'
                                    }*/
                                ]}
                            >
                                <InputEditNumber
                                    value={settleInfoState.transactionReferenceNumber}
                                    handleChangeData={(val) => handleRowChange('transactionReferenceNumber', val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <ProFormDatePicker
                                placeholder={''}
                                name={'accountingDate'} label={'Accounting Date'}
                                rules={[{required: true, message: 'Accounting Date'}]}
                            />
                        </Col>
                    </Row>
                    {/*<Row gutter={rowGrid}>
                       <Col span={6}>
                            <ProFormSelect
                                placeholder={''}
                                name="currencyName"
                                label={'Settle Currency'}
                                style={{minWidth: 150}}
                                options={['CNY', 'HKD', 'USD']}
                            />
                        </Col>
                    </Row>*/}
                    <Row gutter={rowGrid} style={{marginBottom: 24}}>
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
                                        <Row gutter={rowGrid}>
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
                    <Row gutter={rowGrid}>
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