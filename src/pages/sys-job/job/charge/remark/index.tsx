import React from 'react'
import {Button, Form, message, Modal} from 'antd'
import {ProFormTextArea} from '@ant-design/pro-components'
import {getFormErrorMsg} from '@/utils/units'

interface Props {
    open: boolean;          // TODO: 弹框显示状态
    record: any;            // TODO: 当前编辑数据集
    title?: string;         // TODO: 弹框名（可为空）
    handleCancel: () => void;   // TODO: 关闭弹框
    handleOk: (val: any) => void;   // TODO: 关闭弹框

}

export const Remark: React.FC<Props> = (props) => {

    const {open, record, title, handleCancel, } = props;
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then(async (value: any) => {
                props.handleOk(value.remark);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    return (
        <div hidden={!open}>
            <Modal
                open={open}
                width={600}
                title={title || 'Remark'}
                footer={[
                    <Button key='cancel' onClick={handleCancel}>Cancel</Button>,
                    <Button key='submit' type='primary' onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <Form layout={'vertical'} form={form} initialValues={record}>
                    <ProFormTextArea
                        name='remark'
                        label='Remark'
                        placeholder=''
                        tooltip='length: 200'
                        fieldProps={{rows: 3}}
                    />
                </Form>
            </Modal>
        </div>
    )
}