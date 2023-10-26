import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import AuthorityList from '@/pages/sys-manager/authority/components/AuthorityList'

type APIAuthResource = APIManager.AuthResource;

const AuthResourceForm: React.FC<RouteChildrenProps> = () => {
    const {location} = history;
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    // TODO: 判断是否是二级菜单
    const isLevel2 = location.pathname.indexOf('/level2/') > -1;
    //region TODO: 数据层
    const {
        queryAuthResourceTree, editAuthResource
    } = useModel('manager.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree,
        editAuthResource: res.editAuthResource,
    }));

    const [AuthListVO, setAuthListVO] = useState<APIAuthResource[]>([]);
    const [AuthInvoVO, setAuthInvoVO] = useState<APIAuthResource>({id});
    //endregion


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleQueryAuthResourceTree = async () => {
        console.log(id);
        const result: any = await queryAuthResourceTree({id});
        // TODO: 保存子集权限数据
        setAuthListVO(result.children);
        // TODO: 删除子集权限数据
        delete result.children;
        // TODO: 存下当前数据详情
        setAuthInvoVO(result);
        return result;
    }

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinish = async (val: any) => {
        for (const item in val) {
            if (item.indexOf('_table_') > -1) {
                delete val[item];
            }
        }
        console.log(val);
        const params: any = {
            id, ...val,
            // parentId: AuthInvoVO.parentId, parentIds: AuthInvoVO.parentIds
        };
        const result: API.Result = await editAuthResource(params);
        if (result.success) {
            message.success('Success');
        } else {
            message.error(result.message);
        }
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    //region TODO:
    //endregion
    let backUrl = '/system/authority/auth';
    if (isLevel2) {
        backUrl += '/form/' + btoa(AuthInvoVO.parentId || '0');
    }

    console.log(AuthInvoVO);
    return (
        <PageContainer header={{breadcrumb: {}}}>
            <ProForm
                form={form}
                formRef={formRef}
                layout={'vertical'}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                // initialValues={AuthResourceVO}
                formKey={'authority-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleQueryAuthResourceTree()}
            >
                <ProCard title={'Name & Code'} className={'ant-card ant-card-pro-table'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 64'
                                required label='Name'
                                name='name' placeholder=''
                                rules={[{required: true, message: 'Name'}, {max: 64, message: 'length: 64'}]}
                            />
                        </Col>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 64'
                                required placeholder=''
                                label='PathName' name='Path Name'
                                rules={[{required: true, message: 'pathName'}, {max: 64, message: 'length: 64'}]}
                            />
                        </Col>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 128'
                                required placeholder=''
                                name='pathUrl' label='Path'
                                rules={[{required: true, message: 'Path'}, {max: 128, message: 'length: 128'}]}
                            />
                        </Col>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 255'
                                required placeholder=''
                                name='icon' label='Icon'
                                rules={[{required: true, message: 'Icon'}, {max: 255, message: 'length: 255'}]}
                            />
                        </Col>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 255'
                                required placeholder=''
                                name='identityCode' label='Identity'
                                rules={[{required: true, message: 'Identity'}, {max: 255, message: 'length: 255'}]}
                            />
                        </Col>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 255'
                                required placeholder=''
                                name='redirect' label='Redirect'
                                rules={[{max: 255, message: 'length: 255'}]}
                            />
                        </Col>
                        <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                            <ProFormText
                                tooltip='length: 255'
                                required placeholder=''
                                name='redirectPath' label='Redirect Path'
                                rules={[
                                    {max: 255, message: 'length: 255'},
                                    {required: !!form.getFieldValue('redirect'), message: 'Identity'}
                                ]}
                            />
                        </Col>
                    </Row>
                </ProCard>
                {/* 二级菜单时不显示子集 */}
                <ProCard title={'Authority'} className={'ant-card ant-card-pro-table'} hidden={isLevel2}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <AuthorityList AuthList={AuthListVO} AuthInvoVO={AuthInvoVO}/>
                        </Col>
                    </Row>
                </ProCard>
                <FooterToolbar extra={
                    <Button onClick={() => history.push({pathname: backUrl})}>
                        Back
                    </Button>
                }>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default AuthResourceForm;