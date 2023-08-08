import React, {useRef, useState} from 'react';
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
import {Button, Col, Form, Row, Divider} from 'antd'
import {message} from 'antd/es'
import ls from 'lodash';
import {useModel, history} from 'umi'
import {getFormErrorMsg, IconFont, rowGrid, getLabelByValue} from "@/utils/units";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import {NATURE_OF_COMPANY, PROPERTY_AS_CUSTOMER} from "@/utils/common-data";
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";

export type LocationState = Record<string, unknown>;
type APIBUP = APIManager.BUP;

const BusinessUnitPropertyForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}, location: {state}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    // const {current} = formRef;

    //region TODO: 数据层
    const {
        queryBusinessUnitPropertyInfo, addBusinessUnitProperty, editBusinessUnitProperty,
        operateBusinessUnitProperty, queryCustomerPayer,
    } = useModel('manager.business-unit', (res: any) => ({
        queryBusinessUnitPropertyInfo: res.queryBusinessUnitPropertyInfo,
        addBusinessUnitProperty: res.addBusinessUnitProperty,
        editBusinessUnitProperty: res.editBusinessUnitProperty,
        operateBusinessUnitProperty: res.operateBusinessUnitProperty,
        queryCustomerPayer: res.queryCustomerPayer,
    }));

    const {
        queryDictCommon, BusinessLineList, VendorTypeList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        BusinessLineList: res.BusinessLineList,
        VendorTypeList: res.VendorTypeList,
    }))

    const [BUPInfoVO, setBUPInfoVO] = useState<any>({});

    const [BUAndBUPCommonInfoVO, setBUAndBUPCommonInfoVO] = useState<APIBUP>((state as LocationState)?.BUParams as APIBUP || {});
    const [PayerListVO , setPayerListVO] = useState<APIBUP[]>([]);
    // const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [customerTypeRequired, setCustomerTypeRequired] = useState(true);
    const [payerFlagDisabled, setPayerFlagDisabled] = useState(true);    // Payer 仅限 Customer，在供应商层面暂不考虑
    const [salesNameValue, setSalesNameValue] = useState<string>('');

    // TODO: 客户类型
    // const [customerTypeID, setCustomerTypeID] = useState<number | null>(BUInfo.CTTypeItemClient);
    // TODO: 供应商类型
    // const [vendorTypeList, setVendorTypeList] = useState<number[] | null>(BUInfo.CTTypeItemListSupplier);
    //endregion

    /*useEffect(() => {
        if (BUInfo.CTList?.length !== PayerListVO?.length) {
            setPayerListVO(BUInfo.CTList);
        }
        if (!!BUInfo.CTTypeItemClient && !customerTypeID) {
            setCustomerTypeID(BUInfo.CTTypeItemClient);
        }
        if (BUInfo.CTTypeItemListSupplier?.length > 0 && vendorTypeList?.length === 0) {
            setVendorTypeList(BUInfo.CVInfo.CTTypeItemListSupplier);
        }
    }, [BUInfo.CTList, PayerListVO?.length])*/

    /*useMemo(()=> {
        if (BUPInfoVO.NameFull && BUInfo.NameFull && BUPInfoVO.NameFull !== BUInfo.NameFull) {
            setBUPInfoVO(BUInfo);
        }
    }, [BUInfo, BUPInfoVO.NameFull])*/

    /**
     * @Description: TODO: 获取 BUP 详情
     * @author LLS
     * @date 2023/7/26
     * @returns
     */
    const handleGetBUPInfo = async () => {
        setLoading(true);
        if (BusinessLineList?.length === 0) {
            await queryDictCommon({dictCodes: ['business_line']});
        }
        if (VendorTypeList?.length === 0) {
            await queryDictCommon({dictCodes: ['vendor_type']});
        }
        const result: any = await queryBusinessUnitPropertyInfo({id});
        const payersResult: any = await queryCustomerPayer({id});
        if (result.success && payersResult.success) {
            // TODO: Nature of a Company 根据后台传回来的natureOfCompany参数，找到对应的label名称
            const natureOfCompanyLabel: APIBUP = getLabelByValue(NATURE_OF_COMPANY, BUAndBUPCommonInfoVO.natureOfCompany || result.data?.natureOfCompany);
            const newInfoVO: APIBUP = {...BUAndBUPCommonInfoVO, ...natureOfCompanyLabel};
            setBUAndBUPCommonInfoVO(newInfoVO);
            let newData = result.data || newInfoVO;
            if (id !== '0') {
                newData = {...newData, ...natureOfCompanyLabel}
                setPayerFlagDisabled(!newData?.customerType);
                setCustomerTypeRequired(newData?.vendorTypeList?.length === 0);
                setSalesNameValue(newData?.salesName);
                // TODO: 业务线和供应商类型数据转化
                newData.businessLine = newData?.businessLine.split(",").map((item: string) => item.trim());
                newData.vendorTypeList = newData?.vendorTypeList?.split(",").map((item: string) => item.trim());
            }
            setBUPInfoVO(newData);
            setPayerListVO(payersResult.data);
        } else {
            message.error(!result.success ? result.message : payersResult.message);
        }
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 清空为保存的客户属性
     * @author LLS
     * @date 2023/7/26
     * @returns
     */
    const handleClearCustomer = () => {
        form?.setFieldsValue({['customerType']: null});
        setPayerFlagDisabled(true)
        form?.setFieldsValue({['payerFlag']: false});
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

    const onChange = (checkedValues: CheckboxValueType[]) => {
        setCustomerTypeRequired(checkedValues.length === 0)
    };

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/7/25
     * @param val
     * @returns
     */
    const onFinish = async (val: APIBUP) => {
        setLoading(true);
        let result: API.Result;
        delete val.buName;
        delete val?.industryName;
        delete val?.taxNum;
        delete val?.enterpriseType;
        delete val?.natureOfCompany;
        delete val?.internalCompanyCode;
        val.businessLine = val.businessLine?.toString();
        val.vendorTypeList = val.vendorTypeList?.toString();
        val.vendorFlag = val.vendorTypeList ? 1 : 0;
        val.customerFlag = val.customerType ? 1 : 0;
        val.customerType = val.customerType ? val.customerType : '';
        val.payerFlag = val.payerFlag ? 1 : 0;
        val.reimbursementFlag = val.reimbursementFlag ? 1 : 0;
        val.salesId = val.salesId ? val.salesId : '';
        val.salesName = salesNameValue;
        if (id === '0') {
            // TODO: 新增业务单位属性
            val.businessUnitId = BUAndBUPCommonInfoVO?.buId;
            val.branchId = "1665596906844135426";
            result = await addBusinessUnitProperty(val);
        } else {
            // TODO: 编辑业务单位属性
            val.id = id;
            result = await editBusinessUnitProperty(val);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/business-unit/property/form/${btoa(result.data)}`});
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
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    // 计算选项内容中最长的文本长度
    /*const maxLabelWidth = Math.max(...VendorTypeList.map((option: any) => option.label.length));
    console.log(maxLabelWidth)
    // 设置所有选项的宽度为最长文本长度
    const optionsWithWidth = VendorTypeList.map((option: any) => ({
        ...option,
        // style: { width: `${maxLabelWidth}ch` },
        style: { width: '20ch' },
    }));*/

    /**
     * @Description: TODO: 启用或禁用业务单位属性
     * @author LLS
     * @date 2023/7/26
     * @returns
     */
    const handleOperateBUP = async () => {
        setLoading(true);
        const newData: APIBUP = ls.cloneDeep(BUPInfoVO);
        // TODO: 冻结取反上传数据
        const param: any = {
            id: newData.id,
            operate: newData.enableFlag ? 0 : 1
        };
        const result: API.Result = await operateBusinessUnitProperty(param);
        if (result.success) {
            message.success(param.operate ? 'Freeze Success' : 'Unfreeze Success');
            setBUPInfoVO({...newData, enableFlag: param.operate});
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 返回
     * @author LLS
     * @date 2023/7/26
     * @returns
     */
    const handleBack = () => {
        const url = (state as LocationState)?.payer ? '/manager/business-unit/payer' : '/manager/business-unit/property';
        history.push({
            pathname: url,
            state: {
                searchParams: state ? (state as LocationState)?.searchParams : '',
            },
        })
    }

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                disabled={!!BUPInfoVO?.enableFlag}
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={BUPInfoVO}
                formKey={'business-unit-information'}
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
                                name='buName'
                            />
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
                                initialValue={BUAndBUPCommonInfoVO?.buName}
                                rules={[{required: true, message: 'Name(EN)'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                name='nameShort'
                                tooltip='length: 100'
                                initialValue={BUAndBUPCommonInfoVO?.buName}
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
                                initialValue={BUAndBUPCommonInfoVO?.buName}
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
                                initialValue={BUAndBUPCommonInfoVO?.buName}
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
                                handleChangeData={(val: any, option: any) =>  {
                                    setSalesNameValue(option?.label)
                                }}
                                handleClearData={() => setSalesNameValue('')}
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
                            <ProFormText
                                disabled={true}
                                placeholder=''
                                label='Located in (City)'
                                name='cityName'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                placeholder=''
                                label='Email'
                                name='Email'
                                tooltip='length: 30'
                                rules={[{max: 30, message: 'length: 30'}]}
                            />
                            <ProFormText
                                disabled={true}
                                placeholder=''
                                label='Parent Company (Belongs to Group)'
                                name='parentCompanyName'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={18} xxl={8}>
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
                                disabled={true}
                                placeholder=''
                                label='BU Identity'
                                name='taxNum'
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                disabled={true}
                                placeholder=''
                                label='MDM Number'
                                name='mdmCode'
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
                        {/* TODO: 内部公司组织代码 */}
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                disabled={true}
                                placeholder=''
                                label='Sinotrans Company ID'
                                name='internalCompanyCode'
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
                        <Col xs={24} sm={24} md={6} lg={5} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label className={'ant-form-label-required'}>Business Line : </label>
                        </Col>
                        <Col xs={12} sm={9} md={18} lg={19} xl={20} xxl={20}>
                            <ProFormCheckbox.Group
                                required
                                name='businessLine'
                                options={BusinessLineList}
                                rules={[{required: true, message: 'Business Line'}]}
                            />
                        </Col>
                        <Col xs={24} sm={23} md={24} lg={24} xl={24} xxl={19}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={6} lg={5} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label>Nature of a Company : </label>
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={19} xl={12} xxl={10}>
                            <Row>
                                <Col xs={10} sm={9} md={9} lg={8} xl={9} xxl={8}>
                                    <ProFormSelect
                                        disabled={true}
                                        name="enterpriseType"
                                        placeholder=''
                                    />
                                </Col>
                                <Col>
                                    <span className={'ant-space-span'}/>
                                </Col>
                                <Col xs={10} sm={9} md={9} lg={8} xl={9} xxl={8}>
                                    <ProFormSelect
                                        disabled={true}
                                        name="natureOfCompany"
                                        placeholder=''
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={23} md={24} lg={24} xl={24} xxl={19}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={6} lg={5} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label>Property (as Customer) : </label>
                        </Col>
                        <Col xs={14} sm={10} md={15} lg={16} xl={18} xxl={13}>
                            <ProFormRadio.Group
                                name="customerType"
                                options={PROPERTY_AS_CUSTOMER}
                                rules={[{required: customerTypeRequired, message: 'Property (as Customer)、Property (as Vendor) Must Choose One'}]}
                                fieldProps={{ onChange: () => setPayerFlagDisabled(false) }}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1} xxl={1}>
                            {/* 已创建客户不允许清空 */}
                            <Button
                                hidden={id !== '0'}
                                icon={<IconFont type={'icon-clear'} />}
                                className={'ant-clear-button'}
                                onClick={handleClearCustomer}
                            >
                                Clear
                            </Button>
                        </Col>
                        <Col xs={24} sm={23} md={24} lg={24} xl={24} xxl={19}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={6} lg={5} xl={4} xxl={3} className={'ant-cv-center-properties-label'}>
                            <label>Property (as Vendor) : </label>
                        </Col>
                        <Col xs={12} sm={7} md={18} lg={19} xl={20} xxl={17} className={'custom-checkbox-group'}>
                            <ProFormCheckbox.Group
                                name='vendorTypeList'
                                options={VendorTypeList}
                                fieldProps={{
                                    onChange: onChange
                                }}
                                // options={optionsWithWidth}
                            />
                            {/*<ProFormCheckbox.Group
                                name='vendorTypeList'
                            >
                                <Row>
                                    {
                                        VendorTypeList && VendorTypeList.length > 0 ? VendorTypeList.map((option: any) => {
                                            // return <Col span={4}><Checkbox key={x.value} value={x.value}>{x.label}</Checkbox></Col>
                                            return <Col span={4} key={option.value}><ProFormCheckbox name={option.value} fieldProps={{ value: option.value }}>{option.label}</ProFormCheckbox></Col>
                                        }) : null
                                    }
                                </Row>
                            </ProFormCheckbox.Group>*/}
                        </Col>
                        <Col xs={24} sm={23} md={24} lg={24} xl={24} xxl={19}>
                            <Divider style={{marginTop: '-6px'}}/>
                        </Col>
                    </Row>
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={22} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormSelect
                                disabled={true}
                                placeholder=''
                                label="Industry"
                                name={'industryName'}
                            />
                            {/* TODO: Payer 仅限 Customer，在供应商层面暂不考虑 */}
                            <Row>
                                <Col span={6}>
                                    <ProFormSwitch
                                        disabled={payerFlagDisabled}
                                        name="payerFlag"
                                    />
                                </Col>
                                <Col span={12} style={{marginTop: '5px'}}>
                                    <label>Is Payer</label>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={22} md={12} lg={8} xl={6} xxl={5}>
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
                        <Col xs={24} sm={22} md={24} lg={16} xl={11} xxl={9}>
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

                {/* TODO: 相关付款客户 */}
                {
                    id !== '0' && !BUPInfoVO?.payerFlag && !payerFlagDisabled ?
                        <ProCard
                            className={'ant-card ant-card-payers'}
                            title={'Payers'}
                            headerBordered
                            collapsible
                        >
                            {
                                PayerListVO.length === 0 ? null :
                                    <Row gutter={rowGrid}>
                                        <Col xs={23} sm={22} md={23} lg={16} xl={21} xxl={15}>
                                            {PayerListVO?.map((item: any) =>
                                                <u key={item.id}>{item.nameFullEn}</u>
                                            )}
                                        </Col>
                                    </Row>
                            }
                        </ProCard> : null
                }

                <FooterToolbar extra={<Button disabled={false} onClick={handleBack} icon={<ArrowLeftOutlined/>}>Back</Button>}>
                    <Button
                        disabled={false}
                        hidden={id === '0'}
                        onClick={handleOperateBUP}
                        icon={<IconFont type={!!BUPInfoVO?.enableFlag ? 'icon-unfreeze' : 'icon-freeze'}/>}
                        className={!!BUPInfoVO?.enableFlag ? 'ant-unfreeze-button' : 'ant-freeze-button'}
                        style={{marginRight: 15}}
                    >
                        {!!BUPInfoVO?.enableFlag ? 'Unfreeze' : 'Freeze'}
                    </Button>
                    <Button
                        key={'submit'}
                        type={'primary'}
                        htmlType={'submit'}
                        icon={<SaveOutlined/>}
                    >
                        Save
                    </Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default BusinessUnitPropertyForm;