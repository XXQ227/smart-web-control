import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import AuthListIndex from '@/pages/sys-manager/authority/components'

type APIAuthResource = APIManager.AuthResource;

const AuthResourceForm: React.FC<RouteChildrenProps> = () => {
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryAuthResourceTree,
    } = useModel('manager.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree,
    }));

    const [localId, setLocalId] = useState<string>('');
    const [AuthListVO, setAuthListVO] = useState<APIAuthResource[]>([]);
    const [AuthInvoVO, setAuthInvoVO] = useState<APIAuthResource>({id});
    //endregion

    useEffect(()=> {
        console.log(localId, id, localId !== id);
        if (localId && id && localId !== id) {
            handleGetAuthResourceInfo({id});
        }
    }, [])

    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetAuthResourceInfo = async () => {
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
        console.log(val);
        const params: any = {
            id, name: val.name, icon: val.icon, url: val.url,
            parentId: AuthInvoVO.parentId, parentIds: AuthInvoVO.parentIds
        };
        // const result: API.Result = await AuthResource(val);
        // if (result.success) {
        //     message.success('Success');
        // } else {
        //     message.error(result.message);
        // }
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

    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
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
                request={async () => handleGetAuthResourceInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card ant-card-pro-table'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={5}>
                            <ProFormText
                                required
                                label='Name'
                                placeholder=''
                                name='name'
                                tooltip='length: 64'
                                rules={[{required: true, message: 'Name'}, {max: 64, message: 'length: 64'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                required
                                placeholder=''
                                name='url'
                                label='Url'
                                tooltip='length: 128'
                                rules={[{required: true, message: 'Url'}, {max: 128, message: 'length: 128'}]}
                            />
                        </Col>
                        <Col span={14}>
                            <ProFormText
                                required
                                name='icon'
                                placeholder=''
                                label='Icon'
                                tooltip='length: 256'
                                rules={[{required: true, message: 'Icon'}, {max: 256, message: 'length: 256'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>
                <ProCard title={'Authority'} className={'ant-card ant-card-pro-table'}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <AuthListIndex
                                AuthList={AuthListVO}
                                AuthInvoVO={AuthInvoVO}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/manager/auth/auth-resource'})}>Back</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default AuthResourceForm;