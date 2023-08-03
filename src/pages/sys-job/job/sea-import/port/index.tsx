import React, {useState} from 'react';
import {Col, Divider, Row} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormDatePicker, ProFormText} from "@ant-design/pro-components";
import SearchTable from "@/components/SearchTable";

interface Props {
    title: string;
    Port?: APIModel.Port;
    FormItem: any;
}

const Ports: React.FC<Props> = (props) => {
    const  {
        Port, FormItem
    } = props;

    const [portInfo, setPortInfo] = useState<any>(Port || {});

    const handleChange =(fieldName: string, val: any, option?: any)=> {
        // console.log(fieldName, val, option);
        switch (fieldName) {
            default: break;
        }
        setPortInfo({});
    }
    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={'seaExportPort'}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* 抵港日期、卸货日期 */}
                <Col xs={24} sm={24} md={24} lg={8} xl={4} xxl={4}>
                    <ProFormDatePicker width="md" name="ETAPOD" label="ETA" placeholder=""/>

                    <ProFormDatePicker width="md" name="dischargingDate" label="Discharging Date" placeholder=""/>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={19} xxl={13}>
                    {/* 收货地、卸货港、装货港 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <FormItem label={'Place of Receipt'} name={['port', 'porId']}>
                                <SearchTable
                                    qty={20}
                                    rowKey={'ID'}
                                    modalWidth={950}
                                    filedValue={'ID'}
                                    showHeader={true}
                                    name="PlaceOfReceiptID"
                                    text={portInfo.porName}
                                    title={'Place of Receipt'}
                                    query={{TransportTypeID: 1}}
                                    className={'input-container'}
                                    filedLabel={['Name', 'Country']}
                                    url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                    handleChangeData={(val: any, option: any) => handleChange('porId', val, option)}
                                />
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <FormItem label={'Port of Discharge'} name={['port', 'podId']}>
                                <SearchTable
                                    qty={20}
                                    rowKey={'ID'}
                                    modalWidth={950}
                                    showHeader={true}
                                    filedValue={'ID'}
                                    text={portInfo.podName}
                                    title={'Port of Discharge'}
                                    query={{TransportTypeID: 1}}
                                    className={'input-container'}
                                    filedLabel={['Name', 'Country']}
                                    url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                    handleChangeData={(val: any, option: any) => handleChange('podId', val, option)}
                                />
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <FormItem label={'Port of Loading'} name={['port', 'polId']}>
                                <SearchTable
                                    qty={20}
                                    // name="POLID"
                                    rowKey={'ID'}
                                    modalWidth={950}
                                    showHeader={true}
                                    filedValue={'ID'}
                                    text={portInfo.polName}
                                    title={'Port of Loading'}
                                    query={{TransportTypeID: 1}}
                                    className={'input-container'}
                                    filedLabel={['Name', 'Country']}
                                    url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                    handleChangeData={(val: any, option: any) => handleChange('polId', val, option)}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    {/* 码头、作业区 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <ProFormText
                                name="TERMINAL"
                                label="Wharf"
                                placeholder=""
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <ProFormText
                                name="operationArea"
                                label="Operation Area"
                                placeholder=""
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Ports;