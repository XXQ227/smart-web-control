import React, {useState} from 'react';
import {Button, Col, Divider, Row, Space, Table} from "antd";
import {IconFont, rowGrid} from "@/utils/units";
import {ProCard, ProFormText} from "@ant-design/pro-components";
import SearchTable from "@/components/SearchTable";
import {PlusCircleOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import ls from 'lodash'

interface Props {
    title: string;
    form: any;
    FormItem: any;
}

// const initialTranshipmentPortList: APIModel.TranshipmentPortList[] = [
//     {ID: 'ID1', PortName: "HO CHI MINH CITY(VIETNAM)",},
//     {ID: 'ID2', PortName: "SOKHNA(EGYPT)",},
//     {ID: 'ID3', PortName: "JAKARTA(INDONESIA)",},
// ];

const Ports: React.FC<Props> = (props) => {
    const {FormItem, form} = props;

    const [portInfo, setPortInfo] = useState<any>({});

    const handleChange = (fieldName: string, val: any, option?: any) => {
        let setPortInfoVal: any = {[fieldName]: val};
        const portVal: any = ls.cloneDeep(portInfo);
        switch (fieldName) {
            // 装货港
            case "polId":
                setPortInfoVal = {
                    ...setPortInfoVal,
                    polName: option.Name, porId: val, porName: option.Name,
                    polBill: option.Name, porBill: option.Name
                };
                break;
            // 交货地
            case "porId":
                setPortInfoVal = {
                    ...setPortInfoVal,
                    porId: val, porName: option.Name, porBill: option.Name
                };
                break;
            // 卸货港
            case "podId":
                setPortInfoVal = {
                    ...setPortInfoVal,
                    podName: option.Name, placeOfDeliveryId: val, placeOfDeliveryName: option.Name,
                    podBill: option.Name, destination: option.Name
                };
                break;
            // 目的地
            case "placeOfDeliveryId":
                setPortInfoVal = {
                    ...setPortInfoVal,
                    placeOfDeliveryId: val, placeOfDeliveryName: option.Name,
                    podBill: option.Name, destination: option.Name
                };
                break;
            default:
                break;
        }
        form.setFieldsValue({port: setPortInfoVal});
        setPortInfo({...portVal, ...setPortInfoVal});
    }

    const handleAdd = () => {
        // const newData: APIModel.TranshipmentPortList = {
        //     ID: ID_STRING(),
        //     PortName: "",
        // };
        // setTranshipmentPortList([...transhipmentPortList, newData]);
    };

    const handleDelete = (key: any) => {
        // const newData = transhipmentPortList.filter(item => item.ID !== key);
        // setTranshipmentPortList(newData);
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
                        url={'/apiLocal/MCommon/GetPortOrCityByStr'}
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
                        <IconFont type={'icon-delete'}/>
                    </a>
                );
            }
        },
    ];
    //endregion

    return (
        <ProCard
            collapsible
            headerBordered
            bordered={true}
            title={props.title}
            className={'seaExportPort'}
        >
            <Row gutter={rowGrid}>
                {/*装货港、卸货港*/}
                <Col xs={24} sm={24} md={24} lg={20} xl={12} xxl={8}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
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
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={['port', 'polBill']}
                            label="Port of Loading (print on bill)"
                            fieldProps={{
                                // onChange: (e) =>
                            }}
                        />
                    </Space>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <FormItem label={'Port of Discharge'} name={['port', 'podId']}>
                            <SearchTable
                                qty={20}
                                rowKey={'ID'}
                                // name="PODID"
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
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={['port', 'podBill']}
                            label="Port of Discharge (print on bill)"
                            fieldProps={{
                                // onChange: (e) => setPODBill(e.target.value)
                            }}
                        />
                    </Space>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{textAlign: "center"}}>
                    <Divider type="vertical" style={{height: '100%'}}/>
                </Col>
                {/*交货地、目的地*/}
                <Col xs={24} sm={24} md={24} lg={20} xl={11} xxl={8}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
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
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={['port', 'porBill']}
                            label="Place of Receipt (print on bill)"
                            fieldProps={{
                                // onChange: (e) => setPlaceOfReceiptBill(e.target.value)
                            }}
                        />
                    </Space>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <FormItem label={'Final Destination'} name={['port', 'placeOfDeliveryId']}>
                            <SearchTable
                                qty={20}
                                rowKey={'ID'}
                                modalWidth={950}
                                showHeader={true}
                                filedValue={'ID'}
                                name="PlaceOfDeliveryID"
                                title={'Final Destination'}
                                query={{TransportTypeID: 1}}
                                className={'input-container'}
                                filedLabel={['Name', 'Country']}
                                text={portInfo.placeOfDeliveryName}
                                url={"/apiLocal/MCommon/GetPortCityOrCountry"}
                                handleChangeData={(val: any, option: any) => handleChange('placeOfDeliveryId', val, option)}
                            />
                        </FormItem>
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={['port', 'destination']}
                            label="Final Destination (print on bill)"
                            fieldProps={{
                                // onChange: (e) => setDestination(e.target.value)
                            }}
                        />
                    </Space>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{textAlign: "center"}}>
                    <Divider type="vertical" style={{height: '100%'}}/>
                </Col>
                {/*Transhipment Port*/}
                <Col xs={24} sm={24} md={20} lg={15} xl={11} xxl={6}>
                    <div>
                        <div className={'ant-div-left'}>
                            <span>Transhipment Port</span>
                        </div>
                        <div className={'ant-div-right'}>
                            <Space>
                                <Button onClick={handleAdd} style={{border: "none"}}><PlusCircleOutlined/></Button>
                            </Space>
                        </div>
                    </div>
                    <Table
                        rowKey={'ID'}
                        // bordered
                        showHeader={false}
                        pagination={false}
                        columns={columns}
                        dataSource={[]}
                        locale={{emptyText: "NO DATA"}}
                        className={'transhipmentPortTable'}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default Ports;