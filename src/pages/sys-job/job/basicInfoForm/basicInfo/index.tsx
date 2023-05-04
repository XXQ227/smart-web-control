import React, {useEffect, useMemo, useState} from 'react';
import {ProCard, ProFormRadio, ProFormText, ProFormSelect} from '@ant-design/pro-components';
import {Col, Input, Row, Select, Radio} from 'antd';
import {getUserID} from '@/utils/auths';
import {colGrid, rowGrid, selectBillingMonth} from '@/utils/units';
import SearchInput from '@/components/SearchInput';
import SearchModal from '@/components/SearchModal';
import styles from '../style.less';


interface Props {
    FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    title: string,
    NBasicInfo: APIModel.NBasicInfo,
    Principal: APIModel.Principal,
    SalesManList: API.APIKey$Value[],
    FinanceDates: string[],
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        FormItem, form,
        title, NBasicInfo,
        NBasicInfo: {Principal}, SalesManList,
        FinanceDates,
    } = props;
    
    const [principalInfo, setPrincipal] = useState<APIModel.Principal | undefined>(Principal);

    useMemo(()=> {

    }, [])

    useEffect(() => {

    }, [])

    /**
     * @Description: TODO: change 事件
     * @author XXQ
     * @date 2023/4/17
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    const handleChange =(filedName: string, val: any, option?: any)=> {
        console.log(filedName, val, option);
        if (principalInfo) {
            principalInfo[filedName] = val;
            const fileLen: number = filedName.length;
            // TODO: 判断是不是 【ID】 字段，【ID】 字段需要存 【Name】 的值
            if (filedName.substring(fileLen-2, fileLen) === 'ID') {
                principalInfo[filedName.substring(0, fileLen-2) + 'Name'] = option?.label;
                form?.setFieldsValue({[filedName]: val});
            }
            setPrincipal(principalInfo);
        }
    }

    console.log(principalInfo);
    // const billingMonth = selectBillingMonth(FinanceDates)

    const portColumns = [
        { title: 'Port', dataIndex: 'Name', render: (_: any, record: any)=> record.data?.Name},
        { title: 'Code', align: 'center', width: 120, dataIndex: 'PortCode', render: (_: any, record: any)=> record.data?.PortCode},
        { title: 'City', align: 'center', width: 260, dataIndex: 'City', render: (_: any, record: any)=> record.data?.City},
        { title: 'Country', dataIndex: 'Country', width: 260, align: 'center', render: (_: any, record: any)=> record.data?.Country},
        { title: 'Type', dataIndex: 'TypeCN', width: 60, align: 'center', render: (_: any, record: any)=> record.data?.TypeCN}
    ];

    return (
        <ProCard
            title={title}
            bordered={true}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                <Col {...colGrid}>
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
                        name="FinanceDate"
                        label="Billing Month"
                        // valueEnum={billingMonth}
                        options={FinanceDates}
                        placeholder="Please select a country"
                    />
                    <ProFormText width="md" name="name" label="Purchase/Shipment Order (Customer)" />
                    <ProFormText width="md" name="name" label="Purchase/Shipment Order (Customer)" />
                </Col>
                <Col {...colGrid}>
                    <ProFormText width="md" name="name" label="Purchase/Shipment Order (Customer)" />
                    <ProFormText width="md" name="name" label="Purchase/Shipment Order (Customer)" />
                    <ProFormText width="md" name="name" label="Purchase/Shipment Order (Customer)" />
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        label={'客户'}
                        name={'PrincipalXID'}
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
                </Col>
                <Col {...colGrid}>
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
                </Col>
                <Col {...colGrid}>
                    <FormItem
                        name={'PONum'}
                        label={'PO REFERENCE'}
                        initialValue={principalInfo?.PONum}
                    >
                        <Input onBlur={(val)=> handleChange('PONum', val)}/>
                    </FormItem>
                </Col>
                <Col {...colGrid}>
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
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;