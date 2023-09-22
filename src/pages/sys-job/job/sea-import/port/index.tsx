import React, {useState} from 'react';
import {Col, Divider, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormDatePicker, ProFormText} from "@ant-design/pro-components";
import SearchTable from "@/components/SearchTable";

interface Props {
    title: string,
    form: any,
    FormItem: any,
    serviceInfo: any,
    handleProFormValueChange: (value: any) => void,
}

const Ports: React.FC<Props> = (props) => {
    const {form, FormItem, serviceInfo} = props;

    const [portNameInfo, setPortNameInfo] = useState({
        portOfLoadingNameEn: serviceInfo.portOfLoadingNameEn,
        placeOfReceiptNameEn: serviceInfo.placeOfReceiptNameEn,
        portOfDischargeNameEn: serviceInfo.portOfDischargeNameEn,
    });

    const handleChange =(fieldName: string, val: any, option?: any)=> {
        let setPortInfoVal: any = {};
        switch (fieldName) {
            // 装货港
            case "portOfLoadingCode":
                portNameInfo.portOfLoadingNameEn = option?.name;
                setPortInfoVal = {portOfLoadingNameEn: option?.name};
                break;
            // 交货地
            case "placeOfReceiptCode":
                portNameInfo.placeOfReceiptNameEn = option?.name;
                setPortInfoVal = {placeOfReceiptNameEn: option?.name};
                break;
            // 卸货港
            case "portOfDischargeCode":
                portNameInfo.portOfDischargeNameEn = option?.name;
                setPortInfoVal = {portOfDischargeNameEn: option?.name};
                break;
            default:
                break;
        }
        setPortNameInfo(portNameInfo);
        form.setFieldsValue({[fieldName]: val, ...setPortInfoVal});
        props.handleProFormValueChange({[fieldName]: val, ...setPortInfoVal});
    }
    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={'ant-card seaExportPort'}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* 抵港日期、卸货日期 */}
                <Col xs={24} sm={24} md={24} lg={8} xl={4} xxl={4}>
                    <ProFormDatePicker width="md" name="eta" label="ETA" placeholder=""/>
                    <ProFormDatePicker width="md" name="dischargingDate" label="Discharging Date" placeholder=""/>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={19} xxl={13}>
                    {/* 收货地、卸货港、装货港 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <FormItem
                                label={'Place of Receipt'}
                                name={'placeOfReceiptCode'}
                                rules={[{required: true, message: 'Place of Receipt'}]}
                            >
                                <SearchTable
                                    qty={20}
                                    rowKey={'code'}
                                    modalWidth={950}
                                    showHeader={true}
                                    title={'Place of Receipt'}
                                    id={'placeOfReceiptCode'}
                                    className={'input-container'}
                                    url={"/apiBase/sea/querySeaCommon"}
                                    text={portNameInfo.placeOfReceiptNameEn}
                                    handleChangeData={(val: any, option: any) => handleChange('placeOfReceiptCode', val, option)}
                                />
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <FormItem
                                label={'Port of Discharge'}
                                name={'portOfDischargeCode'}
                                rules={[{required: true, message: 'Port of Discharge'}]}
                            >
                                <SearchTable
                                    qty={20}
                                    rowKey={'code'}
                                    modalWidth={950}
                                    showHeader={true}
                                    title={'Port of Discharge'}
                                    className={'input-container'}
                                    url={"/apiBase/sea/querySeaCommon"}
                                    text={portNameInfo.portOfDischargeNameEn}
                                    handleChangeData={(val: any, option: any) => handleChange('portOfDischargeCode', val, option)}
                                />
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <FormItem
                                label={'Port of Loading'}
                                name={'portOfLoadingCode'}
                                rules={[{required: true, message: 'Port of Loading'}]}
                            >
                                <SearchTable
                                    qty={20}
                                    rowKey={'code'}
                                    modalWidth={950}
                                    showHeader={true}
                                    title={'Port of Loading'}
                                    className={'input-container'}
                                    url={"/apiBase/sea/querySeaCommon"}
                                    text={portNameInfo.portOfLoadingNameEn}
                                    handleChangeData={(val: any, option: any) => handleChange('portOfLoadingCode', val, option)}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    {/* 码头、作业区 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <ProFormText width="md" name="wharf" label="Wharf" placeholder=""/>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <ProFormText width="md" name="operationArea" label="Operation Area" placeholder=""/>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={24}>
                    {/* // TODO: 订舱代理 */}
                    <ProFormText hidden={true} width="md" name={'portOfLoadingNameEn'}/>

                    {/* // TODO: 船公司 */}
                    <ProFormText hidden={true} width="md" name={'portOfDischargeNameEn'}/>

                    {/* // TODO: 目的港代理 */}
                    <ProFormText hidden={true} width="md" name={'placeOfReceiptNameEn'}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Ports;