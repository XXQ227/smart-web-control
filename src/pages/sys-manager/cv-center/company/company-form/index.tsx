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
import {getFormErrorMsg, rowGrid} from "@/utils/units";
import SearchProFormSelect from "@/components/SearchProFormSelect";

export type LocationState = Record<string, unknown>;
type APICVInfo = APIManager.BUInfo;

const cityList = [
    {label: 'HONG KONG', value: 1},
    {label: 'SHENZHEN', value: 2},
    {label: 'SHANGHAI', value: 3},
    {label: 'BEIJING', value: 4},
    {label: 'GUANGZHOU', value: 5},
]

const BUForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}, location: {state}} = props;
    const id = atob(params?.id);
    // const {location: {pathname}} = history;
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    // const {current} = formRef;
    //region TODO: 数据层
    const {
        addBusinessUnit,
        BUInfo, uploadCTCenter
    } = useModel('manager.cv-center', (res: any) => ({
        addBusinessUnit: res.addBusinessUnit,

        BUInfo: res.BUInfo,
        getGetCTPByID: res.getGetCTPByID,
        uploadCTCenter: res.uploadCTCenter,
    }));

    const {
        queryDictCommon, IndustryList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        IndustryList: res.IndustryList,
    }))

    const [CVInfoVO, setCVInfoVO] = useState<APICVInfo>(BUInfo);
    // const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
    const [CTCenterType, setCTCenterType] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    //endregion

    useEffect(() => {
        setTimeout(async () => {
            if (IndustryList?.length === 0) {
                await queryDictCommon({dictCodes: ['industry']});
            }
        })

    }, [])


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    /*const handleGetCTPByID = async () => {
        const result: any = await getGetCTPByID({UserID: getUserID(), CTPID: Number(atob(params?.id))});
        setCVInfoVO(result);
        return result;
    }*/

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/5/22
     * @param filedName
     * @param val
     * @returns
     */
    /*const handleChange = (filedName: string, val: any) => {
        console.log(filedName, val);
    }*/

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
     * @date 2023/7/12
     * @param val
     * @returns
     */
    const onFinish = async (val: APICVInfo) => {
        setLoading(true);
        let result: API.Result;
        /*const param: any = {
            // contactName: val.contactName,
        };*/
        if (id === '0') {
            // TODO: 新增业务单位
            val.cityName = cityList.find(city => city.value === val.cityId)?.label ?? '';
            console.log(val)
            result = await addBusinessUnit(val);
        } else {
            // TODO: 编辑公司
            // param.id = id;
            result = await addBusinessUnit(val);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/cv-center/company/form/${btoa(result.data)}`});
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

    //region TODO: 显示隐藏：{SCAC, IATA}
    //endregion
    // TODO: 返回列表集合
    // const returnURL = pathname.substring(0, pathname.indexOf('/form')) + '/dict';

    return (
        <PageContainer
            loading={loading}
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
                initialValues={CVInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                // onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                // request={async () => handleGetCTPByID()}
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
                                name='taxNum'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 25'
                                rules={[{max: 25, message: 'length: 25'}]}
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
                                name='mdmStatus'
                                placeholder=''
                                label='MDM Status'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                placeholder=''
                                label='Nature of a Company'
                                name='enterpriseType'
                                options={[
                                    {label: '私企（民营企业）', value: 1},
                                    {label: '外企（外资企业）', value: 2},
                                    {label: '央企', value: 3},
                                    {label: '地方国企-省属', value: 4},
                                    {label: '地方国企-市属', value: 5},
                                    {label: '地方国企-其他', value: 6},
                                ]}
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
                            <ProFormText
                                name='iataCode'
                                placeholder=''
                                label='IATA'
                                tooltip='length: 10'
                                rules={[{max: 10, message: 'length: 10'}]}
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
                                rules={[{required: true, message: 'Registered Capital'}]}
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
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                required
                                placeholder=''
                                label='Nature of a Company'
                                name='natureOfCompany'
                                rules={[{required: true, message: 'Nature of a Company'}]}
                                options={[
                                    {label: '合营企业', value: 1},
                                    {label: '个人独资企业', value: 2},
                                    {label: '国有企业', value: 3},
                                    {label: '私营企业', value: 4},
                                    {label: '全民所有制企业', value: 5},
                                    {label: '集体所有制企业', value: 6},
                                    {label: '股份有限公司', value: 7},
                                    {label: '有限责任企业', value: 8},
                                    {label: '外商投资企业', value: 9},
                                    {label: '有限合伙企业', value: 10},
                                ]}
                            />
                        </Col>
                        {/*<Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSwitch
                                name="enableFlag"
                                label="Freezen"
                                checkedChildren="Yes"
                                unCheckedChildren="No"
                            />
                        </Col>*/}
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => history.push({
                            pathname: '/manager/cv-center/company/list',
                            state: {
                                searchParams: state ? (state as LocationState)?.searchParams : '',
                            },
                        })}
                    >Back</Button>}>
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
export default BUForm;