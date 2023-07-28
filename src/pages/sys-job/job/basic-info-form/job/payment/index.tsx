import React, {useEffect, useMemo} from 'react';
import {ProCard, ProFormSelect} from '@ant-design/pro-components';
import {Col, Form, Row} from 'antd';
import {rowGrid} from '@/utils/units';
import SearchModal from '@/components/SearchModal';
import SearchTable from '@/components/SearchTable';
import "../../style.less";
import {TERMS_INCOTERMS, TERMS_PAYMENT} from '@/utils/common-data'

interface Props {
    title: string,
    terms: APIModel.Terms,
    form: any,
    FormItem: any,
}

const Payment: React.FC<Props> = (props) => {
    const {title, terms, form, FormItem} = props;

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
     * @returns
     */
    const handleChange = (filedName: string, val: any) => {
        form.setFieldsValue({terms: {[filedName]: val}});
    }


    return (
        <ProCard title={title} bordered={true} className={'ant-card pro-form-payment'} headerBordered collapsible>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <ProFormSelect
                        placeholder=''
                        label="Incoterms"
                        name={['terms', 'incotermsId']}
                        options={TERMS_INCOTERMS}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <FormItem
                        label={'Shipment Term'}
                        name={['terms', 'serviceTypeId']}
                    >
                        <SearchModal
                            qty={20}
                            modalWidth={500}
                            id={'serviceTypeId'}
                            title={'Shipment Term'}
                            text={terms.serviceTypeName}
                            url={"/apiBase/dict/queryDictDetailCommon"}
                            query={{dictCode: 'services', pageSize: 13, currentPage: 1}}
                            handleChangeData={(val: any) => handleChange('serviceTypeId', val)}
                        />
                    </FormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <ProFormSelect
                        placeholder=''
                        label='Payment Term'
                        name={['terms', 'payMethod']}
                        options={TERMS_PAYMENT}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                    <Form.Item name={['terms', 'payableAtId']} label={'Payable AT'}>
                        <SearchTable
                            qty={10}
                            rowKey={'ID'}
                            modalWidth={950}
                            showHeader={true}
                            title={'Payable AT'}
                            className={'textRight'}
                            text={terms.serviceTypeName}
                            name={['terms', 'payableAtId']}
                            // url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                            handleChangeData={(val: any) => handleChange('payableAtId', val)}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Payment;