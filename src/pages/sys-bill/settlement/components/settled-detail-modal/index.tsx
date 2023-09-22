import React, {useState} from 'react'
import type {ProColumns} from '@ant-design/pro-components';
import {
    ProForm,
    ProFormDatePicker,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProTable
} from '@ant-design/pro-components'
import {Col, Form, message, Modal, Row, Spin, Button} from 'antd'
import {formatNumToMoney} from '@/utils/units'
import moment from 'moment'
import '../../style.less'
import {useModel} from '@@/plugin-model/useModel'

interface Props {
    id: string;     // TODO: 核销记录行 id
    open: boolean;
    settleOpen: () => void;
}

const SettledDetailModal: React.FC<Props> = (props) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [settleInfo, setSettleInfo] = useState<any>({});

    const {
        queryWriteOffInfo
    } = useModel('accounting.settlement', (res: any) => ({
        queryWriteOffInfo: res.queryWriteOffInfo,
    }));

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

    async function handleSettleDetail() {
        try {
            // TODO: 调接口获取数据
            const result: API.Result = await queryWriteOffInfo({id: props.id});
            if (result.success) {
                message.success('success!');
                setSettleInfo(result.data);
            } else {
                if (result.message) message.error(result.message);
            }
            setLoading(false);
            return result.data || {};
        } catch (e) {
            setLoading(false);
            message.error(e);
            return {};
        }
    }

    function handleModalOperate() {
        form.resetFields();
        props.settleOpen();
    }


    const columns: ProColumns[] = [
        {title: 'Job No.', dataIndex: 'jobCode'},
        {title: 'Invoice No.', dataIndex: 'invoiceNum'},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 110, align: 'right'},
        {title: 'Bill Amount', dataIndex: 'billInTaxAmount', width: 110, align: 'right'},
        {title: 'Unsettled AMT', dataIndex: 'unWriteOffBillInTaxAmount', width: 110, align: 'right'},
        {title: 'Ratio', dataIndex: 'ratio', width: 80, align: 'center'},
        {title: 'Settle AMT', dataIndex: 'amount', width: 125, align: 'center',},
    ];

    // TODO: 加总核销金额
    let settleTotal: number = 0, billInTaxTotal: number = 0;
    // if (settleChargeList?.length > 0) {
    //     settleTotal = settleChargeList.reduce((total: any, item: any) => total + (item.amount || 0), 0);
    //     billInTaxTotal = settleChargeList.reduce((total: any, item: any) => total + (item.billInTaxAmount || 0), 0);
    //     settleTotal = keepDecimal(settleTotal);
    //     billInTaxTotal = keepDecimal(billInTaxTotal);
    // }


    return (
        <Modal
            width={900}
            open={props.open}
            title={'Settlement'}
            cancelText={'Cancel'}
            onCancel={handleModalOperate}
            footer={[<Button key="back" onClick={handleModalOperate}>Cancel</Button>]}
        >
            <Spin spinning={loading}>
                <ProForm
                    form={form}
                    submitter={false}
                    initialValues={initSettleInfo}
                    name={'modalForm'} layout={'vertical'}
                    request={async () => handleSettleDetail()}
                >
                    <Row gutter={24} style={{marginBottom: 24}}>
                        <Col span={17}>Payer / Vendor：<b>{settleInfo.businessName}</b></Col>
                        <Col span={7}>Bill CURR：<b>{settleInfo.billCurrencyName}</b></Col>
                    </Row>

                    <hr/>

                    <Row gutter={24} style={{marginTop: 24}}>
                        <Col span={9}>
                            <ProFormSelect
                                placeholder={''} disabled={true}
                                // TODO: 核销方式（到账类型）:1-银行核销2-现金核销3-offset settle(0金额代收代付核销)
                                name="method" label={'Account Type'}
                                options={[
                                    ...bankList,
                                    {label: 'CASH 現金', value: 2},
                                    {label: 'Hedge Offset 對沖抵消', value: 3},
                                ]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder={''} disabled={true}
                                name="bankAccount" label={'Account No.'}
                                options={[
                                    {label: '012-601-0-011722-3', value: 1, bankName: ''},
                                    {label: 'NONE', value: 2}
                                ]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder={''} disabled={true}
                                name="currencyName" label={'Settle Currency'}
                                options={['CNY', 'HKD', 'USD']}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormDatePicker
                                placeholder={''} disabled={true}
                                name={'receivePayTime'} label={'Accounting Date'}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            {/*// TODO: 到账/核销 金额*/}
                            <ProFormText
                                disabled={true} placeholder={''}
                                name={'amountStr'} label={'Amount'}
                            />
                        </Col>
                        <Col span={12}>
                            {/*// TODO: 银行手续费*/}
                            <ProFormText
                                disabled={true} placeholder={''}
                                name={'serverAmountStr'} label={'Bank Commission'}
                            />
                        </Col>
                        <Col span={12}>
                            {/*// TODO: 折扣金额*/}
                            <ProFormText
                                disabled={true} placeholder={''}
                                name={'discountAmountStr'} label={'Discount Amount'}
                            />
                        </Col>
                        <Col span={12}>
                            {/*// TODO: 流水号*/}
                            <ProFormText
                                disabled={true} placeholder={''}
                                name={'serialNum'} label={'Transaction Reference Number'}
                            />
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
                                dataSource={[]}
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
                            <ProFormText name={'settleChargeList'} hidden={true}/>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <ProFormTextArea
                                fieldProps={{rows: 4}}
                                disabled={true} placeholder={''}
                                name={'remark'} label={'Settle Remark'}
                            />
                        </Col>
                    </Row>
                </ProForm>
            </Spin>
        </Modal>
    )
}

export default SettledDetailModal;