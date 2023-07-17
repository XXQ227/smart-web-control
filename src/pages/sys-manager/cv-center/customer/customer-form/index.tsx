import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormCheckbox, ProFormDatePicker,
    ProFormRadio,
    ProFormSelect,
    ProFormSwitch,
    ProFormGroup,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
    ProFormFieldSet
} from '@ant-design/pro-components'
import {Button, Col, Form, Row, Tag, Switch} from 'antd'
import {getUserID} from '@/utils/auths'
import SearchModal from '@/components/SearchModal'
import {message} from 'antd/es'
import ls from 'lodash';
import {CloseOutlined} from '@ant-design/icons'
import {useModel, history} from 'umi'
import SearchSelectInput from '@/components/SearchSelectInput'
import {getFormErrorMsg, rowGrid} from "@/utils/units";
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import SearchProFormSelect from "@/components/SearchProFormSelect";

export type LocationState = Record<string, unknown>;
type APIBUPInfo = APIManager.BUPInfo;

const BUPForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}, location: {state}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    // const {current} = formRef;
    //region TODO: 数据层
    const {
        getGetCTPByID, BUInfo, CustomerTypeList, VendorTypeList, CustomerPropertyList, BusinessLineList,
        IndustryList,
    } = useModel('manager.cv-center', (res: any) => ({
        BUInfo: res.BUInfo,
        getGetCTPByID: res.getGetCTPByID,
        CustomerTypeList: res.CustomerTypeList,
        VendorTypeList: res.VendorTypeList,
        CustomerPropertyList: res.CustomerPropertyList,
        BusinessLineList: res.BusinessLineList,
        IndustryList: res.IndustryList,
    }));
    const [CVInfoVO, setCVInfoVO] = useState<APIBUPInfo>(BUInfo);
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

    /*useMemo(()=> {
        if (CVInfoVO.NameFull && BUInfo.NameFull && CVInfoVO.NameFull !== BUInfo.NameFull) {
            setCVInfoVO(BUInfo);
        }
    }, [BUInfo, CVInfoVO.NameFull])*/

    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetCTPByID = async () => {
        const result: any = await getGetCTPByID({UserID: getUserID(), CTPID: Number(atob(params?.id))});
        setCVInfoVO(result);
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
    const onFinish = async (val: APIBUPInfo) => {
        /*setLoading(true);
        let result: API.Result;*/
        /*const param: any = {
            // contactName: val.contactName,
        };*/
        if (id === '0') {
            // TODO: 新增业务单位
            console.log(val)
            // result = await addBusinessUnit(val);
        } else {
            // TODO: 编辑公司
            // param.id = id;
            // result = await addBusinessUnit(val);
        }
        /*if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/cv-center/customer/form/${btoa(result.data)}`});
        } else {
            message.error(result.message)
        }
        setLoading(false);*/
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
                <ProCard
                    className={'ant-card'}
                    title={'Name'}
                    headerBordered
                    collapsible
                >
                    <Row gutter={rowGrid}>
                        <Col span={24}>
                            <ProFormText
                                readonly
                                placeholder=''
                                label='BU Name'
                                name='businessUnitId'
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
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name(EN)'
                                name='nameFullEn'
                                tooltip='length: 500'
                                rules={[{required: true, message: 'Name(EN)'}, {max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Short Name'
                                tooltip='length: 100'
                                name='nameShort'
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
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Contacts'
                                name='Contacts'
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
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                            <ProFormText
                                placeholder=''
                                label='Telephone Number'
                                name='phone'
                                tooltip='length: 20'
                                rules={[{max: 20, message: 'length: 20'}]}
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
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={16} xl={12} xxl={10}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name(For Print)'
                                name='namePrint'
                                tooltip='length: 500'
                                rules={[{max: 500, message: 'length: 500'}]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Contact'} className={'ant-card'}>
                    {/** // TODO: MDM Number<主数据代码>、CV-Center Number<客商代码>、Oracle ID (Customer)、
                     // TODO: Oracle ID (Vendor)、Sinotrans Company ID<如果是中外运内部公司，则有一个5位数字的编码> */}
                    <Row gutter={24}>
                        <Col span={5}>
                            <ProFormText
                                required
                                name='TaxCode'
                                placeholder=''
                                label='CV Identity'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                placeholder=''
                                name='CDHCode'
                                label='MDM Number'
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                placeholder=''
                                name='CustSupCode'
                                label='CV-Center Number'
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                placeholder=''
                                name='OracleID'
                                label='Oracle ID (Customer)'
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                placeholder=''
                                name='OracleIDSupplier'
                                label='Oracle ID (Vendor)'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                placeholder=''
                                name='InternalCompanyCode'
                                label='Sinotrans Company ID'
                            />
                        </Col>
                    </Row>

                    {/** // TODO: Contacts、Telephone Number、Email、Sales (From Sinotrans)、Located in (City)、
                     // TODO: Parent Company (Belongs to Group)、Address */}
                    <Row gutter={24}>
                        <Col span={16}>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <ProFormText
                                        name='Contacts'
                                        placeholder=''
                                        label='Contacts'
                                        tooltip='length: 100'
                                    />
                                </Col>
                                <Col span={8}>
                                    <ProFormText
                                        name='Phone'
                                        placeholder=''
                                        tooltip='length: 100'
                                        label='Telephone Number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <ProFormText
                                        name='Email'
                                        placeholder=''
                                        label='Email'
                                        tooltip='length: 100'
                                    />
                                </Col>
                                <Col span={8}>
                                    <ProFormText
                                        name='Sales'
                                        placeholder=''
                                        label='Sales (From Sinotrans)'
                                        tooltip='length: 30'
                                    />
                                </Col>
                                <Col span={8}>
                                    <ProFormText
                                        name='LocatedInCityID'
                                        placeholder=''
                                        label='Located in (City)'
                                        tooltip='length: 30'
                                    />
                                </Col>
                                <Col span={8}>
                                    {/** 上级集团公司，需要提前维护进去后选择。如果没有的话可以留空 */}
                                    <ProFormText
                                        name='GroupID'
                                        placeholder=''
                                        label='Parent Company (Belongs to Group)'
                                        tooltip='length: 30'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <ProFormTextArea
                                        name='Address'
                                        placeholder=''
                                        label='Address'
                                        fieldProps={{rows: 5}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard title={'Properties'} className={'ant-card ant-cv-center-properties'}>
                    {/* // TODO: Business Line */}
                    <Row gutter={24}>
                        <Col span={3} className={'ant-cv-center-properties-label'}>
                            <label>Business Line : </label>
                        </Col>
                        <Col span={20}>
                            <ProFormCheckbox.Group
                                name='BusinessLineList'
                                colProps={{span: 4,}}
                                options={BusinessLineList}
                            />
                        </Col>
                    </Row>
                    {/** // TODO: Nature of a Company */}
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
                                // hidden={!!CVInfoVO.CustomerPropertyID}
                                onClick={() => handleClearCustomer('CustomerPropertyID')}
                            />
                        </Col>
                    </Row>
                    {/** // TODO: Property (as Customer) */}
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
                                // hidden={!!CVInfoVO.CTTypeItemClient}
                                onClick={() => handleClearCustomer('CTTypeItemClient')}
                            />
                        </Col>
                    </Row>
                    {/** // TODO: Property (as Vendor) */}
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
                    {/** // TODO: Industry、、、、、、、 */}
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
                        {/* TODO: 是否是仅付款方 */}
                        <Col span={2}>
                            <ProFormSwitch
                                name='IsOnlySettlement'
                                label='Is Payer'
                            />
                        </Col>
                        {/* TODO: 是否是仅代收代付 */}
                        <Col span={3}>
                            <ProFormSwitch
                                name='IsReimbursement'
                                label='Is Reimbursement'
                            />
                        </Col>
                        {/* TODO: 满足是船公司时显示 */}
                        <Col span={3} hidden={!(customerTypeID === 14 || vendorTypeList?.includes(5))}>
                            <ProFormText
                                placeholder=''
                                name='SCAC'
                                label='SCAC'
                            />
                        </Col>
                        {/* TODO: 满足是航空公司时显示 */}
                        <Col span={3} hidden={!(vendorTypeList?.includes(6))}>
                            <ProFormText
                                placeholder=''
                                name='IATA'
                                label='IATA'
                            />
                        </Col>
                    </Row>
                    {/* // TODO: 客户备注 */}
                    <Row gutter={24}>
                        <Col span={24}>
                            <ProFormTextArea name='CVRemark' placeholder='' label='Remark'/>
                        </Col>
                    </Row>
                </ProCard>

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
                            pathname: '/manager/cv-center/company/list',
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