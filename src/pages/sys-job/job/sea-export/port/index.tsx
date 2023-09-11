import React, {useState} from 'react';
import {Button, Col, Divider, Form, Row, Space, Table} from "antd";
import {IconFont, rowGrid} from "@/utils/units";
import {ProCard, ProFormText} from "@ant-design/pro-components";
import SearchTable from "@/components/SearchTable";
import {PlusCircleOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchProFormSelect from "@/components/SearchProFormSelect";

interface Props {
    title: string;
    form: any;
    serviceInfo: any;
}

// const initialTranshipmentPortList: APIModel.TranshipmentPortList[] = [
//     {ID: 'ID1', PortName: "HO CHI MINH CITY(VIETNAM)",},
//     {ID: 'ID2', PortName: "SOKHNA(EGYPT)",},
//     {ID: 'ID3', PortName: "JAKARTA(INDONESIA)",},
// ];

const Ports: React.FC<Props> = (props) => {
    const {serviceInfo, form} = props;

    const [portNameInfo, setPortNameInfo] = useState({
        portOfLoadingNameEn: serviceInfo.portOfLoadingNameEn,
        placeOfReceiptNameEn: serviceInfo.placeOfReceiptNameEn,
        portOfDischargeNameEn: serviceInfo.portOfDischargeNameEn,
        finalDestinationNameEn: serviceInfo.finalDestinationNameEn,
    });

    const [isReload, setIsReload] = useState<boolean>(false);

    // const handleChange = (fieldName: string, val: any, option?: any) => {
    function handleChange (fieldName: string, val: any, option?: any) {
        let setPortInfoVal: any = {};
        const portInfo = JSON.parse(JSON.stringify(portNameInfo)) || {};
        switch (fieldName) {
            // 装货港
            case "portOfLoadingCode":
                portInfo.portOfLoadingNameEn = option?.name;
                portInfo.placeOfReceiptNameEn = option?.name;
                setPortInfoVal = {
                    ...portInfo, ...setPortInfoVal, placeOfReceiptCode: val,
                    portOfLoadingPrintOnBill: option?.name, placeOfReceiptPrintOnBill: option?.name
                };
                break;
            // 交货地
            case "placeOfReceiptCode":
                portInfo.placeOfReceiptNameEn = option?.name;
                setPortInfoVal = {
                    ...portInfo, placeOfReceiptNameEn: option?.name, placeOfReceiptPrintOnBill: option?.name
                };
                break;
            // 卸货港
            case "portOfDischargeCode":
                portInfo.portOfDischargeNameEn = option?.name;
                portInfo.finalDestinationNameEn = option?.name;
                setPortInfoVal = {
                    ...portInfo, finalDestinationCode: val,
                    portOfDischargePrintOnBill: option?.name, finalDestinationPrintOnBill: option?.name
                };
                break;
            // 目的地
            case "finalDestinationCode":
                portInfo.finalDestinationNameEn = option?.name;
                setPortInfoVal = {
                    ...portInfo,
                    finalDestinationNameEn: option?.name, finalDestinationPrintOnBill: option?.name
                };
                break;
            default:
                break;
        }
        setPortNameInfo(portInfo);
        setIsReload(true);
        form.setFieldsValue({[fieldName]: val, ...setPortInfoVal});
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
            className={'ant-card seaExportPort'}
        >
            <Row gutter={rowGrid}>
                {/*装货港、卸货港*/}
                <Col xs={24} sm={24} md={24} lg={20} xl={12} xxl={8}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <Form.Item label={'Port of Loading'} name={'portOfLoadingCode'}>
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
                        </Form.Item>
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={'portOfLoadingPrintOnBill'}
                            label="Port of Loading (print on bill)"
                        />
                    </Space>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <Form.Item label={'Port of Discharge'} name={'portOfDischargeCode'}>
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
                        </Form.Item>
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={'portOfDischargePrintOnBill'}
                            label="Port of Discharge (print on bill)"
                        />
                    </Space>
                </Col>
                <Col xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} flex="auto" style={{textAlign: "center"}}>
                    <Divider type="vertical" style={{height: '100%'}}/>
                </Col>
                {/*交货地、目的地*/}
                <Col xs={24} sm={24} md={24} lg={20} xl={11} xxl={8}>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <Form.Item label={'Place of Receipt'} name={'placeOfReceiptCode'}>
                            <SearchTable
                                qty={20}
                                rowKey={'code'}
                                modalWidth={950}
                                showHeader={true}
                                isReload={isReload}
                                title={'Place of Receipt'}
                                id={'placeOfReceiptCode'}
                                className={'input-container'}
                                url={"/apiBase/sea/querySeaCommon"}
                                text={portNameInfo.placeOfReceiptNameEn}
                                handleChangeReload={()=> setIsReload(false)}
                                handleChangeData={(val: any, option: any) => handleChange('placeOfReceiptCode', val, option)}
                            />
                        </Form.Item>
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={'placeOfReceiptPrintOnBill'}
                            label="Place of Receipt (print on bill)"
                        />
                    </Space>
                    <Space direction="horizontal" align="center" className={'siteSpace'}>
                        <Form.Item label={'Final Destination'} name={'finalDestinationCode'}>
                            <SearchTable
                                qty={20}
                                rowKey={'code'}
                                modalWidth={950}
                                showHeader={true}
                                isReload={isReload}
                                id={'finalDestinationCode'}
                                title={'Final Destination'}
                                className={'input-container'}
                                url={"/apiBase/sea/querySeaCommon"}
                                text={portNameInfo.finalDestinationNameEn}
                                handleChangeReload={()=> setIsReload(false)}
                                handleChangeData={(val: any, option: any) => handleChange('finalDestinationCode', val, option)}
                            />
                        </Form.Item>
                        <span className={'siteSpaceSpan'}/>
                        <ProFormText
                            width={'sm'}
                            placeholder=""
                            allowClear={false}
                            name={'finalDestinationPrintOnBill'}
                            label="Final Destination (print on bill)"
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
                        rowKey={'id'}
                        columns={columns}
                        showHeader={false}
                        pagination={false}
                        dataSource={[]}
                        locale={{emptyText: "NO DATA"}}
                        className={'transhipmentPortTable'}
                    />
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

                    {/* // TODO: 船代 */}
                    <ProFormText hidden={true} width="md" name={'finalDestinationNameEn'}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Ports;