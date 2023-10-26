import React from 'react';
import {ProCard, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {Col, Row} from 'antd';
import {rowGrid} from '@/utils/units';
import SearchModal from '@/components/SearchModal';
import SearchTable from '@/components/SearchTable';
import "../../style.less";
import {TERMS_INCOTERMS, TERMS_PAYMENT} from '@/utils/common-data'

interface Props {
    title: string,
    termsParam: APIModel.Terms,
    form: any,
    FormItem: any,
    handleProFormValueChange: (value: any) => void,
}

const Payment: React.FC<Props> = (props) => {
    const {title, termsParam, form, FormItem} = props;

    /**
     * @Description: TODO: 动态改值
     * @author XXQ
     * @date 2023/7/28
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    const handleChange = (filedName: string, val: any, option: any) => {
        const setValueObj: any = {termsParam: {[filedName]: val}};
        switch (filedName) {
            case 'shipmentTermId':
                setValueObj.termsParam.shipmentTermName = option?.label;
                break;
            case 'payableAtCode':
                setValueObj.termsParam.payableAtNameEn = option?.name;
                break;
            default: break;
        }
        form.setFieldsValue(setValueObj);
        props.handleProFormValueChange(setValueObj);
    }

    return (
        <ProCard title={title} bordered={true} className={'ant-card pro-form-payment'} headerBordered collapsible>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <ProFormSelect
                        required
                        placeholder=''
                        label="Incoterms"
                        name={['termsParam', 'incotermsId']}
                        options={TERMS_INCOTERMS}
                        rules={[{required: true, message: 'Incoterms'}]}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <FormItem
                        label={'Shipment Term'}
                        name={['termsParam', 'shipmentTermId']}
                        rules={[{required: true, message: 'Shipment Term'}]}
                    >
                        <SearchModal
                            qty={20}
                            modalWidth={500}
                            id={'shipmentTermId'}
                            title={'Shipment Term'}
                            text={termsParam?.shipmentTermName}
                            url={"/apiBase/dict/queryDictDetailCommon"}
                            query={{dictCode: 'services', pageSize: 13, currentPage: 1}}
                            handleChangeData={(val: any, option: any) => handleChange('shipmentTermId', val, option)}
                        />
                    </FormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <ProFormSelect
                        required
                        placeholder=''
                        label='Payment Term'
                        name={['termsParam', 'paymentTermId']}
                        options={TERMS_PAYMENT}
                        rules={[{required: true, message: 'Payment Term'}]}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <FormItem
                        label={'Payable AT'}
                        name={['termsParam', 'payableAtCode']}
                        rules={[{required: true, message: 'Payable AT'}]}
                    >
                        <SearchTable
                            qty={10}
                            rowKey={'code'}
                            modalWidth={950}
                            showHeader={true}
                            title={'Payable AT'}
                            text={termsParam?.payableAtNameEn}
                            url={"/apiBase/sea/querySeaCommon"}
                            name={['termsParam', 'payableAtCode']}
                            handleChangeData={(val: any, option: any) => handleChange('payableAtCode', val, option)}
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <ProFormText hidden={true} width="md" name={['termsParam', 'id']}/>
                    <ProFormText hidden={true} width="md" name={['termsParam', 'jobId']}/>

                    {/* // TODO: 运输条款 */}
                    <ProFormText hidden={true} width="md" name={['termsParam', 'shipmentTermName']}/>

                    {/* // TODO: 付款地点 */}
                    <ProFormText hidden={true} width="md" name={['termsParam', 'payableAtNameEn']}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Payment;