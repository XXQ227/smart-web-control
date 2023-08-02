import React from 'react';
import {ProCard, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormSwitch} from '@ant-design/pro-components';
import {Col, Row, Divider} from 'antd';
import {getUserID} from '@/utils/auths';
import {rowGrid} from '@/utils/units';
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from 'umi'

interface Props {
    title: string;
    basicInfo: any;
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {title} = props;

    const {SalesList} = useModel('manager.user', (res: any) => ({SalesList: res.SalesList}));

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/7/26
     * @param val       修改的值
     * @param filedName 操作的数据字段
     * @param option    其他数据
     * @returns
     */
    const handleChange = (val: any, filedName: string, option?: any) => {
        console.log(val, filedName, option)
    }

    return (
        <ProCard title={title} bordered={true} headerBordered collapsible className={'ant-card'}>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={4}>
                    <ProFormRadio.Group
                        label="Business Type"
                        name={['basicInfo', 'businessType']}
                        options={[
                            {label: 'Free Hand', value: 1,},
                            {label: 'R/O Shipment', value: 2,},
                        ]}
                    />
                    <ProFormSelect
                        width="md"
                        placeholder=''
                        label='Job Month'
                        options={[]}
                        name={['basicInfo', 'FinanceDate']}
                    />
                    <ProFormDatePicker
                        width="md"
                        placeholder=''
                        label="Order Taking Date"
                        name={['basicInfo', 'orderTakingDate']}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={4}>
                    <ProFormSelect
                        width="md"
                        label='Sales'
                        placeholder=''
                        options={SalesList || []}
                        name={['basicInfo', 'salesId']}
                        // initialValue={principalInfo?.SalesManID}
                        // rules={[{required: true, message: 'Please Select Sales!'}]}
                        // onSelect={(val: any, option: any)=> handleChange('SalesManID', val, option)}
                    />
                    <ProFormText
                        width="md"
                        placeholder=''
                        name={['basicInfo', 'clientInvoNum']}
                        label='Purchase/Shipment Order (Customer)'
                        // initialValue={principalInfo?.ClientInvoNum}
                    />
                    <ProFormDatePicker
                        width="md"
                        placeholder=''
                        label="Completion Date"
                        name={['basicInfo', 'completionDate']}
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={15} lg={13} xl={9} xxl={5}>
                    {/* 客户 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"}
                        isShowLabel={true}
                        // required={true}
                        label="Customer"
                        id={'CustomerID'}
                        name={['basicInfo', 'CustomerId']}
                        valueObj={{value: '', label: ''}}
                        url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                        query={{IsJobCustomer: true, BusinessLineID: null, UserID: getUserID(), CTType: 1, SystemID: 4}}
                        handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                    {/* 付款方 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"}
                        isShowLabel={true}
                        // required={true}
                        label='Cargo Owner'
                        id={'PayerID'}
                        name={['basicInfo', 'PayerId']}
                        valueObj={{value: '', label: ''}}
                        url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                        query={{searchPayer: true, BusinessLineID: null, UserID: getUserID(), CTType: 1, SystemID: 4}}
                        handleChangeData={(val: any, option: any) => handleChange('PayerID', val, option)}
                    />
                    {/* 货主/业务指定人 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"}
                        isShowLabel={true}
                        // required={true}
                        id='CargoOwnerID'
                        label='Paying Agent'
                        valueObj={{value: '', label: ''}}
                        name={['basicInfo', 'CargoOwnerId']}
                        query={{UserID: getUserID(), SystemID: 4}}
                        url={'/apiLocal/MCommon/GetCTNameByStrOrType'}
                        handleChangeData={(val: any, option: any) => handleChange('CargoOwnerID', val, option)}
                    />
                </Col>
                <Col xs={0} sm={0} md={2} lg={2} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={7} lg={9} xl={7} xxl={4}>
                    <ProFormSelect
                        width="md"
                        placeholder=''
                        name={['basicInfo', 'project']}
                        label="Project"
                        options={[
                            {label: 'Project', value: 1},
                            {label: 'Project2', value: 2},
                            {label: 'Project3', value: 3},
                        ]}
                    />
                    <ProFormSwitch
                        name={['basicInfo', 'IsSettleJob']}
                        label="Non-operation Revenue"
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;