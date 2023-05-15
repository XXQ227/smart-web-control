import React, {Fragment, useEffect, useState} from 'react';
import {FooterToolbar, ProForm, ProFormRadio, ProFormText, ProFormDatePicker} from '@ant-design/pro-components'
import {Button, Col, Drawer, Form, message, Row, Space} from 'antd'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'


type APIPort = APIManager.Port;

const AccountTypeList = [{value: 0, label: 'Normal'}, {value: 1, label: 'Replenishment'}];

interface Props {
    AccountPeriod: any,
    isCreate?: boolean,
}

const AccountDrawerForm: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {AccountPeriod, isCreate} = props;

    const [open, setOpen] = useState(false);
    const [AccountPeriodVO, setAccountPeriodVO] = useState<APIPort>(AccountPeriod);

    useEffect(() => {
        if (open) {
            if (!(AccountPeriodVO?.ID) && !!(AccountPeriod?.ID)) {
                setAccountPeriodVO(AccountPeriod);
            }
        }
    }, [open, AccountPeriod, AccountPeriodVO?.ID])

    const handleValuesChange = (valueChange: any) => {
        console.log(valueChange);
    }


    /**
     * @Description: TODO: 保存
     * @author XXQ
     * @date 2023/5/9
     * @param values   页面 form 值
     * @returns
     */
    const handleSave = async (values: any) => {
        form.validateFields()
            .then(() => {
                values.Freezen = !!(values.Freezen);
                console.log(values);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    // @ts-ignore
    return (
        <Fragment>
            {isCreate ?
                <Button onClick={() => setOpen(true)} type={'primary'} icon={<PlusOutlined/>}>Add Account Period</Button>
                :
                <EditOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
            }
            {!open ? null :
                <Drawer
                    open={open}
                    width={'70%'}
                    destroyOnClose={true}
                    onClose={() => setOpen(false)}
                    title={`Details Of The Finance Month(Exchange Rate Units:100)`}
                >
                    <ProForm
                        form={form}
                        // TODO: 不清空为 null 的数据
                        omitNil={false}
                        // TODO: 不显示 提交按钮
                        submitter={false}
                        // TODO: 自动 focus 表单第一个输入框
                        autoFocusFirstInput={true}
                        // TODO: 设置默认值
                        // initialValues={AccountPeriodVO}
                        // TODO: 提交数据
                        onFinish={handleSave}
                        onFinishFailed={handleSave}
                        onValuesChange={handleValuesChange}
                        request={async ()=> AccountPeriodVO}
                    >
                        {/** // TODO: Status、Year-Month、Type、Start Date、End Date */}
                        <Row gutter={24}>
                            <Col span={6}>
                                <ProFormRadio.Group
                                    required
                                    name={'Type'}
                                    label={'Type'}
                                    options={AccountTypeList}
                                    rules={[{required: true, message: 'Type is required'}]}
                                />
                            </Col>
                            <Col span={4}>
                                <ProFormDatePicker.Month name='FinaYearMonth' label='Year-Month' />
                            </Col>
                            <Col span={4}>
                                <ProFormDatePicker name='StartDate' label='Start Date' />
                            </Col>
                            <Col span={4}>
                                <ProFormDatePicker name='EndDate' label='End Date' />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={4}>
                                <ProFormText
                                    required
                                    name='Name'
                                    label='Name'
                                    placeholder=''
                                    rules={[{required: true, message: 'Name is required'}]}
                                />
                            </Col>
                        </Row>
                        <FooterToolbar
                            className={'ant-footer-tool-bar'}
                            extra={<Button onClick={() => setOpen(false)}>Cancel</Button>}
                        >
                            <Space>
                                <Button type='primary' htmlType={'submit'}>Submit</Button>
                            </Space>
                        </FooterToolbar>
                    </ProForm>
                </Drawer>
            }
        </Fragment>
    )
}
export default AccountDrawerForm;