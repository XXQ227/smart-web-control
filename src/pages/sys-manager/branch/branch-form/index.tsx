import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm, ProFormRadio, ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect
} from '@ant-design/pro-components'
import {Button, Col, Form, Popover, Row, Space, Radio} from 'antd'
import {getUserID} from '@/utils/auths'
import {useModel, history} from 'umi'
import {message} from 'antd/es'

type APIBranch = APIManager.Branch;
const BranchForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const {location: {pathname}} = history;
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    const {current} = formRef;
    //region TODO: 数据层
    const {
        getBranchInfo, BranchInfo, IndustryList, CustomerPropertyList, uploadCTCenter
    } = useModel('manager.branch', (res: any) => ({
        BranchInfo: res.BranchInfo,
        getBranchInfo: res.getBranchInfo,
        IndustryList: res.IndustryList,
        CustomerPropertyList: res.CustomerPropertyList,
        uploadCTCenter: res.uploadCTCenter,
    }));
    const [BranchInfoVO, setBranchInfoVO] = useState<APIBranch>(BranchInfo);
    const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
    const [CTCenterType, setCTCenterType] = useState<number | null>(null);


    //endregion

    useEffect(() => {
    }, [])


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetBranchInfo = async () => {
        const result: any = await getBranchInfo({ID: Number(atob(params?.id))});
        setBranchInfoVO(result);
        return result;
    }

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/5/22
     * @param filedName
     * @param val
     * @returns
     */
    const handleChange = (filedName: string, val: any) => {
        console.log(filedName, val);
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
        Object.keys(changeValues).map((item: any) => {
            const setFieldVal: any = {};
            current?.setFieldsValue(setFieldVal);
        })
    }

    const handleUpload = async () => {
        const result: any = await uploadCTCenter({UserID: getUserID(), CTID: Number(atob(params?.id)), custType: CTCenterType});
        if (result.Result) {
            message.success('success!');
        } else {
            message.error(result.Content);
        }
    }

    //region TODO: 显示隐藏：{SCAC, IATA}
    //endregion
    // TODO: 返回列表集合
    const returnURL = pathname.substring(0, pathname.indexOf('/form')) + '/list';

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
                initialValues={BranchInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={async (values) => {
                    console.log(values);
                }}
                // TODO: 向后台请求数据
                request={async () => handleGetBranchInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='name_full_en'
                                placeholder=''
                                tooltip='length: 100'
                                label='Company'
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='name_full_local'
                                placeholder=''
                                tooltip='length: 100'
                                label='Company'
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='name_short_en'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='name_short_local'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='org_id'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea name='Address' placeholder='' label='address'/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            <ProFormTextArea name='legal_entity' placeholder='' label='Legal Entity'/>
                        </Col>
                    </Row>

                    {/** // TODO: MDM Number<主数据代码>、CV-Center Number<客商代码>、Oracle ID (Customer)、
                     // TODO: Oracle ID (Vendor)、Sinotrans Company ID<如果是中外运内部公司，则有一个5位数字的编码> */}
                    <Row gutter={24}>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='mdm_code'
                                label='MDM Number'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='internal_code'
                                label='CDH Code'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='OracleID'
                                label='Oracle ID (Customer)'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='OracleIDSupplier'
                                label='Oracle ID (Vendor)'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='internal_company_code'
                                label='Sinotrans Company ID'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='internal_org_code'
                                label='Sinotrans Dept. ID'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='organization_code'
                                label='Organization Code'
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Properties'} className={'ant-card ant-cv-center-properties'}>
                    {/** // TODO: Nature of a Company */}
                    <Row gutter={24}>
                        <Col span={3} className={'ant-cv-center-properties-label'}>
                            <label>Nature of a Company : </label>
                        </Col>
                        <Col span={20}>
                            <ProFormRadio.Group
                                name='enterprise_type'
                                options={CustomerPropertyList}
                            />
                        </Col>
                    </Row>
                    {/** // TODO: Industry、、、、、、、 */}
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormTreeSelect
                                required
                                placeholder=''
                                label='Industry'
                                name='industry_type'
                                request={async () => IndustryList}
                                fieldProps={{
                                    treeDefaultExpandAll: true,
                                    dropdownMatchSelectWidth: false,
                                }}
                            />
                        </Col>
                        {/* TODO: 船公司编码 */}
                        <Col span={3}>
                            <ProFormText
                                name='scac'
                                label='SCAC'
                                placeholder=''
                            />
                        </Col>
                        {/* TODO: 航空公司编码 */}
                        <Col span={3}>
                            <ProFormText
                                label='IATA'
                                placeholder=''
                                name='iata_code'
                            />
                        </Col>
                        {/* TODO: 满足是航空公司时显示 */}
                        <Col span={3}>
                            <ProFormSwitch
                                placeholder=''
                                name='enable_flag'
                                label='Freezen'
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => history.push({pathname: returnURL})}>返回</Button>}>
                    <Space>
                        <Popover
                            title={'Please select the type of merchant center!'}
                            content={
                                <>
                                    <Radio.Group name="radioGroup" onChange={e => setCTCenterType(e.target.value)}>
                                        <Radio value={0}>External Companies</Radio>
                                        <Radio value={2} disabled={form.getFieldValue('internal_company_code')}>
                                            Internal Company
                                        </Radio>
                                        <Radio value={3} disabled={form.getFieldValue('internal_org_code')}>
                                            Internal Department
                                        </Radio>
                                        <Radio value={4}>Individual Merchants</Radio>
                                    </Radio.Group>
                                    <Button icon="upload" type="primary" onClick={handleUpload}>
                                        OK
                                    </Button>
                                </>
                            }
                        >
                            <Button key={'submit'} type={'primary'}>Upload C&V Center</Button>
                        </Popover>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default BranchForm;