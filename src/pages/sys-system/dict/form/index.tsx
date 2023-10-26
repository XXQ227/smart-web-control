import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import DictDetailDetailIndex from '@/pages/sys-system/dict/dict-detail'

const DictForm: React.FC<RouteChildrenProps> = () => {
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryDictInfo, addDict,
    } = useModel('system.dict', (res: any) => ({
        queryDictInfo: res.queryDictInfo,
        addDict: res.addDict,
    }));

    const [DictVO, setDictVO] = useState<any>({});
    //endregion

    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetDictInfo = async () => {
        form.resetFields();
        const result: API.Result = await queryDictInfo({id});
        setDictVO(result.data);
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
            message.success('Success');
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
                layout={'inline'}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={DictVO}
                formKey={'dict-information'}
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
                            <Space>
                                <b>Name : </b>
                                <span>{DictVO.name}</span>
                            </Space>
                        </Col>
                        <Col span={5}>
                            <Space>
                                <b>Code : </b>
                                <span>{DictVO.code}</span>
                            </Space>
                        </Col>
                        <Col span={14}>
                            <Space>
                                <b>Remark : </b>
                                <span>{DictVO.remark}</span>
                            </Space>
                        </Col>
                    </Row>
                </ProCard>
            </ProForm>
            <ProCard title={'Dict Detail'} className={'ant-card ant-card-pro-table'}>
                <Row gutter={24}>
                    <Col span={24}>
                        <DictDetailDetailIndex DictVO={DictVO} form={form}/>
                    </Col>
                </Row>
            </ProCard>
            <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/system/dict'})}>Back</Button>}/>
        </PageContainer>
    )
}
export default DictForm;