import React, {Fragment} from 'react'
import type {ProColumns} from '@ant-design/pro-components';
import {
    ModalForm, ProCard,
    ProFormDatePicker,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, ProTable
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {useModel} from '@@/plugin-model/useModel'
import {formatNumToMoney, getFormErrorMsg} from '@/utils/units'
import InputEditNumber from '@/components/InputEditNumber'

interface Props {
    open: boolean;
    type: number;       // TODO: 核销类型:1-收款核销2-付款核销3-预付款核销
    settleInfo: any;    // TODO: 核销发票数据
    settleChargeList: any[];
    handleModalOP: (state: boolean, isCreateSuccess?: boolean) => void;
}

const SettlementInvoiceModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {open, type, settleInfo, handleModalOP, settleChargeList} = props;

    const {
        addBankSlip,
    } = useModel('accounting.settlement', (res: any) => ({
        addBankSlip: res.addBankSlip,
    }));

    async function handleCreateSettle() {
        form.validateFields()
            .then(async (val: any) => {
                // TODO: 整理参数
                const params: any = {
                    ...val,
                    branchId: '1665596906844135426',
                    settlementPartyName: settleInfo.businessName,
                };
                console.log(val, params);
                const result: API.Result = await addBankSlip(params);
                if (result.success) {
                    message.success('success!');
                    handleModalOP(false, true);
                } else {
                    if (result.message) message.error(result.message);
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    function handleRowChange(index: number, reocrd: any, filedName: string, val: any) {
        

    }

    const columns: ProColumns[] = [
        {title: 'Invoice No.', dataIndex: 'invoiceNum'},
        {title: 'Issue By', dataIndex: 'issueBy', width: 150, align: 'center'},
        {title: 'Issue Date', dataIndex: 'issueDate', width: 100, align: 'center', valueType: 'date'},
        {title: 'Bill Amount', dataIndex: 'billInTaxAmount', key: 'jobCode', width: 150},
        {title: 'Ratio', dataIndex: 'ratio', width: 90, align: 'center'},
        {title: 'Settle Amount', dataIndex: 'settleAmount', width: 150, align: 'center',
            render: (text, record: any, index)=> (
                <Form.Item>
                    <InputEditNumber
                        id={`settleAmount_table_${record.id}`}
                        value={text} valueStr={formatNumToMoney(record.settleAmount || 0)}
                        handleChangeData={(val) => handleRowChange(index, record, 'settleAmount', val)}
                    />
                </Form.Item>
            )
        },
    ];

    let amount = 0;
    if (settleChargeList?.length > 0) {
        amount = settleChargeList.reduce((total: any, item: any) =>  total + item.billInTaxAmount, 0);
    }

    console.log(settleChargeList);

    return (

        <ModalForm<any>
            width={900}
            form={form}
            name={'modalForm'}
            title={'Settlement'}
            onFinish={handleCreateSettle}
            modalProps={{
                open,
                onCancel: ()=> () => handleModalOP(false),
            }}
            submitter={{
                render: () => {
                    return (
                        <Space>
                            <Button key={'cancel'} onClick={() => handleModalOP(false)}>Cancel</Button>
                            <Button key={'save'} type='primary' onClick={handleCreateSettle}>Save Settle</Button>
                        </Space>
                    )
                }
            }}
        >
            <Row gutter={24} style={{marginBottom: 24}}>
                <Col span={17}>Payer / Vendor：<b>{settleInfo.businessName}</b></Col>
                <Col span={7}>Bill CURR：<b>{settleInfo.billCurrencyName}</b></Col>
            </Row>

            <hr/>

            <Row gutter={24} style={{marginTop: 12}}>
                <Col span={9}>
                    <ProFormSelect
                        placeholder={''}
                        // TODO: 核销方式（到账类型）:1-银行核销2-现金核销3-offset settle(0金额代收代付核销)
                        name="method"
                        required={true}
                        label={'Account Type'}
                        rules={[{required: true, message: 'Account Type'}]}
                        options={[
                            {label: '中国银行', value: 1},
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
                        options={[
                            {label: '012-601-0-011722-3', value: 1},
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
                    <ProFormDatePicker name={'receicePayTime'} label={'Accounting Date'} placeholder={''} />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText name={'amount'} label={'Amount'} placeholder={''} />
                </Col>
                <Col span={12}>
                    <ProFormText name={'bankCommission'} label={'Bank Commission'} placeholder={''} />
                </Col>
                <Col span={12}>
                    {/*// TODO: 折扣金额*/}
                    <ProFormText name={'discountAmount'} label={'Discount Amount'} placeholder={''} />
                </Col>
                <Col span={12}>
                    {/*// TODO: 流水号*/}
                    <ProFormText name={'serialNum'} label={'Transaction Reference Number'} placeholder={''} />
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
                        dataSource={settleChargeList || []}
                        className={'antd-pro-table-expandable'}
                        footer={() => <span>Total Amount: {formatNumToMoney(amount)}</span>}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <ProFormTextArea name={'remark'} label={'Settle Remark'} placeholder={''} fieldProps={{rows: 4}} />
                </Col>
            </Row>
        </ModalForm>
    )
}

export default SettlementInvoiceModal;