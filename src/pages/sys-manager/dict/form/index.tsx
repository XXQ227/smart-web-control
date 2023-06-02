import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm, ProFormSwitch,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {useModel, history} from 'umi'
import {getFormErrorMsg} from '@/utils/units'


type APIDictionary = APIManager.Dictionary;
const DictionaryForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    const {current} = formRef;
    //region TODO: 数据层
    const {
        getDictionaryInfo, DictionaryInfo, addDictionary,
    } = useModel('manager.dict', (res: any) => ({
        DictionaryInfo: res.DictionaryInfo,
        getDictionaryInfo: res.getDictionaryInfo,
        addDictionary: res.addDictionary,
    }));

    const [DictionaryInfoVO, setDictionaryInfoVO] = useState<APIDictionary>(DictionaryInfo);
    const [isChangeValue, setIsChangeValue] = useState<boolean>(false);


    //endregion

    // useEffect(() => {
    // }, [])


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetDictionaryInfo = async () => {
        const result: any = await getDictionaryInfo({ID: Number(atob(params?.id))});
        setDictionaryInfoVO(result);
        return result;
    }

    /**
     * @Description: TODO: 当 ProForm 表单修改时，调用此方法
     * @author XXQ
     * @date 2023/5/8
     * @param changeValues   ProForm 表单修改的参数
     * @returns
     */
    const handleProFormValueChange = (changeValues: any) => {
        console.log(changeValues);
        if (!isChangeValue) {
            setIsChangeValue(true);
        }
        current?.getFieldValue('');
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
        const result: API.Result = await addDictionary(val);
        console.log(result);
        if (result.success) {
            message.success('success');
        } else {
            message.error(result.exceptionTip)
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
            // loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={DictionaryInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                // request={async () => handleGetDictionaryInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='nameFullEn'
                                placeholder=''
                                tooltip='length: 100'
                                label='Name'
                                rules={[{required: true, message: 'Name'}]}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name Local'
                                tooltip='length: 100'
                                name='nameFullLocal'
                                rules={[{required: true, message: 'Name Local'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='taxNum'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 30'
                                rules={[{required: true, message: 'Tax Num'}]}
                            />
                        </Col>
                        <Col span={2}>
                            <ProFormSwitch
                                placeholder=''
                                label='Freezen'
                                name='enableFlag'
                                fieldProps={{
                                    checkedChildren: 'Yes',
                                    unCheckedChildren: 'No',
                                }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                tooltip='length: 30'
                                name='nameShortEn'
                                rules={[{required: true, message: 'AUC Num'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name Local'
                                tooltip='length: 30'
                                name='nameShortLocal'
                                rules={[{required: true, message: 'AUC Num'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='AUC Num'
                                tooltip='length: 30'
                                name='orgCreateId'
                                rules={[{required: true, message: 'AUC Num'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Contact'
                                tooltip='length: 30'
                                name='contactName'
                                rules={[{required: true, message: 'AUC Num'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Phone'
                                tooltip='length: 30'
                                name='phone'
                                rules={[{required: true, message: 'AUC Num'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='orgId'
                                placeholder=''
                                label='Oracle ID'
                                tooltip='length: 30'
                                rules={[{required: true, message: 'Oracle ID'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='code'
                                placeholder=''
                                label='Code'
                                tooltip='length: 30'
                                rules={[{required: true, message: 'Oracle ID'}]}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea name='Address' placeholder='' label='address'/>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/manager/Dictionary/dict'})}>返回</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default DictionaryForm;