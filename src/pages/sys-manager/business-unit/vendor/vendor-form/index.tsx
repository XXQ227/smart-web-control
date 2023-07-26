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
    ProFormTreeSelect
} from '@ant-design/pro-components'
import {Button, Col, Form, Row, Tag} from 'antd'
import {getUserID} from '@/utils/auths'
import SearchModal from '@/components/SearchModal'
import {message} from 'antd/es'
import ls from 'lodash';
import {CloseOutlined} from '@ant-design/icons'
import {useModel, history} from 'umi'

type APICVInfo = APIManager.BUInfo;
const CVCenterForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const {location: {pathname}} = history;
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    const {current} = formRef;
    //region TODO: 数据层
    const {
        getGetCTPByID, BUInfo, CustomerTypeList, VendorTypeList, CustomerPropertyList, BusinessLineList,
        IndustryList,
    } = useModel('manager.business-unit', (res: any) => ({
        BUInfo: res.BUInfo,
        getGetCTPByID: res.getGetCTPByID,
        CustomerTypeList: res.CustomerTypeList,
        VendorTypeList: res.VendorTypeList,
        CustomerPropertyList: res.CustomerPropertyList,
        BusinessLineList: res.BusinessLineList,
        IndustryList: res.IndustryList,
    }));
    const [CVInfoVO, setCVInfoVO] = useState<APICVInfo>(BUInfo);
    const [ClientVO, setClientVO] = useState<API.APIKey$Value[]>(BUInfo.CTList);
    const [isChangeValue, setIsChangeValue] = useState<boolean>(false);

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
            setVendorTypeList(BUInfo.BUInfo.CTTypeItemListSupplier);
        }
    }, [BUInfo.CTList, ClientVO?.length])
    //
    // useMemo(()=> {
    //     if (CVInfoVO.NameFull && BUInfo.NameFull && CVInfoVO.NameFull !== BUInfo.NameFull) {
    //         setCVInfoVO(BUInfo);
    //     }
    // }, [BUInfo, CVInfoVO.NameFull])

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
    // const handleGetCTPByID = useMemo(async ()=> {
    //     const result: any = await getGetCTPByID({UserID: getUserID(), CTPID: Number(atob(params?.id))});
    //     setCVInfoVO(result);
    //  /   return result;
    // }, [getGetCTPByID, params?.id])


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
    const handleProFormValueChange = (changeValues: any) => {
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
    }

    //region TODO: 显示隐藏：{SCAC, IATA}
    //endregion
    // TODO: 返回列表集合
    const returnURL = pathname.substring(0, pathname.indexOf('/form')) + '/dict';

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
                initialValues={CVInfoVO}
                formKey={'business-unit-information'}
                // TODO: 空间有改数据时触动
                onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={async (values) => {
                    console.log(values);
                }}
                // TODO: 向后台请求数据
                request={async () => handleGetCTPByID()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={7}>
                            <ProFormText
                                required
                                name='NameFull'
                                placeholder=''
                                label='CV Name'
                                tooltip='length: 100'
                                rules={[{required: true, message: '这是必填项'}]}
                            />
                        </Col>
                        <Col span={7}>
                            <ProFormText
                                required
                                name='NameFullEN'
                                placeholder=''
                                tooltip='length: 100'
                                label='CV Name (For Print)'
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                required
                                name='NameShort'
                                placeholder=''
                                label='Short Name'
                                tooltip='length: 100'
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormText
                                required
                                name='TaxCode'
                                placeholder=''
                                label='CV Identity'
                                tooltip='length: 30'
                            />
                        </Col>
                    </Row>

                    {/** // TODO: MDM Number<主数据代码>、CV-Center Number<客商代码>、Oracle ID (Customer)、
                     // TODO: Oracle ID (Vendor)、Sinotrans Company ID<如果是中外运内部公司，则有一个5位数字的编码> */}
                    <Row gutter={24}>
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
                </ProCard>

                <ProCard title={'Contact'} className={'ant-card'}>
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
                        <Col span={1} className={'ant-business-unit-properties-clear'}>
                            <CloseOutlined
                                // TODO: 未保存的客户属性是可以被清空的
                                hidden={!!CVInfoVO.CustomerPropertyID}
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
                        <Col span={1} className={'ant-business-unit-properties-clear'}>
                            <CloseOutlined
                                // TODO: 为保存的客户类型是可以被清空的
                                hidden={!!CVInfoVO.CTTypeItemClient}
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
                    extra={<Button onClick={() => history.push({pathname: returnURL})}>Back</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default CVCenterForm;