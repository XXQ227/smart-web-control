import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'

// const FormItem = Form.Item;

type APIDepartment = APIManager.Department;
const DepartmentForm: React.FC<RouteChildrenProps> = () => {
    const urlParams: any = useParams();
    const [form] = Form.useForm();
    const {push, location: {pathname}} = history;
    const id = atob(urlParams?.id);

    const {
        queryDepartmentInfo, editDepartment, addDepartment,
    } = useModel('manager.department', (res: any) => ({
        addDepartment: res.addDepartment,
        queryDepartmentInfo: res.queryDepartmentInfo,
        editDepartment: res.editDepartment,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [DepartmentInfoVO, setDepartmentInfoVO] = useState<any>({});

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetDepartmentByID(paramsVal: APIDepartment) {
        setLoading(true);
        const result: API.Result = await queryDepartmentInfo(paramsVal);
        setLoading(false);
        if (result.success) {
            setDepartmentInfoVO(result.data);
            return result.data;
        } else {
            message.error(result.message);
        }
    }

    const handleSave = async (values: any) => {
        setLoading(true);
        const saveId = pathname.indexOf('/copy') > -1 ? '0' : id;
        let result: API.Result;
        // TODO: 当有上级部门时，需要加到 parentIds 中
        if(values.parentId) values.parentIds += (values.parentIds ? ',' : '') + values.parentId;
        values.branchId = '0'
        if (saveId !== '0') {
            values.id = saveId;
            result = await editDepartment(values);
        } else {
            console.log(values);
            result = await addDepartment(values);
        }
        setLoading(false);
        if (result.success) {
            if (saveId === '0' && result.data) history.push({pathname: `/manager/department/form/${btoa(result.data)}`});
            message.success('Success!');

        } else {
            message.error(result.message);
        }
    }

    return (
        <PageContainer
            loading={loading}
            header={{breadcrumb: {}}}
        >
            <ProForm
                form={form}
                name={'edi'}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={DepartmentInfoVO}
                formKey={'cv-center-information'}
                // TODO: 提交数据
                onFinish={handleSave}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                // @ts-ignore
                request={async () => id !== '0' ? handleGetDepartmentByID({id}) : {}}
            >
                {/** // TODO: Template Name、AP USD Rate、AR USD Rate、Services、Purpose of call */}
                <ProCard title={'Basic Info'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='name'
                                label='Name'
                                placeholder=''
                                tooltip={'length: 64'}
                                rules={[
                                    {required: true, message: 'Name'},
                                    {max: 64, message: 'Name length: 64'}
                                ]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                name='oracleId'
                                label='Oracle Id'
                                tooltip={'length: 20'}
                                rules={[
                                    {required: true, message: 'Oracle Id'},
                                    {max: 20, message: 'Oracle Id length: 20'}
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <ProFormSelect
                                required
                                placeholder=''
                                name='level'
                                label='Level'
                                rules={[{required: true, message: 'level'},]}
                                options={[{value: 1, label: 'Export'}, {value: 2, label: 'Import'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                placeholder=''
                                name='chargePerson'
                                label='Leader'
                                tooltip={'length: 64'}
                                rules={[
                                    {required: true, message: 'Leader'},
                                    {max: 64, message: 'Leader length: 64'}
                                ]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                name='contactPhone'
                                label='Phone'
                                tooltip={'length: 64'}
                                rules={[
                                    {required: true, message: 'Phone'},
                                    {max: 64, message: 'Phone length: 64'}
                                ]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='email'
                                label='Email'
                                placeholder=''
                                tooltip={'length: 50'}
                                rules={[
                                    {required: true, message: 'Email'},
                                    {
                                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'The email format is incorrect.'
                                    }
                                ]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => push({pathname: '/manager/department'})}>返回</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default DepartmentForm;