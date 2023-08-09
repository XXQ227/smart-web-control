import React, {useEffect, useMemo} from 'react';
import {ProCard, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {Col, Form, Row} from 'antd';
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
}

const Payment: React.FC<Props> = (props) => {
    const {title, termsParam, form, FormItem} = props;

    useMemo(() => {

    }, [])

    useEffect(() => {

    }, [])

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
        console.log(setValueObj);
        form.setFieldsValue(setValueObj);
    }


    return (
        <ProCard title={title} bordered={true} className={'ant-card pro-form-payment'} headerBordered collapsible>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <ProFormSelect
                        placeholder=''
                        label="Incoterms"
                        name={['termsParam', 'incotermsId']}
                        options={TERMS_INCOTERMS}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <FormItem
                        label={'Shipment Term'}
                        name={['termsParam', 'shipmentTermId']}
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
                        placeholder=''
                        label='Payment Term'
                        name={['termsParam', 'paymentTermId']}
                        options={TERMS_PAYMENT}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <Form.Item name={['termsParam', 'payableAtCode']} label={'Payable AT'}>
                        <SearchTable
                            qty={10}
                            rowKey={'code'}
                            modalWidth={950}
                            showHeader={true}
                            title={'Payable AT'}
                            // className={'textRight'}
                            text={termsParam?.payableAtNameEn}
                            name={['termsParam', 'payableAtCode']}
                            url={"/apiBase/sea/querySeaCommon"}
                            handleChangeData={(val: any, option: any) => handleChange('payableAtCode', val, option)}
                        />
                    </Form.Item>
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