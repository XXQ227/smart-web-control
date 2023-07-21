import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormRadio,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components'
import {Button, Col, Form, Row, Tag, Checkbox, Divider} from 'antd'
import {getUserID} from '@/utils/auths'
import SearchModal from '@/components/SearchModal'
import {message} from 'antd/es'
import ls from 'lodash';
import {useModel, history} from 'umi'
import {getFormErrorMsg, IconFont, rowGrid} from "@/utils/units";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import {NATURE_OF_COMPANY} from "@/utils/common-data";

export type LocationState = Record<string, unknown>;
type APIBUP = APIManager.BUP;
type APIBUAndBUPCommonInfo = APIManager.BUAndBUPCommonInfo;

const BUPForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}, location: {state}} = props;
    // console.log(state)
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    // const {current} = formRef;
    //region TODO: 数据层
    const {
        addBusinessUnitProperty, queryBusinessUnitPropertyInfo,
        BUInfo,
    } = useModel('manager.cv-center', (res: any) => ({
        BUInfo: res.BUInfo,

        addBusinessUnitProperty: res.addBusinessUnitProperty,
        queryBusinessUnitPropertyInfo: res.queryBusinessUnitPropertyInfo,
    }));

    const {
        queryDictCommon, BusinessLineList, VendorTypeList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        BusinessLineList: res.BusinessLineList,
        VendorTypeList: res.VendorTypeList,
    }))

    const [BUPInfoVO, setBUPInfoVO] = useState<any>({});

    const [BUAndBUPCommonInfoVO, setBUAndBUPCommonInfoVO] = useState<APIBUAndBUPCommonInfo>((state as LocationState)?.BUParams as APIBUAndBUPCommonInfo || {});
    const [ClientVO, setClientVO] = useState<API.APIKey$Value[]>(BUInfo.CTList);
    // const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
    const [companyNameEN, setCompanyNameEN] = useState<API.APIValue$Label>({
        label: BUInfo.NameFullEN, value: BUInfo.ID
    });
    const [loading, setLoading] = useState<boolean>(false);

    // TODO: 客户类型
    const [customerTypeID, setCustomerTypeID] = useState<number | null>(BUInfo.CTTypeItemClient);
    // TODO: 供应商类型
    const [vendorTypeList, setVendorTypeList] = useState<number[] | null>(BUInfo.CTTypeItemListSupplier);
    //endregion

    useEffect(() => {
        if (BUInfo.CTList?.length !== ClientVO?.length) {
            setClientVO(BUInfo.CTList);
        }
        if (!!BUInfo.CTTypeItemClient && !customerTypeID) {
            setCustomerTypeID(BUInfo.CTTypeItemClient);
        }
        if (BUInfo.CTTypeItemListSupplier?.length > 0 && vendorTypeList?.length === 0) {
            setVendorTypeList(BUInfo.CVInfo.CTTypeItemListSupplier);
        }
    }, [BUInfo.CTList, ClientVO?.length])

    useEffect(() => {
        setTimeout(async () => {
            if (BusinessLineList?.length === 0) {
                await queryDictCommon({dictCodes: ['business_line']});
            }
            if (VendorTypeList?.length === 0) {
                await queryDictCommon({dictCodes: ['vendor_type']});
            }
        })
    }, [])

    /*useMemo(()=> {
        if (BUPInfoVO.NameFull && BUInfo.NameFull && BUPInfoVO.NameFull !== BUInfo.NameFull) {
            setBUPInfoVO(BUInfo);
        }
    }, [BUInfo, BUPInfoVO.NameFull])*/

    /**
     * @Description: TODO: 获取 BUP 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetBUPInfo = async () => {
        setLoading(true);
        const result: any = await queryBusinessUnitPropertyInfo({id});
        if (result.success) {
            console.log(BUAndBUPCommonInfoVO);
            const newData = result.data || BUAndBUPCommonInfoVO
            if (id !== '0') {
                newData.businessLine = [`${newData.businessLine}`];
            }
            console.log(newData);
            setBUPInfoVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
        return result;
    }

    const handleSelectPayers = (val: any, option: any) => {
        const clientObj: API.APIKey$Value = ClientVO?.find((item: API.APIKey$Value) => item.Key === val) || {};
        if (clientObj.Key) {
            message.success('success!');
        } else {
            const clientArr: API.APIKey$Value[] = ls.cloneDeep(ClientVO)
            clientArr.push({Key: val, Value: option.label});
            message.success('success!');
            setClientVO(clientArr);
        }
    }

    /**
     * @Description: TODO: 删除相关付款方
     * @author XXQ
     * @date 2023/5/6
     * @param payerID   相关付款方 id
     * @returns
     */
    const handleModalClose = (payerID: number) => {
        const ClientOpt = ClientVO.filter((item: any) => item.Key !== payerID);
        setClientVO(ClientOpt);
    }

    /**
     * @Description: TODO: 清空为保存的客户属性
     * @author XXQ
     * @date 2023/5/8
     * @param clearFiledName    需要被清空的字段
     * @returns
     */
    const handleClearCustomer = (clearFiledName: string) => {
        form?.setFieldsValue({[clearFiledName]: null});
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
            // TODO: 客户类型
            if (item === 'CTTypeItemClient') {
                setFieldVal.SCAC =  changeValues[item] === 14 && vendorTypeList?.includes(5) ? BUInfo.SCAC : '';
                setCustomerTypeID(changeValues[item]);
            }
            // TODO: 供应商类型
            else if (item === 'CTTypeItemListSupplier') {
                // TODO: 没选航空公司时，清空 IATA
                setFieldVal.IATA = changeValues[item]?.includes(6) ? BUInfo.SCAC : '';
                // TODO: 没选船公司时，清空 SCAC
                setFieldVal.SCAC =  customerTypeID === 14 || changeValues[item]?.includes(5) ? BUInfo.SCAC : '';
                setVendorTypeList(changeValues[item]);
            }
            current?.setFieldsValue(setFieldVal);
        })
    }*/

    const handleChangeData = (val: any, filedName: string) => {
        console.log(val);
        if (filedName === 'name_full_en') {
            setCompanyNameEN(val);
        }
    }

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/7/13
     * @param val
     * @returns
     */
    const onFinish = async (val: APIBUP) => {
        setLoading(true);
        let result: API.Result;
        if (id === '0') {
            // TODO: 新增业务单位属性
            val.businessUnitId = BUAndBUPCommonInfoVO?.value;
            val.branchId = "1665596906844135426";
            val.businessLine = val.businessLine?.toString();
            val.payerFlag = val.payerFlag ? 1 : 0;
            val.reimbursementFlag = val.reimbursementFlag ? 1 : 0;
            val.customerFlag = val.customerType ? 1 : 0;
            val.vendorFlag = val.vendorTypeList ? 1 : 0;
            delete val.label;
            console.log(val)
            result = await addBusinessUnitProperty(val);
        } else {
            // TODO: 编辑业务单位属性
            val.id = id;
            result = await addBusinessUnitProperty(val);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/cv-center/customer/form/${btoa(result.data)}`});
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
                initialValues={BUPInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                // onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetBUPInfo()}
            >
                <ProCard
                    className={'ant-card'}
                    title={'Name'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                disabled={true}
                                placeholder=''
                                label='BU Name'
                                name='label'
                            />
                            {/*<SearchProFormSelect
                                required
                                qty={10}
                                isShowLabel={true}
                                label="BU Name"
                                id={'parentCompanyId'}
                                name={'parentCompanyId'}
                                url={"/apiBase/businessUnit/queryBusinessUnitCommon"}
                            />*/}
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name(EN)'
                                name='nameFullEn'
                                tooltip='length: 500'
                                initialValue={BUAndBUPCommonInfoVO?.label}
                                rules={[{required: true, message: 'Name(EN)'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                name='nameShort'
                                tooltip='length: 100'
                                initialValue={BUAndBUPCommonInfoVO?.label}
                                rules={[{required: true, message: 'Short Name'}, {max: 100, message: 'length: 100'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name(CN)'
                                name='nameFullCn'
                                tooltip='length: 500'
                                initialValue={BUAndBUPCommonInfoVO?.label}
                                rules={[{required: true, message: 'Name(CN)'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name(For Print)'
                                name='namePrint'
                                tooltip='length: 500'
                                initialValue={BUAndBUPCommonInfoVO?.label}
                                rules={[{max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Contact'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Contacts'
                                name='contacts'
                                tooltip='length: 30'
                                rules={[{required: true, message: 'Contacts'}, {max: 30, message: 'length: 30'}]}
                            />
                            <SearchProFormSelect
                                required={false}
                                qty={10}
                                isShowLabel={true}
                                label="Sales (From Sinotrans)"
                                id={'salesId'}
                                name={'salesId'}
                                url={"/apiBase/user/queryUserCommon"}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                            <ProFormText
                                placeholder=''
                                label='Telephone Number'
                                name='phone'
                                tooltip='length: 20'
                                rules={[{max: 20, message: 'length: 20'}]}
                            />
                            <ProFormSelect
                                readonly
                                placeholder=''
                                label='Located in (City)'
                                name='cityId'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                            <ProFormText
                                placeholder=''
                                label='Email'
                                name='Email'
                                tooltip='length: 30'
                                rules={[{max: 30, message: 'length: 30'}]}
                            />
                            <ProFormSelect
                                readonly
                                placeholder=''
                                label='Parent Company (Belongs to Group)'
                                name='parentCompanyId'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={18} xxl={9}>
                            <ProFormTextArea
                                required
                                name='address'
                                placeholder=''
                                label='Address'
                                fieldProps={{rows: 4}}
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Address'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card'}
                    title={'Code'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                readonly
                                name='mdmCode'
                                placeholder=''
                                label='MDM Number'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='cvCenterNumber'
                                placeholder=''
                                label='CV-Center Number'
                                tooltip='length: 50'
                                rules={[{max: 50, message: 'length: 50'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='oracleCustomerCode'
                                placeholder=''
                                label='OracleID (Customer)'
                                tooltip='length: 15'
                                rules={[{max: 15, message: 'length: 15'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                name='oracleSupplierCode'
                                placeholder=''
                                label='OracleID (Vendor)'
                                tooltip='length: 15'
                                rules={[{max: 15, message: 'length: 15'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    className={'ant-card ant-cv-center-properties'}
                    title={'Properties'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col xs={3} sm={3} md={3} lg={3} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label className={'ant-form-label-required'}>Business Line : </label>
                        </Col>
                        <Col xs={20} sm={20} md={20} lg={20} xl={20} xxl={20}>
                            <ProFormCheckbox.Group
                                required
                                name='businessLine'
                                options={BusinessLineList}
                                rules={[{required: true, message: 'Business Line'}]}
                            />
                        </Col>
                        <Col xs={20} sm={20} md={20} lg={20} xl={22} xxl={14}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={3} sm={3} md={3} lg={3} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label>Nature of a Company : </label>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <Row>
                                <Col span={8}>
                                    <ProFormSelect
                                        disabled={true}
                                        name="enterpriseType"
                                        placeholder=''
                                        options={NATURE_OF_COMPANY.map((option) => ({
                                            value: option.value,
                                            label: option.label,
                                        }))}
                                        /*fieldProps={{
                                            onChange: (e) => {
                                                setParentValue(e)
                                                form.setFieldsValue({natureOfCompany: null});
                                            }
                                        }}*/
                                    />
                                </Col>
                                <Col>
                                    <span className={'ant-space-span'}/>
                                </Col>
                                <Col span={8}>
                                    <ProFormSelect
                                        disabled={true}
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
                                    />
                                </Col>
                            </Row>
                        </Col>
                        {/*<Col xs={20} sm={20} md={20} lg={20} xl={6} xxl={8}>
                            <ProFormSelect
                                width='md'
                                placeholder=''
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
                            <ProFormText name="name" label="姓名" />
                            <ProFormSelect
                                name="addr"
                                width="md"
                                label="与 name 联动的选择器"
                                // dependencies 的内容会注入 request 中
                                dependencies={['name']}
                                request={async (param) => [
                                    { label: param.name, value: 'all' },
                                    { label: 'Unresolved', value: 'open' },
                                    { label: 'Resolved', value: 'closed' },
                                    { label: 'Resolving', value: 'processing' },
                                ]}
                            />
                        </Col>*/}
                        <Col xs={20} sm={20} md={20} lg={20} xl={22} xxl={14}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={3} sm={3} md={3} lg={3} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label>Property (as Customer) : </label>
                        </Col>
                        <Col xs={20} sm={20} md={20} lg={20} xl={18} xxl={15}>
                            <ProFormRadio.Group
                                name="customerType"
                                options={[
                                    {
                                        label: 'Direct Customer 直客',
                                        value: 1,
                                    },
                                    {
                                        label: 'Peer 同行',
                                        value: 2,
                                    },
                                    {
                                        label: 'CMG 招商',
                                        value: 3,
                                    },
                                    {
                                        label: 'Sinotrans 中外运公司',
                                        value: 4,
                                    },
                                    {
                                        label: 'Carrier(as Customer) 船公司',
                                        value: 5,
                                    },
                                ]}
                            />
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={1} xxl={2}>
                            <Button icon={<IconFont type={'icon-clear'} />}
                                    style={{border: "none", padding: '0 10px'}}
                                    onClick={() => handleClearCustomer('customerType')}
                            >
                                Clear
                            </Button>
                        </Col>
                        <Col xs={20} sm={20} md={20} lg={20} xl={22} xxl={14}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={3} sm={3} md={3} lg={3} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label>Property (as Vendor) : </label>
                        </Col>
                        <Col xs={20} sm={20} md={20} lg={20} xl={20} xxl={20}>
                            {/*<ProFormCheckbox.Group
                                name='vendorTypeList'
                                options={VendorTypeList}
                            />*/}
                            <ProFormCheckbox.Group name='vendorTypeList'>
                                <Row>
                                    {
                                        VendorTypeList && VendorTypeList.length > 0 ? VendorTypeList.map((x: any) => {
                                            return <Col span={4}><Checkbox key={x.value} value={x.value}>{x.label}</Checkbox></Col>
                                        }) : null
                                    }
                                </Row>
                            </ProFormCheckbox.Group>
                        </Col>
                        <Col xs={20} sm={20} md={20} lg={20} xl={22} xxl={14}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                disabled={true}
                                placeholder=''
                                label="Industry"
                                name={'industryName'}
                            />
                            <Row>
                                <Col span={6}>
                                    <ProFormSwitch
                                        name="payerFlag"
                                    />
                                </Col>
                                <Col span={12} style={{marginTop: '5px'}}>
                                    <label>Is Payer</label>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                required
                                placeholder=''
                                name="settlementType"
                                label="Payment Terms"
                                options={[
                                    {label: 'Cash Account - No Credit', value: 1},
                                    {label: 'Credit Sale', value: 2},
                                ]}
                                rules={[{required: true, message: 'Payment Terms'}]}
                            />
                            <Row>
                                <Col span={6}>
                                    <ProFormSwitch
                                        name="reimbursementFlag"
                                    />
                                </Col>
                                <Col span={12} style={{marginTop: '5px'}}>
                                    <label>Is Reimbursement</label>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={11} xxl={9}>
                            <ProFormTextArea
                                name='remark'
                                placeholder=''
                                label='Remark'
                                fieldProps={{rows: 4}}
                                tooltip='length: 500'
                                rules={[{max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                {/*<ProCard title={'Properties'} className={'ant-card ant-cv-center-properties'}>
                     // TODO: Business Line
                    <Row gutter={24}>
                        <Col span={3} className={'ant-cv-center-properties-label'}>
                            <label>Business Line : </label>
                        </Col>
                        <Col span={20}>
                            <ProFormCheckbox.Group
                                required
                                // label='Business Line'
                                name='BusinessLineList'
                                colProps={{span: 5,}}
                                // options={BusinessLineList}
                            />
                        </Col>
                    </Row>
                    * // TODO: Nature of a Company
                    <Row gutter={24}>
                        <Col span={3} className={'ant-cv-center-properties-label'}>
                            <label>Nature of a Company : </label>
                        </Col>
                        <Col span={20}>
                            <ProFormRadio.Group
                                name='CustomerPropertyID'
                                options={CustomerPropertyList}
                            />
                        </Col>
                        <Col span={1} className={'ant-cv-center-properties-clear'}>
                            <CloseOutlined
                                // TODO: 未保存的客户属性是可以被清空的
                                // hidden={!!BUPInfoVO.CustomerPropertyID}
                                onClick={() => handleClearCustomer('CustomerPropertyID')}
                            />
                        </Col>
                    </Row>
                    * // TODO: Property (as Customer)
                    <Row gutter={24}>
                        <Col span={3} className={'ant-cv-center-properties-label'}>
                            <label>Property (as Customer) : </label>
                        </Col>
                        <Col span={20}>
                            <ProFormRadio.Group
                                name='CTTypeItemClient'
                                options={CustomerTypeList}
                            />
                        </Col>
                        <Col span={1} className={'ant-cv-center-properties-clear'}>
                            <CloseOutlined
                                // TODO: 为保存的客户类型是可以被清空的
                                // hidden={!!BUPInfoVO.CTTypeItemClient}
                                onClick={() => handleClearCustomer('CTTypeItemClient')}
                            />
                        </Col>
                    </Row>
                    * // TODO: Property (as Vendor)
                    <Row gutter={24}>
                        <Col span={3} className={'ant-cv-center-properties-label'}>
                            <label>Property (as Vendor) : </label>
                        </Col>
                        <Col span={20}>
                            <ProFormCheckbox.Group
                                name='CTTypeItemListSupplier'
                                options={VendorTypeList}
                            />
                        </Col>
                    </Row>
                    * // TODO: Industry、、、、、、、
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormTreeSelect
                                name='IndustryID'
                                required
                                placeholder=''
                                label='Industry'
                                request={async () => IndustryList}
                                fieldProps={{
                                    treeDefaultExpandAll: true,
                                    dropdownMatchSelectWidth: false,
                                }}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                name='Settlement'
                                required
                                placeholder=''
                                label='Payment Terms'
                                request={async () => [
                                    {label: 'Cash Account - No Credit', value: 1},
                                    {label: 'Credit Sale', value: 2},
                                ]}
                                fieldProps={{
                                    dropdownMatchSelectWidth: false,
                                }}
                            />
                        </Col>
                         TODO: 是否是仅付款方
                        <Col span={2}>
                            <ProFormSwitch
                                name='IsOnlySettlement'
                                label='Is Payer'
                            />
                        </Col>
                         TODO: 是否是仅代收代付
                        <Col span={3}>
                            <ProFormSwitch
                                name='IsReimbursement'
                                label='Is Reimbursement'
                            />
                        </Col>
                         TODO: 满足是船公司时显示
                        <Col span={3} hidden={!(customerTypeID === 14 || vendorTypeList?.includes(5))}>
                            <ProFormText
                                placeholder=''
                                name='SCAC'
                                label='SCAC'
                            />
                        </Col>
                         TODO: 满足是航空公司时显示
                        <Col span={3} hidden={!(vendorTypeList?.includes(6))}>
                            <ProFormText
                                placeholder=''
                                name='IATA'
                                label='IATA'
                            />
                        </Col>
                    </Row>
                     // TODO: 客户备注
                    <Row gutter={24}>
                        <Col span={24}>
                            <ProFormTextArea name='CVRemark' placeholder='' label='Remark'/>
                        </Col>
                    </Row>
                </ProCard>*/}

                {/* // TODO: 相关付款客户 */}
                <ProCard title={'Payers'} className={'ant-card ant-card-payers'} extra={
                    <SearchModal
                        qty={10}
                        isBtn={true}
                        title={'Payer'}
                        id={'search-payer'}
                        btnName={'Add Payer'}
                        url={'/api/MCommon/GetCTNameByStrOrType'}
                        query={{
                            CTType: 1, PageSize: 10, UserID: getUserID(),
                            SystemID: 8, IsJobCustomer: true, searchPayer: true
                        }}
                        handleChangeData={handleSelectPayers}
                    />
                }>
                    <Row gutter={24}>
                        <Col span={24}>
                            {ClientVO?.map((item: any) =>
                                <Tag key={item.Key} closable style={{margin: 6}}
                                     onClose={() => handleModalClose(item.Key)}>
                                    {item.Value}
                                </Tag>
                            )}
                        </Col>
                    </Row>
                </ProCard>
                <FooterToolbar
                    extra={<Button
                        onClick={() => history.push({
                            pathname: '/manager/cv-center/customer/list',
                            state: {
                                searchParams: state ? (state as LocationState)?.searchParams : '',
                            },
                        })}
                    >Back</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default BUPForm;