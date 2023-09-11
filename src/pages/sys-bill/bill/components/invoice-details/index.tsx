import React, {useEffect} from 'react';
import {Button, Form, Modal, Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {ProFormTextArea} from '@ant-design/pro-components'


interface Props {
    open: boolean;
    invoiceDetail: any;
    handleModalOperate: (state: string, remark: string) => void;
}

const InvoiceDetails: React.FC<Props> = (props) => {
    const {open, invoiceDetail} = props;
    const [form] = Form.useForm();

    useEffect(()=> {
        if (invoiceDetail.id) form.setFieldsValue({remark: invoiceDetail.remark});
    })

    const columns: ColumnsType<any> = [
        {title: 'Job No.', dataIndex: 'jobNumber', width: 150, align: 'center'},
        {title: 'Description', dataIndex: 'description', align: 'center'},
        {title: 'Currency', dataIndex: 'orgCurrencyName', width: 120, align: 'center'},
        {title: 'Bill Currency', dataIndex: 'billCurrencyName', width: 120, align: 'center'},
        {title: 'EX Rate', dataIndex: 'orgBillExrate', width: 100, align: 'center'},
        {title: 'Bill Amount', dataIndex: 'billInTaxAmountStr', width: 120, align: 'center',},
    ];
    const handleModalOperate = (state: string, ) => {
        let remark = '';
        if (state === 'ok') {
            remark = form.getFieldValue('remark');
        }
        props.handleModalOperate(state, remark);
        form.resetFields();
    }

    let amount = 0;
    if (invoiceDetail?.invoiceDetailList?.length > 0) {
        amount = invoiceDetail?.invoiceDetailList.reduce((total: any, item: any) =>  total + item.billInTaxAmount, 0);
    }

    return (
        <Modal
            width={800} open={open}
            title={'Invoice Details'}
            onOk={()=> handleModalOperate('ok')}
            onCancel={()=> handleModalOperate('cancel')}
            footer={[
                <Button key={'cancel'} onClick={()=> handleModalOperate('cancel')}>Cancel</Button>,
                <Button key={'ok'} type={'primary'} onClick={()=> handleModalOperate('ok')}>Save Remark</Button>
            ]}
        >
            <Table
                rowKey={'jobNumber'}
                bordered={true}
                columns={columns}
                pagination={false}
                dataSource={invoiceDetail.invoiceDetailList || []}
                footer={() => <span>Total Amount: {amount}</span>}
            />
            <Form form={form} layout={'vertical'} style={{marginTop: 24}} initialValues={invoiceDetail}>
                <ProFormTextArea
                    placeholder={''} allowClear={true}
                    label='Invoice Remark' name={'remark'}
                    fieldProps={{rows: 4, autoFocus: true}}
                />
            </Form>
        </Modal>
    )
}

export default InvoiceDetails;