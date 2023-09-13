import React from 'react';
import {ProCard, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormSwitch} from '@ant-design/pro-components';
import {Col, Row, Divider} from 'antd';
import {rowGrid} from '@/utils/units';
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from 'umi'

interface Props {
    title: string;
    CJobInfo: any;
    form: any;
}

const BasicInfo: React.FC<Props> = (props) => {
    const  {title, form, CJobInfo} = props;

    const {SalesList} = useModel('manager.user', (res: any) => ({SalesList: res.SalesList}));

    const {
        AccountPeriodList
    } = useModel('common', (res: any)=> ({
        AccountPeriodList: res.AccountPeriodList,
    }))

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/7/26
     * @param filedName 操作的数据字段
     * @param val       修改的值
     * @param option    其他数据
     * @returns
     */
    const handleChange = (filedName: string, val: any, option?: any) => {
        console.log(val, filedName, option);
        const setValueObj: any = {[filedName]: val};
        switch (filedName) {
            case 'accountPeriodId':
                setValueObj.accountPeriodInformation = option?.oldLabel;
                break;
            case 'customerId':
                setValueObj.customerNameCn = option?.nameFullCn;
                setValueObj.customerNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.customerOracleCode = option?.oracleCustomerCode || '123456';
                break;
            case 'cargoOwnerId':
                setValueObj.cargoOwnerNameCn = option?.nameFullCn;
                setValueObj.cargoOwnerNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.cargoOwnerOracleCode = option?.oracleCustomerCode;
                break;
            case 'payerId':
                setValueObj.payerNameCn = option?.nameFullCn;
                setValueObj.payerNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.payerOracleCode = option?.oracleCustomerCode;
                break;
            case 'projectId':
                setValueObj.projectName = option?.label;
                break;
            case 'salesId':
                setValueObj.salesName = option?.label;
                setValueObj.salesCode = option?.code || 'test';
                break;
            default: break;
        }
        form.setFieldsValue(setValueObj);
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
                        options={AccountPeriodList}
                        name={'accountPeriodId'}
                        fieldProps={{
                            onChange: (val: any, option: any)=> handleChange('accountPeriodId', val, option)
                        }}
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
                        fieldProps={{
                            onChange: (val: any, option: any)=> handleChange('salesId', val,  option)
                        }}
                    />
                    <ProFormText
                        width="md"
                        placeholder=''
                        name={'orderNum'}
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
                        isShowLabel={true}
                        width={"lg"}
                        label="Customer" id={'customerId'} name={'customerId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        valueObj={{value: CJobInfo.customerId, label: CJobInfo.customerNameEn}}
                        query={{branchId: '1665596906844135426', buType: 1, payerFlag: 0}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange('customerId', val, option)}
                    />
                    {/* 付款方 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"}
                        isShowLabel={true}
                        label='Cargo Owner' id={'cargoOwnerId'} name={'cargoOwnerId'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        valueObj={{value: CJobInfo.cargoOwnerId, label: CJobInfo.cargoOwnerNameEn}}
                        query={{branchId: '1665596906844135426'}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange('cargoOwnerId', val, option)}
                    />
                    {/* 货主/业务指定人 */}
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"} isShowLabel={true}
                        id='payerId' name={'payerId'} label={'Paying Agent'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        valueObj={{value: CJobInfo.payerId, label: CJobInfo.payerNameEn}}
                        query={{branchId: '1665596906844135426', buType: 1, payerFlag: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange('payerId', val, option)}
                    />
                </Col>
                <Col xs={0} sm={0} md={2} lg={2} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={7} lg={9} xl={7} xxl={4}>
                    <SearchProFormSelect
                        qty={5}
                        width={"lg"} isShowLabel={true}
                        label="Project" id={'projectId'} name={'projectId'}
                        valueObj={{value: CJobInfo.projectId, label: CJobInfo.projectName}}
                        url={'/apiBase/project/queryProjectCommon'}
                        query={{branchId: '0', type: 1, currentPage: 1, pageSize: 8}}
                        handleChangeData={(val: any, option: any) => handleChange('projectId', val, option)}
                    />
                    <ProFormSwitch
                        name={'nonOperationFlag'}
                        label="Non-operation Revenue"
                    />
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={24}>
                    {/* // TODO: 账期 */}
                    <ProFormText hidden={true} width="md" name={'accountPeriodInformation'}/>

                    {/* // TODO: 销售 */}
                    <ProFormText hidden={true} width="md" name={'salesName'}/>
                    <ProFormText hidden={true} width="md" name={'salesCode'}/>

                    {/* // TODO: 客户 */}
                    <ProFormText hidden={true} width="md" name={'customerNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'customerNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'customerOracleCode'}/>

                    {/* // TODO: 货主 */}
                    <ProFormText hidden={true} width="md" name={'cargoOwnerNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'cargoOwnerNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'cargoOwnerOracleCode'}/>

                    {/* // TODO: 付款 */}
                    <ProFormText hidden={true} width="md" name={'payerNameCn'}/>
                    <ProFormText hidden={true} width="md" name={'payerNameEn'}/>
                    <ProFormText hidden={true} width="md" name={'payerOracleCode'}/>

                    {/* // TODO: 项目 */}
                    <ProFormText hidden={true} width="md" name={'projectName'}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default BasicInfo;