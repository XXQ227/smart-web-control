import React, {useRef} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import DictDetailDetailIndex from '@/pages/sys-manager/dict/dict-detail'

const DictForm: React.FC<RouteChildrenProps> = () => {
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryDictInfo, addDict,
    } = useModel('manager.dict', (res: any) => ({
        queryDictInfo: res.queryDictInfo,
        addDict: res.addDict,
    }));

    //endregion

    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetDictInfo = async () => {
        const result: API.Result = await queryDictInfo({id});
        return result.data;
    }

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinish = async (val: any) => {
        const result: API.Result = await addDict(val);
        if (result.success) {
            message.success('success');
        } else {
            message.error(result.message)
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
                // initialValues={DictVO}
                formKey={'cv-center-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetDictInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card ant-card-pro-table'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={5}>
                            <ProFormText
                                readonly
                                label='Name'
                                placeholder=''
                                name='name'
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                readonly
                                placeholder=''
                                name='code'
                                label='Code'
                            />
                        </Col>
                        <Col span={14}>
                            <ProFormText
                                readonly
                                name='remark'
                                placeholder=''
                                label='Remark'
                            />
                        </Col>
                    </Row>
                </ProCard>
                <ProCard title={'Dict Detail'} className={'ant-card ant-card-pro-table'}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <DictDetailDetailIndex form={form}/>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/manager/dict'})}>返回</Button>}/>
            </ProForm>
        </PageContainer>
    )
}
export default DictForm;