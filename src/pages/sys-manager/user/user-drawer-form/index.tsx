import React, {Fragment, useEffect, useState} from 'react';
import {FooterToolbar, ProForm, ProFormSwitch, ProFormText} from '@ant-design/pro-components'
import {Button, Col, Drawer, Form, message, Row, Space} from 'antd'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'

type APIUser = APIManager.User;

interface Props {
    UserInfo: any,
    isCreate?: boolean,
    handleSave: (val: any) => void,
}

const UserDrawerForm: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {UserInfo, isCreate} = props;

    const [open, setOpen] = useState(false);
    const [UserInfoVO, setUserInfoVO] = useState<APIUser>(UserInfo);

    useEffect(() => {
        if (open) {
            if (!(UserInfoVO?.id) && !!(UserInfo?.id)) {
                setUserInfoVO(UserInfo);
            }
        }
    }, [open, UserInfo, UserInfoVO?.id])

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
                console.log(values);
                props.handleSave(values);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    return (
        <Fragment>
            {isCreate ?
                <Button onClick={() => setOpen(true)} type={'primary'} icon={<PlusOutlined/>}>Add User</Button>
                :
                <EditOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
            }
            {!open ? null :
                <Drawer
                    open={open}
                    width={'70%'}
                    destroyOnClose={true}
                    onClose={() => setOpen(false)}
                    title={'Port Information'}
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
                        // initialValues={UserInfoVO}
                        // TODO: 提交数据
                        onFinish={handleSave}
                        onFinishFailed={handleSave}
                        request={async ()=> UserInfoVO}
                    >
                        {/** // TODO: Display Name、Login Name、Password、Sales */}
                        <Row gutter={24}>
                            <Col span={7}>
                                <ProFormText
                                    required
                                    placeholder=''
                                    name='nameDisplay'
                                    label='Display Name'
                                    fieldProps={{autoComplete: 'off'}}
                                    rules={[{required: true, message: 'Display Name'}]}
                                />
                            </Col>
                            <Col span={7}>
                                <ProFormText
                                    required
                                    placeholder=''
                                    name='nameLogin'
                                    label='Login Name'
                                    fieldProps={{autoComplete: 'off'}}
                                    rules={[{required: true, message: 'Login Name'}]}
                                />
                            </Col>
                            <Col span={7}>
                                <ProFormText.Password
                                    required
                                    placeholder=''
                                    name='password'
                                    label='Password'
                                    fieldProps={{autoComplete: 'off'}}
                                    rules={[{required: true, message: 'Password'}]}
                                />
                            </Col>
                            <Col span={3}>
                                <ProFormSwitch
                                    name='saleFlag'
                                    label='Sales'
                                    fieldProps={{
                                        checkedChildren: 'Yes',
                                        unCheckedChildren: 'No',
                                    }}
                                />
                            </Col>
                        </Row>
                        {/* // TODO: Email */}
                        <Row gutter={24}>
                            <Col span={6}>
                                <ProFormText
                                    required
                                    name='email'
                                    label='Email'
                                    placeholder=''
                                    rules={[
                                        {required: true, message: 'Email'},
                                        {
                                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'The email format is incorrect.'
                                        }
                                    ]}
                                />
                            </Col>
                            <Col span={6}>
                                <ProFormText
                                    placeholder=''
                                    name='phone'
                                    label='Phone'
                                />
                            </Col>
                            <Col span={6}>
                                <ProFormText
                                    placeholder=''
                                    name='codeSino'
                                    label='Sinotrans ID'
                                />
                            </Col>
                            <Col span={6}>
                                <ProFormText
                                    placeholder=''
                                    name='codeF8'
                                    label='F8 Authority Code'
                                />
                            </Col>
                            <Col span={6}>
                                <SearchProFormSelect
                                    required={true}
                                    valueObj={{}}
                                    placeholder=''
                                    label='Department'
                                    id='department_id'
                                    name='department_id'
                                    url={'/apiBase/user/queryUser'}
                                />
                            </Col>
                            <Col span={6}>
                                <SearchProFormSelect
                                    valueObj={{}}
                                    placeholder=''
                                    id='leader_id'
                                    name='leader_id'
                                    label='Superior'
                                    url={'/api/manager/queryDepartment'}
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
export default UserDrawerForm;