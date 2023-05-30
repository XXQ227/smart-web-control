import React, {useState} from 'react';
import {Button, Col, Divider, Row, Space, Table} from "antd";
import {IconFont, rowGrid} from "@/utils/units";
import {ProCard, ProFormText} from "@ant-design/pro-components";
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import SearchTable from "@/components/SearchTable";
import {PlusCircleOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchProFormSelect from "@/components/SearchProFormSelect";

interface Props {
    title: string,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
}

const initialTranshipmentPortList: APIModel.TranshipmentPortList[] = [
    {
        ID: 'ID1',
        PortName: "HO CHI MINH CITY(VIETNAM)",
    },
    {
        ID: 'ID2',
        PortName: "SOKHNA(EGYPT)",
    },
    {
        ID: 'ID3',
        PortName: "JAKARTA(INDONESIA)",
    },
];

const Ports: React.FC<Props> = (props) => {
    const  {
        Port, NBasicInfo,
    } = props;

    const TransportTypeID = NBasicInfo?.BizType1ID === 2 ? 3 : NBasicInfo?.BizType1ID === 3 ? 2 : NBasicInfo?.BizType1ID === 1 ? 1 : NBasicInfo?.BizType1ID === 4 ? 4 : null;    //  1 海 2陆 3空
    const [POLBill, setPOLBill] = React.useState(Port?.POLBill);
    const [PODBill, setPODBill] = React.useState(Port?.PODBill);
    const [PlaceOfReceiptName, setPlaceOfReceiptName] = React.useState(Port?.PlaceOfReceiptName);
    const [PlaceOfReceiptBill, setPlaceOfReceiptBill] = React.useState(Port?.PlaceOfReceiptBill);
    const [PlaceOfDeliveryName, setPlaceOfDeliveryName] = React.useState(Port?.PlaceOfDeliveryName);
    const [Destination, setDestination] = React.useState(Port?.Destination);
    const [transhipmentPortList, setTranshipmentPortList] = useState<APIModel.TranshipmentPortList[]>(initialTranshipmentPortList || Port?.TranshipmentPortList);

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

    const handleAdd = () => {
        const newData: APIModel.TranshipmentPortList = {
            ID: `ID${(new Date().getTime())}`,
            PortName: "",
        };
        setTranshipmentPortList([...transhipmentPortList, newData]);
    };

    const handleDelete = (key: any) => {
        const newData = transhipmentPortList.filter(item => item.ID !== key);
        setTranshipmentPortList(newData);
    };

    const columns: ColumnsType<APIModel.TranshipmentPortList> = [
        {
            dataIndex: 'PortName',
            key: 'PortName',
            render: (text: any, record) => {
                return (
                    <SearchProFormSelect
                        qty={5}
                        required={false}
                        allowClear={false}
                        id={`PortName${record.ID}`}
                        name={`PortName${record.ID}`}
                        url={'/api/MCommon/GetPortOrCityByStr'}
                        valueObj={{label: record.PortName}}
                        // handleChangeData={(val: any, option: any) => handleChange('CustomerID', val, option)}
                    />
                );
            }
        },
        {
            align: "center",
            width: '43px',
            render: (text: any, record) => {
                return (
                    <a onClick={() => handleDelete(record.ID)}>
                        <IconFont type={'icon-delete'} />
                    </a>
                );
            }
        },
    ];
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
                 {/*装货港、卸货港*/}
                <Col xs={24} sm={24} md={24} lg={20} xl={11} xxl={8}>
                    <Space direction="horizontal" align="center" className={styles.siteSpace}>
                        <SearchTable
                            qty={20}
                            name="POLID"
                            title={'Port of Loading'}
                            modalWidth={950}
                            rowKey={'ID'}
                            showHeader={true}
                            query={{ TransportTypeID }}
                            text={Port?.POLName}
                            url={"/api/MCommon/GetPortCityOrCountry"}
                            filedValue={'ID'}
                            filedLabel={['Name', 'Country']}
                            className={'input-container'}
                            handleChangeData={(val: any, option: any) => handleChange('POLID', val, option)}
                        />
                        <span className={styles.siteSpaceSpan} />
                        <ProFormText
                            width={'sm'}
                            name="POLBill"
                            label="Port of Loading (print on bill)"
                            placeholder=""
                            allowClear={false}
                            fieldProps={{
                                value: POLBill,
                                onChange: (e) => setPOLBill(e.target.value)
                            }}
                        />
                    </Space>
                    <Space direction="horizontal" align="center" className={styles.siteSpace}>
                        <SearchTable
                            qty={20}
                            name="PODID"
                            title={'Port of Discharge'}
                            modalWidth={950}
                            rowKey={'ID'}
                            showHeader={true}
                            query={{ TransportTypeID }}
                            text={Port?.PODName}
                            url={"/api/MCommon/GetPortCityOrCountry"}
                            filedValue={'ID'}
                            filedLabel={['Name', 'Country']}
                            className={'input-container'}
                            handleChangeData={(val: any, option: any) => handleChange('PODID', val, option)}
                        />
                        <span className={styles.siteSpaceSpan} />
                        <ProFormText
                            width={'sm'}
                            name="PODBill"
                            label="Port of Discharge (print on bill)"
                            placeholder=""
                            allowClear={false}
                            fieldProps={{
                                value: PODBill,
                                onChange: (e) => setPODBill(e.target.value)
                            }}
                        />
                    </Space>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                 {/*交货地、目的地*/}
                <Col xs={24} sm={24} md={24} lg={20} xl={11} xxl={8}>
                    <Space direction="horizontal" align="center" className={styles.siteSpace}>
                        <SearchTable
                            qty={20}
                            name="PlaceOfReceiptID"
                            title={'Place of Receipt'}
                            modalWidth={950}
                            rowKey={'ID'}
                            showHeader={true}
                            query={{ TransportTypeID }}
                            text={PlaceOfReceiptName}
                            url={"/api/MCommon/GetPortCityOrCountry"}
                            filedValue={'ID'}
                            filedLabel={['Name', 'Country']}
                            className={'input-container'}
                            handleChangeData={(val: any, option: any) => handleChange('PlaceOfReceiptID', val, option)}
                        />
                        <span className={styles.siteSpaceSpan} />
                        <ProFormText
                            width={'sm'}
                            name="PlaceOfReceiptBill"
                            label="Place of Receipt (print on bill)"
                            placeholder=""
                            allowClear={false}
                            fieldProps={{
                                value: PlaceOfReceiptBill,
                                onChange: (e) => setPlaceOfReceiptBill(e.target.value)
                            }}
                        />
                    </Space>
                    <Space direction="horizontal" align="center" className={styles.siteSpace}>
                        <SearchTable
                            qty={20}
                            name="PlaceOfDeliveryID"
                            title={'Final Destination'}
                            modalWidth={950}
                            rowKey={'ID'}
                            showHeader={true}
                            query={{ TransportTypeID }}
                            text={PlaceOfDeliveryName}
                            url={"/api/MCommon/GetPortCityOrCountry"}
                            filedValue={'ID'}
                            filedLabel={['Name', 'Country']}
                            className={'input-container'}
                            handleChangeData={(val: any, option: any) => handleChange('PlaceOfDeliveryID', val, option)}
                        />
                        <span className={styles.siteSpaceSpan} />
                        <ProFormText
                            width={'sm'}
                            name="Destination"
                            label="Final Destination (print on bill)"
                            placeholder=""
                            allowClear={false}
                            fieldProps={{
                                value: Destination,
                                onChange: (e) => setDestination(e.target.value)
                            }}
                        />
                    </Space>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: '100%' }} />
                </Col>
                 {/*Transhipment Port*/}
                <Col xs={24} sm={24} md={20} lg={15} xl={11} xxl={6}>
                    <div>
                        <div className={'ant-div-left'}>
                            <span>Transhipment Port</span>
                        </div>
                        <div className={'ant-div-right'}>
                            <Space>
                                <Button onClick={handleAdd} style={{ border: "none" }}><PlusCircleOutlined /></Button>
                            </Space>
                        </div>
                    </div>
                    <Table
                        rowKey={'ID'}
                        // bordered
                        showHeader={false}
                        pagination={false}
                        columns={columns}
                        dataSource={transhipmentPortList}
                        locale={{emptyText: "NO DATA"}}
                        className={styles.transhipmentPortTable}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default Ports;