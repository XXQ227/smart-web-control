import React from 'react';
import {Col, Divider, Row, Space} from "antd";
import {rowGrid} from "@/utils/units";
import {ProCard, ProFormDatePicker, ProFormText} from "@ant-design/pro-components";
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import SearchTable from "@/components/SearchTable";

interface Props {
    title: string,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
    Carrier?: APIModel.Carrier,
}

const Ports: React.FC<Props> = (props) => {
    const  {
        Port, NBasicInfo, Carrier
    } = props;

    const TransportTypeID = NBasicInfo?.BizType1ID === 2 ? 3 : NBasicInfo?.BizType1ID === 3 ? 2 : NBasicInfo?.BizType1ID === 1 ? 1 : NBasicInfo?.BizType1ID === 4 ? 4 : null;    //  1 海 2陆 3空
    const [POLBill, setPOLBill] = React.useState(Port?.POLBill);
    const [PODBill, setPODBill] = React.useState(Port?.PODBill);
    const [PlaceOfReceiptName, setPlaceOfReceiptName] = React.useState(Port?.PlaceOfReceiptName);
    const [PlaceOfReceiptBill, setPlaceOfReceiptBill] = React.useState(Port?.PlaceOfReceiptBill);
    const [PlaceOfDeliveryName, setPlaceOfDeliveryName] = React.useState(Port?.PlaceOfDeliveryName);
    const [Destination, setDestination] = React.useState(Port?.Destination);

    const handleChange =(fieldName: string, val: any, option?: any)=> {
        // console.log(fieldName, val, option);
        switch (fieldName) {
            // 装货港
            case "POLID":
                setPOLBill(option.label)
                setPlaceOfReceiptName(option.label)
                setPlaceOfReceiptBill(option.label)
                break;
            // 交货地
            case "PlaceOfReceiptID":
                setPlaceOfReceiptBill(option.label)
                break;
            // 卸货港
            case "PODID":
                setPODBill(option.label)
                setPlaceOfDeliveryName(option.label)
                setDestination(option.label)
                break;
            // 目的地
            case "PlaceOfDeliveryID":
                setDestination(option.label)
                break;
            default: break;
        }
    }
    //endregion

    return (
        <ProCard
            title={props.title}
            bordered={true}
            className={styles.seaExportPort}
            headerBordered
            collapsible
        >
            <Row gutter={rowGrid}>
                {/* 抵港日期、卸货日期 */}
                <Col xs={24} sm={24} md={24} lg={8} xl={4} xxl={4}>
                    <ProFormDatePicker
                        width="md"
                        name="ETAPOD"
                        label="ETA"
                        initialValue={Carrier?.ETAPOD || null}
                        placeholder=""
                    />
                    <ProFormDatePicker
                        width="md"
                        name="dischargingDate"
                        label="Discharging Date"
                        placeholder=""
                    />
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={19} xxl={13}>
                    {/* 收货地、卸货港、装货港 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <SearchTable
                                qty={20}
                                name="PlaceOfReceiptID"
                                title={'Place of Receipt'}
                                modalWidth={950}
                                rowKey={'ID'}
                                showHeader={true}
                                query={{ TransportTypeID }}
                                text={PlaceOfReceiptName}
                                url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                filedValue={'ID'}
                                filedLabel={['Name', 'Country']}
                                className={'input-container'}
                                handleChangeData={(val: any, option: any) => handleChange('PlaceOfReceiptID', val, option)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <SearchTable
                                qty={20}
                                name="PODID"
                                title={'Port of Discharge'}
                                modalWidth={950}
                                rowKey={'ID'}
                                showHeader={true}
                                query={{ TransportTypeID }}
                                text={Port?.PODName}
                                url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                filedValue={'ID'}
                                filedLabel={['Name', 'Country']}
                                className={'input-container'}
                                handleChangeData={(val: any, option: any) => handleChange('PODID', val, option)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <SearchTable
                                qty={20}
                                name="POLID"
                                title={'Port of Loading'}
                                modalWidth={950}
                                rowKey={'ID'}
                                showHeader={true}
                                query={{ TransportTypeID }}
                                text={Port?.POLName}
                                url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                filedValue={'ID'}
                                filedLabel={['Name', 'Country']}
                                className={'input-container'}
                                handleChangeData={(val: any, option: any) => handleChange('POLID', val, option)}
                            />
                        </Col>
                    </Row>
                    {/* 码头、作业区 */}
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                            <ProFormText
                                name="TERMINAL"
                                label="Wharf"
                                placeholder=""
                                initialValue={Carrier?.Terminal}
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