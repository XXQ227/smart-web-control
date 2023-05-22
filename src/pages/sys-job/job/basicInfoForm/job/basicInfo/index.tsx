import React, {useEffect, useMemo, useState} from 'react';
import {ProCard, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormSwitch} from '@ant-design/pro-components';
import {Col, Row, Divider} from 'antd';
import {getBranchID, getUserID} from '@/utils/auths';
import {rowGrid} from '@/utils/units';
import {stringify} from "qs";
import styles from "@/pages/sys-job/job/basicInfoForm/style.less";


interface Props {
    FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    title: string,
    NBasicInfo: APIModel.NBasicInfo,
    Principal: APIModel.Principal,
    SalesManList: API.APIValue$Label[],
    FinanceDates: string[],
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        form,
        title,
        NBasicInfo: {Principal}, SalesManList,
        FinanceDates,
    } = props;

    // const isCreate = Number(NBasicInfo.ID) > 0;
    
    const [principalInfo, setPrincipal] = useState<APIModel.Principal | undefined>(Principal);

    useMemo(()=> {

    }, [])

    useEffect(() => {

    }, [])

    // const billingMonth = selectBillingMonth(FinanceDates)

    const fetchOptions = async (value: any) => {
        if (value.keyWords) {
            const params = Object.assign({}, value, {value: value.keyWords});
            delete params.keyWords;
            const options: any = { headers: { Lang: 'en_EN', BranchID: getBranchID(), UserID: getUserID()} };
            return fetch(`/api/MCommon/GetCTNameByStrOrType?${stringify(params)}`, options)
                .then(response => response.json())
                .then((result) => {
                    // TODO: 返回结果
                    return result.map((item: any) => ({
                        value: item.Key,
                        label: item.Value,
                        data: item
                    }));
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    return (
        <ProCard
            title={title}
            bordered={true}
            className={styles.proFormBasicInfo}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={4}>
                    <ProFormRadio.Group
                        name="BizType3ID"
                        label="Business Type"
                        options={[
                            {
                                label: 'Free Hand',
                                value: 1,
                            },
                            {
                                label: 'R/O Shipment',
                                value: 2,
                            },
                        ]}
                    />
                    <ProFormSelect
                        width="md"
                        name="FinanceDate"
                        label="Billing Month"
                        // valueEnum={billingMonth}
                        options={FinanceDates}
                        placeholder="Please select a country"
                    />
                    <ProFormDatePicker width="md" name="LockDate" label="Order Taking Date" />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={4}>
                    <ProFormText
                        width="md"
                        name="ClientInvoNum"
                        initialValue={principalInfo?.ClientInvoNum}
                        label="Purchase/Shipment Order (Customer)"
                    />
                    <ProFormSelect
                        width="md"
                        name="SalesManID"
                        initialValue={principalInfo?.SalesManID}
                        label="Sales"
                        options={SalesManList}
                        rules={[{required: true, message: 'Please Select Sales!'}]}
                        // onSelect={(val: any, option: any)=> handleChange('SalesManID', val, option)}
                    />
                    <ProFormDatePicker width="md" name="LockDate" label="Completion Date" />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                {/*<Col {...colGrid}>
                    <FormItem
                        label={'销售员'}
                        name={'SalesManID'}
                        initialValue={principalInfo?.SalesManID}
                        rules={[{required: true, message: '请选择销售!'}]}
                    >
                        <Select
                            // labelInValue
                            options={SalesManList}
                            onSelect={(val, option)=> handleChange('SalesManID', val, option)}
                        />
                    </FormItem>
                    <FormItem
                        label={'客户'}
                        name={'CustomerID'}
                        initialValue={{value: principalInfo?.PrincipalXID, label: principalInfo?.PrincipalXName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'Customer'}
                            value={{value: principalInfo?.PrincipalXID, label: principalInfo?.PrincipalXName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{
                                IsJobCustomer: true, BusinessLineID: null,
                                UserID: getUserID(), CTType: 1, SystemID: 4,
                            }}
                            handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                        />
                    </FormItem>
                    <FormItem
                        label={'付款方'}
                        name={'PayerID'}
                        initialValue={{value: principalInfo?.PayerID, label: principalInfo?.PayerName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'PayerID'}
                            value={{value: principalInfo?.PayerID, label: principalInfo?.PayerName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{
                                searchPayer: true, BusinessLineID: null,
                                UserID: getUserID(), CTType: 1, SystemID: 4,
                            }}
                            handleChangeData={(val: any, option: any) => handleChange('PayerID', val, option)}
                        />
                    </FormItem>
                    <FormItem
                        label={'货主'}
                        name={'CargoOwnerID'}
                        initialValue={{value: principalInfo?.CargoOwnerID, label: principalInfo?.CargoOwnerName}}
                    >
                        <SearchInput
                            qty={5}
                            id={'CargoOwnerID'}
                            value={{value: principalInfo?.CargoOwnerID, label: principalInfo?.CargoOwnerName}}
                            url={'/api/MCommon/GetCTNameByStrOrType'}
                            query={{UserID: getUserID(), CTType: 1, SystemID: 4,}}
                            handleChangeData={(val: any, option: any) => handleChange('CargoOwnerID', val, option)}
                        />
                    </FormItem>
                </Col>*/}
                <Col xs={24} sm={24} md={15} lg={15} xl={9} xxl={5}>
                    {/* 客户 */}
                    <ProFormSelect
                        width="lg"
                        name="CustomerID"
                        // suffix={<IconFont key={1} type={'icon-create'} className="iconfont icon-your-icon-name" />}
                        // suffixIcon={<IconFont key={1} type={'icon-create'} className="iconfont icon-your-icon-name" />}
                        // suffixIcon={<IconFont key={1} type={'icon-create'} className="iconfont icon-your-icon-name" />}
                        className={styles.mySelect}
                        initialValue={{value: principalInfo?.PrincipalXID, label: principalInfo?.PrincipalXName}}
                        label="Customer"
                        // showSearch
                        debounceTime={400}
                        request={(value) => fetchOptions(value)}
                        /*request={async (value: any) => {
                            if (value.keyWords) {
                                const response = await fetch(`/api/MCommon/GetCTNameByStrOrType?IsJobCustomer=true&BusinessLineID=null&UserID=${getUserID()}&CTType=1&SystemID=4&value=${value.keyWords}`);
                                const data = await response.json();
                                return data.map((item: any) => ({
                                    value: item.Key,
                                    label: item.Value,
                                    data: item,
                                }));
                            }
                        }}*/
                        params={{
                            IsJobCustomer: true, BusinessLineID: null,
                            UserID: getUserID(), CTType: 1, SystemID: 4,
                        }}
                        placeholder="Please enter keyword search"
                        rules={[{ required: true, message: 'Please Input Customer!' }]}
                    />
                    {/* 付款方 */}
                    <ProFormSelect
                        width="lg"
                        name="PayerID"
                        initialValue={{value: principalInfo?.PayerID, label: principalInfo?.PayerName}}
                        label="Cargo Owner"
                        showSearch
                        debounceTime={400}
                        request={(value) => fetchOptions(value)}
                        params={{
                            searchPayer: true, BusinessLineID: null,
                            UserID: getUserID(), CTType: 1, SystemID: 4,
                        }}
                        placeholder="Please enter keyword search"
                    />
                    {/* 货主/业务指定人 */}
                    <ProFormSelect
                        width="lg"
                        name="CargoOwnerID"
                        initialValue={{value: principalInfo?.CargoOwnerID, label: principalInfo?.CargoOwnerName}}
                        label="Paying Agent"
                        showSearch
                        debounceTime={400}
                        request={(value) => fetchOptions(value)}
                        params={{UserID: getUserID(), SystemID: 4}}
                        placeholder="Please enter keyword search"
                    />
                </Col>
                {/*<Col xs={0} sm={0} md={3} lg={8} xl={6} xxl={4}>
                    <Divider type="vertical" style={{ height: 250, margin: '0 10px' }} />
                </Col>*/}
                <Col xs={0} sm={0} md={2} lg={2} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={3}>
                    <ProFormSwitch name="IsSettleJob" label="Non-operation Revenue" />
                </Col>
                {/*<Col {...colGrid}>
                    <FormItem
                        name={'PONum'}
                        label={'PO REFERENCE'}
                        initialValue={principalInfo?.PONum}
                    >
                        <Input onBlur={(val)=> handleChange('PONum', val)}/>
                    </FormItem>
                    <FormItem
                        label={'POL'}
                        name={'POLID'}
                        initialValue={principalInfo?.POLID}
                        // rules={[{required: true, message: '请输入POL!'}]}
                    >
                        <SearchModal
                            qty={15}
                            id={'POLID'}
                            title={'POL'}
                            modalWidth={800}
                            showHeader={true}
                            filedValue={'ID'}
                            filedLabel={'Name'}
                            columns={portColumns}
                            value={principalInfo?.POLID}
                            text={principalInfo?.POLName}
                            url={"/api/MCommon/GetPortCityOrCountry"}
                            handleChangeData={(val: any, option: any) => handleChange('POLID', val, option)}
                        />
                    </FormItem>
                </Col>*/}
            </Row>
        </ProCard>
    )
}
export default BasicInfo;