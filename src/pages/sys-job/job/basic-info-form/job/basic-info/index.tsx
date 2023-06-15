import React, {useEffect, useMemo, useState} from 'react';
import {ProCard, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormSwitch} from '@ant-design/pro-components';
import {Col, Row, Divider} from 'antd';
import {getBranchID, getUserID} from '@/utils/auths';
import {rowGrid} from '@/utils/units';
import {stringify} from "qs";
import SearchProFormSelect from '@/components/SearchProFormSelect'
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
        title,
        NBasicInfo: {Principal}, SalesManList,
        FinanceDates,
    } = props;

    const [principalInfo, setPrincipalInfo] = useState<APIModel.Principal | undefined>(Principal);
    // const billingMonth = selectBillingMonth(FinanceDates)

    return (
        <ProCard
            title={title}
            bordered={true}
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
                        label="Job Month"
                        // valueEnum={billingMonth}
                        options={FinanceDates}
                        placeholder=''
                    />
                    <ProFormDatePicker
                        width="md"
                        placeholder=''
                        name="LockDate"
                        label="Order Taking Date"
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={4}>
                    <ProFormSelect
                        width="md"
                        placeholder=''
                        name="SalesManID"
                        initialValue={principalInfo?.SalesManID}
                        label="Sales"
                        options={SalesManList}
                        rules={[{required: true, message: 'Please Select Sales!'}]}
                        // onSelect={(val: any, option: any)=> handleChange('SalesManID', val, option)}
                    />
                    <ProFormText
                        width="md"
                        placeholder=''
                        name="ClientInvoNum"
                        initialValue={principalInfo?.ClientInvoNum}
                        label="Purchase/Shipment Order (Customer)"
                    />
                    <ProFormDatePicker
                        width="md"
                        placeholder=''
                        name="LockDate"
                        label="Completion Date"
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={15} lg={13} xl={9} xxl={5}>
                    {/* 客户 */}
                    <SearchProFormSelect
                        isShowLabel={true}
                        width={"lg"}
                        qty={5}
                        required={true}
                        label="Customer"
                        id={'CustomerID'}
                        name={'CustomerID'}
                        url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                        valueObj={{value: principalInfo?.PrincipalXID, label: principalInfo?.PrincipalXName}}
                        query={{IsJobCustomer: true, BusinessLineID: null, UserID: getUserID(), CTType: 1, SystemID: 4}}
                        // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                    {/* 付款方 */}
                    <SearchProFormSelect
                        isShowLabel={true}
                        width={"lg"}
                        qty={5}
                        required={true}
                        label="Cargo Owner"
                        id={'PayerID'}
                        name={'PayerID'}
                        url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                        valueObj={{value: principalInfo?.PayerID, label: principalInfo?.PayerName}}
                        query={{searchPayer: true, BusinessLineID: null, UserID: getUserID(), CTType: 1, SystemID: 4}}
                        // handleChangeData={(val: any, option: any) => handleChange('PayerID', val, option)}
                    />
                    {/* 货主/业务指定人 */}
                    <SearchProFormSelect
                        isShowLabel={true}
                        width={"lg"}
                        qty={5}
                        required={true}
                        label="Paying Agent"
                        id={'CargoOwnerID'}
                        name={'CargoOwnerID'}
                        url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                        valueObj={{value: principalInfo?.CargoOwnerID, label: principalInfo?.CargoOwnerName}}
                        query={{UserID: getUserID(), SystemID: 4}}
                        // handleChangeData={(val: any, option: any) => handleChange('CargoOwnerID', val, option)}
                    />
                </Col>
                <Col xs={0} sm={0} md={2} lg={2} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={7} lg={9} xl={7} xxl={4}>
                    <ProFormSelect
                        width="md"
                        placeholder=''
                        name="project"
                        label="Project"
                        initialValue={{label: 'Project', value: 1}}
                        options={[
                            {label: 'Project', value: 1},
                            {label: 'Project2', value: 2},
                            {label: 'Project3', value: 3},
                        ]}
                    />
                    <ProFormSwitch
                        name="IsSettleJob"
                        label="Non-operation Revenue"
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;