import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm, ProFormDatePicker, ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components'
import {Button, Col, Form, Popover, Row, Space, Radio} from 'antd'
import {getUserID} from '@/utils/auths'
import {useModel, history} from 'umi'
import {message} from 'antd/es'
import {getFormErrorMsg, rowGrid, IconFont, getValue} from "@/utils/units";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import {NATURE_OF_COMPANY} from '@/utils/common-data'
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import ls from "lodash";

export type LocationState = Record<string, unknown>;
type APIBU = APIManager.BU;

const cityList = [
    {label: 'HONG KONG', value: '1'},
    {label: 'SHENZHEN', value: '2'},
    {label: 'SHANGHAI', value: '3'},
    {label: 'BEIJING', value: '4'},
    {label: 'GUANGZHOU', value: '5'},
]

const BusinessUnitForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}, location: {state}} = props;
    const id = atob(params?.id);
    // const {location: {pathname}} = history;
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    // const {current} = formRef;
    //region TODO: 数据层
    const {
        queryBusinessUnitInfo, addBusinessUnit, editBusinessUnit, operateBusinessUnit,
        uploadCTCenter
    } = useModel('manager.business-unit', (res: any) => ({
        queryBusinessUnitInfo: res.queryBusinessUnitInfo,
        addBusinessUnit: res.addBusinessUnit,
        editBusinessUnit: res.editBusinessUnit,
        operateBusinessUnit: res.operateBusinessUnit,

        getGetCTPByID: res.getGetCTPByID,
        uploadCTCenter: res.uploadCTCenter,
    }));

    const {
        queryDictCommon, IndustryList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        IndustryList: res.IndustryList,
    }))

    const [BUInfoVO, setBUInfoVO] = useState<any>({});
    // const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
    const [CTCenterType, setCTCenterType] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [parentValue, setParentValue] = useState<number | null>(null);
    const [parentCompanyNameValue, setParentCompanyNameValue] = useState<string>('');
    //endregion

    /**
     * @Description: TODO: 获取 BU 详情
     * @author LLS
     * @date 2023/7/31
     * @returns
     */
    const handleGetBUInfo = async () => {
        setLoading(true);
        if (IndustryList?.length === 0) {
            await queryDictCommon({dictCodes: ['industry']});
        }
        const result: any = await queryBusinessUnitInfo({id});
        if (result.success) {
            // TODO: Nature of a Company 根据后台传回来的natureOfCompany参数，找到对应的label名称
            console.log(result?.data?.natureOfCompany)
            const enterpriseTypeValue: APIBU = getValue(NATURE_OF_COMPANY, result?.data?.natureOfCompany);
            console.log(enterpriseTypeValue)
            let newData = result.data;
            if (id !== '0') {
                setParentValue(1)
                console.log(newData?.parentCompanyName)
                setParentCompanyNameValue(newData?.parentCompanyName)
                newData = {...newData, ...enterpriseTypeValue}
            }
            console.log(newData);
            setBUInfoVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 当 ProForm 表单修改时，调用此方法
     * @author XXQ
     * @date 2023/5/8
     * @param changeValues   ProForm 表单修改的参数
     * @returns
     */
    /*const handleProFormValueChange = (changeValues: any) => {
        console.log(changeValues);
        if (!isChangeValue) {
            setIsChangeValue(true);
        }
        Object.keys(changeValues).map((item: any) => {
            const setFieldVal: any = {};
            current?.setFieldsValue(setFieldVal);
        })
    }*/

    const handleUpload = async () => {
        const result: any = await uploadCTCenter({UserID: getUserID(), CTID: Number(atob(params?.id)), custType: CTCenterType});
        if (result.Result) {
            message.success('success!');
        } else {
            message.error(result.Content);
        }
    }

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/7/31
     * @param val
     * @returns
     */
    const onFinish = async (val: APIBU) => {
        setLoading(true);
        let result: API.Result;
        delete val.enterpriseType;
        val.cityName = cityList.find(city => city.value === val.cityId)?.label ?? '';
        val.industryName = IndustryList.find((industry: any) => industry.value === val.industryType)?.label ?? '';
        console.log(parentCompanyNameValue);
        val.parentCompanyId = val.parentCompanyId ? val.parentCompanyId : null;
        val.parentCompanyName = parentCompanyNameValue;
        val.establishedDate = val.establishedDate ? val.establishedDate : '';
        if (id === '0') {
            // TODO: 新增业务单位
            console.log(val)
            result = await addBusinessUnit(val);
        } else {
            // TODO: 编辑业务单位
            val.id = id;
            console.log(val)
            result = await editBusinessUnit(val);
        }
        console.log(result)
        if (result?.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/business-unit/form/${btoa(result.data)}`});
        } else {
            message.error(result?.message)
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

    /**
     * @Description: TODO: 启用或禁用业务单位
     * @author LLS
     * @date 2023/7/31
     * @returns
     */
    const handleOperateBU = async () => {
        setLoading(true);
        const newData: APIBU = ls.cloneDeep(BUInfoVO);
        // TODO: 冻结取反上传数据
        const param: any = {
            id: newData.id,
            operate: newData.enableFlag ? 0 : 1
        };
        const result: API.Result = await operateBusinessUnit(param);
        if (result.success) {
            message.success(param.operate ? 'Freeze Success' : 'UnFreeze Success');
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                disabled={!!BUInfoVO?.enableFlag}
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={BUInfoVO}
                formKey={'business-unit-information'}
                // TODO: 空间有改数据时触动
                // onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetBUInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='BU Name'
                                name='nameFullEn'
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Name'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                name='taxNum'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 25'
                                rules={[{required: true, message: 'Tax Num'}, {max: 25, message: 'length: 25'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                required
                                placeholder=''
                                label='Located in (City)'
                                name='cityId'
                                rules={[{required: true, message: 'City'}]}
                                options={cityList}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='internalCode'
                                placeholder=''
                                label='Internal Code'
                                tooltip='length: 6'
                                rules={[{max: 6, message: 'length: 6'}, {min: 6, message: 'length: 6'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='mdmCode'
                                placeholder=''
                                label='MDM Number'
                                tooltip='length: 50'
                                rules={[{max: 50, message: 'length: 50'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='scac'
                                placeholder=''
                                label='SCAC'
                                tooltip='length: 10'
                                rules={[{max: 10, message: 'length: 10'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='iataCode'
                                placeholder=''
                                label='IATA'
                                tooltip='length: 10'
                                rules={[{max: 10, message: 'length: 10'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <SearchProFormSelect
                                qty={10}
                                isShowLabel={true}
                                required={false}
                                label="Parent Company (Belongs to Group)"
                                id={'parentCompanyId'}
                                name={'parentCompanyId'}
                                url={"/apiBase/branch/queryBranchCommon"}
                                handleChangeData={(val: any, option: any) =>  {
                                    console.log(option?.label)
                                    setParentCompanyNameValue(option?.label)
                                }}
                                handleClearData={() => setParentCompanyNameValue('')}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='organizationCode'
                                placeholder=''
                                label='Organization Code'
                                tooltip='length: 50'
                                rules={[{max: 50, message: 'length: 50'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='internalCompanyCode'
                                placeholder=''
                                label='Internal Company Code'
                                tooltip='length: 50'
                                rules={[{max: 50, message: 'length: 50'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='internalOrgCode'
                                placeholder=''
                                label='Internal Department Code'
                                tooltip='length: 50'
                                rules={[{max: 50, message: 'length: 50'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                required
                                placeholder=''
                                label="Industry"
                                id={'industryType'}
                                name={'industryType'}
                                options={IndustryList}
                                rules={[{required: true, message: 'Industry'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <label className={'ant-form-label-required'} style={{ display: 'block', marginBottom: 8 }}>Nature of a Company</label>
                            <Row>
                                <Col xs={11} sm={11} md={11} lg={11} xl={11} xxl={8}>
                                    <ProFormSelect
                                        required
                                        name="enterpriseType"
                                        placeholder=''
                                        options={NATURE_OF_COMPANY.map((option) => ({
                                            value: option.value,
                                            label: option.label,
                                        }))}
                                        fieldProps={{
                                            onChange: (e) => {
                                                setParentValue(e)
                                                form.setFieldsValue({natureOfCompany: null});
                                            }
                                        }}
                                        rules={[{required: true, message: 'Nature of a Company'}]}
                                    />
                                </Col>
                                {
                                    parentValue ?
                                        <>
                                            <Col>
                                                <span className={'ant-space-span'}/>
                                            </Col>
                                            <Col xs={11} sm={11} md={11} lg={11} xl={11} xxl={8}>
                                                <ProFormSelect
                                                    required
                                                    name="natureOfCompany"
                                                    placeholder=''
                                                    options={[]}
                                                    dependencies={['enterpriseType']}
                                                    shouldUpdate={(prevValues, curValues) => prevValues.enterpriseType !== curValues.enterpriseType}
                                                    request={async () => {
                                                        const selectedParent = NATURE_OF_COMPANY.find((option) => option.value === form.getFieldValue('enterpriseType'));
                                                        if (selectedParent) {
                                                            return selectedParent.children.map((child) => ({
                                                                value: child.value,
                                                                label: child.label,
                                                            }));
                                                        }
                                                        return [];
                                                    }}
                                                    rules={[{required: true, message: 'Nature of a Company'}]}
                                                />
                                            </Col>
                                        </> : null
                                }
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                name='corporation'
                                placeholder=''
                                label='Corporation'
                                tooltip='length: 20'
                                rules={[{max: 20, message: 'length: 20'},{required: true, message: 'Corporation'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                name='registeredCapital'
                                placeholder=''
                                label='Registered Capital'
                                rules={[{required: true, message: 'Registered Capital'}, { pattern: /^([0-9]\d*|0)(\.\d{0,2})?$/, message: "Must be 0.00 in numeric format" }]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='paidInCapital'
                                placeholder=''
                                label='Paid In Capital'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormDatePicker
                                placeholder=''
                                name="establishedDate"
                                label="Established Date"
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={
                        <Button
                            disabled={false}
                            onClick={() => history.push({
                                pathname: '/manager/business-unit/list',
                                state: {
                                    searchParams: state ? (state as LocationState)?.searchParams : '',
                                },
                            })}
                            icon={<ArrowLeftOutlined/>}
                        >
                            Back
                        </Button>
                    }
                >
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
                            <Button key={'submit'} type={'primary'} style={{marginRight: 7}}>Upload C&V Center</Button>
                        </Popover>
                        <Button
                            disabled={false}
                            hidden={id === '0'}
                            onClick={handleOperateBU}
                            icon={<IconFont type={!!BUInfoVO?.enableFlag ? 'icon-unfreeze' : 'icon-freeze'}/>}
                            className={!!BUInfoVO?.enableFlag ? 'ant-unfreeze-button' : 'ant-freeze-button'}
                            style={{marginRight: 7}}
                        >
                            Freeze
                        </Button>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'} icon={<SaveOutlined/>}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default BusinessUnitForm;