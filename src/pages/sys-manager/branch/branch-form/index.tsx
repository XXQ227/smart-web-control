import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import BankIndex from '@/pages/sys-manager/branch/branch-form/bank'


type APIBranch = APIManager.Branch;
const BranchForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match, match: {params}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryBranchInfo, addBranch, editBranch
    } = useModel('manager.branch', (res: any) => ({
        queryBranchInfo: res.queryBranchInfo,
        addBranch: res.addBranch,
        editBranch: res.editBranch,
    }));

    const [BranchInfoVO, setBranchInfoVO] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);


    //endregion

    // useEffect(() => {
    // }, [])


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetBranchInfo = async () => {
        setLoading(true);
        const result: any = await queryBranchInfo({id});
        setBranchInfoVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinish = async (val: APIBranch) => {
        setLoading(true);
        val.defaultPortId = 0;
        let result: API.Result;
        // TODO: add 添加
        if (id === '0') {
            result = await addBranch(val);
        } else {
            // TODO: 保存
            val.id = id;
            result = await editBranch(val);
        }
        if (result.success) {
            message.success('success');
            if (id === '0') history.push({pathname: `/manager/branch/form/${btoa(result.data)}`});
        } else {
            message.error(result.message)
        }
        setLoading(false);
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
            loading={loading}
            header={{breadcrumb: {},}}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={BranchInfoVO}
                formKey={'cv-center-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetBranchInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name'
                                name='nameFullEn'
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Name'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name Local'
                                name='nameFullLocal'
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Name Local'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='taxNum'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 50'
                                rules={[{required: true, message: 'Tax Num'}, {max: 50, message: 'length: 50'}]}
                            />
                        </Col>
                        {/*<Col span={2}>
                            <ProFormSwitch
                                placeholder=''
                                label='Freezen'
                                name='enableFlag'
                                fieldProps={{
                                    checkedChildren: 'Yes',
                                    unCheckedChildren: 'No',
                                }}
                            />
                        </Col>*/}
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                tooltip='length: 100'
                                name='nameShortEn'
                                rules={[{required: true, message: 'Short Name'}, {max: 100, message: 'length: 100'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name Local'
                                tooltip='length: 100'
                                name='nameShortLocal'
                                rules={[{required: true, message: 'Short Name Local'}, {
                                    max: 100,
                                    message: 'length: 100'
                                }]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='AUC Num'
                                tooltip='length: 15'
                                name='orgCreateId'
                                rules={[{required: true, message: 'AUC Num'}, {max: 15, message: 'length: 15'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Contact'
                                tooltip='length: 30'
                                name='contactName'
                                rules={[{required: true, message: 'Contact'}, {max: 30, message: 'length: 30'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Phone'
                                tooltip='length: 30'
                                name='phone'
                                rules={[{required: true, message: 'Phone'}, {max: 30, message: 'length: 30'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='orgId'
                                placeholder=''
                                label='Oracle ID'
                                tooltip='length: 15'
                                rules={[{required: true, message: 'Oracle ID'}, {max: 15, message: 'length: 15'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='code'
                                placeholder=''
                                label='Code'
                                tooltip='length: 10'
                                rules={[{required: true, message: 'Code'}, {max: 10, message: 'length: 10'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormSelect
                                required
                                placeholder=''
                                label='Currency'
                                name='funcCurrencyName'
                                rules={[{required: true, message: 'Currency'}]}
                                options={[{value: 'HKD', label: 'HKD'}, {value: 'CNY', label: 'HKD'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='cityName'
                                placeholder=''
                                label='City'
                                rules={[{required: true, message: 'City'}]}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea
                                name='address' placeholder='' label='Address' tooltip='length: 300'
                                rules={[{required: true, message: 'Address'}, {max: 300, message: 'length: 300'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>
                <ProCard className={'ant-card-pro-table'}>
                    <BankIndex BankList={[]}/>
                </ProCard>

                <FooterToolbar
                    extra={<Button onClick={() => history.push({pathname: '/manager/branch/list'})}>返回</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default BranchForm;