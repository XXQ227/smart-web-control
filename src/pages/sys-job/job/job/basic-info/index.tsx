import React from 'react';
import {ProCard, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormSwitch} from '@ant-design/pro-components';
import {Col, Row, Divider} from 'antd';
import {rowGrid} from '@/utils/units';
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from 'umi'

interface Props {
    title: string;
    CJobInfo: any;
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {title, CJobInfo} = props;

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
                        name={'businessType'}
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
                        name={'FinanceDate'}
                    />
                    <ProFormDatePicker
                        width="md"
                        placeholder=''
                        label="Order Taking Date"
                        name={'orderTakingDate'}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={7} xxl={4}>
                    <ProFormSelect
                        width="md"
                        label='Sales'
                        placeholder=''
                        name={'salesId'}
                        options={SalesList || []}
                        // initialValue={basicInfo?.salesId}
                        // rules={[{required: true, message: 'Please Select Sales!'}]}
                        // onSelect={(val: any, option: any)=> handleChange('SalesManID', val, option)}
                    />
                    <ProFormText
                        width="md"
                        placeholder=''
                        name={'clientInvoNum'}
                        label='Purchase/Shipment Order (Customer)'
                        // initialValue={principalInfo?.ClientInvoNum}
                    />
                    <ProFormDatePicker
                        width="md"
                        placeholder=''
                        label="Completion Date"
                        name={'completionDate'}
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
                        id={'customerId'}
                        name={'customerId'}
                        valueObj={{value: '', label: ''}}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        query={{branchId: '1665596906844135426', buType: 1, payerFlag: 0}}
                        handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                    {/* 付款方 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"}
                        isShowLabel={true}
                        // required={true}
                        label='Cargo Owner'
                        id={'cargoOwnerId'}
                        name={'cargoOwnerId'}
                        // valueObj={{value: '', label: ''}}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426'}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange('cargoOwnerId', val, option)}
                    />
                    {/* 货主/业务指定人 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"}
                        isShowLabel={true}
                        // required={true}
                        id='payerId'
                        label='Paying Agent'
                        valueObj={{value: '', label: ''}}
                        name={'payerId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1, payerFlag: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange('payerId', val, option)}
                    />
                </Col>
                <Col xs={0} sm={0} md={2} lg={2} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={7} lg={9} xl={7} xxl={4}>
                    <ProFormSelect
                        width="md"
                        placeholder=''
                        name={'project'}
                        label="Project"
                        options={[
                            {label: 'Project', value: 1},
                            {label: 'Project2', value: 2},
                            {label: 'Project3', value: 3},
                        ]}
                    />
                    <ProFormSwitch
                        name={'IsSettleJob'}
                        label="Non-operation Revenue"
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;