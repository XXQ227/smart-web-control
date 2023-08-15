import React from 'react';
import {Col, Row} from 'antd';
import {rowGrid} from '@/utils/units';
import {ProCard} from '@ant-design/pro-components';
import SearchSelectInput from '@/components/SearchSelectInput';
import FormItemTextArea from '@/components/FormItemComponents/FormItemTextArea'

interface Props {
    title: string,
    form?: any,
}

const BillOfLoading: React.FC<Props> = (props) => {
    const {form} = props;


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
        // const setValueObj: any = {billOfLoadingEntity: {[filedName]: val}};
        // console.log(option);
        // form.setFieldsValue(setValueObj);
    }

    const BlDOM = (label: string, domID: string, fieldName: string) => {

        return (
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                <div className={'ant-form-shipperInfoItem'}>
                    <label>{label}</label>
                    <SearchSelectInput
                        qty={5}
                        id={domID}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        query={{branchId: '1665596906844135426', buType: 1}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any) => handleChange(fieldName, val, option)}
                    />
                </div>
                <FormItemTextArea rows={6} placeholder={''} name={['billOfLoadingEntity', fieldName]} />
            </Col>
        );
    }

    //endregion

    return (
        <ProCard
            headerBordered collapsible
            title={props.title} bordered={true}
            className={'seaExportBillOfLoading'}
        >
            <Row gutter={rowGrid}>
                {BlDOM('Shipper', 'SearchInputShipper', 'shipper')}
                {BlDOM('Consignee', 'SearchInputConsignee', 'consignee')}
                {BlDOM('Destination Agent', 'SearchInputPODAgent', 'destinationAgent')}
                {BlDOM('Notify Party', 'SearchInputNotifyParty', 'notifyParty')}
                {BlDOM('Also Notify', 'SearchInputNotifyParty2', 'alsoNotify')}
            </Row>
        </ProCard>
    )
}
export default BillOfLoading;