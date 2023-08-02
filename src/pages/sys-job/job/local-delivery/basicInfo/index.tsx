import React, {useState} from 'react';
import {ProCard, ProFormDateTimePicker, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import {Col, Row, InputNumber, Select, Divider, Space, Button, Popconfirm, Table} from 'antd';
import {ID_STRING, rowGrid} from '@/utils/units';
import {PlusCircleOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import NonContainerLayout from "./non-container-layout";
import ContainerLayout from "./container-layout";
import styles from "@/pages/sys-job/job/style.less";

interface Props {
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
    CTNPlanList?: APIModel.ContainerList[],
    PhotoRemarkList?: APIModel.PhotoRemarkList[],
    NBasicInfo: APIModel.NBasicInfo,
    handleChangeLabel: (val: any) => void,   // 选中后，返回的结果
}

const { Option } = Select;

const initialPhotoRemarkList: APIModel.PhotoRemarkList[] = [
    {
        ID: 'ID1',
        Description: "青衣碼頭裝箱照片",
        Time: "2023-03-20 15:30:10",
    },
    {
        ID: 'ID2',
        Description: "港區入口交通擁堵，無法及時提柜",
        Time: "2023-03-20 20:10:10",
    },
];

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        batchNo, data,
        CTNPlanList, PhotoRemarkList, NBasicInfo
    } = props;

    const [isContainer, setIsContainer] = useState(data?.vehicleType === '集装箱运输货车');
    const [photoRemarkList, setPhotoRemarkList] = useState<APIModel.PhotoRemarkList[]>(PhotoRemarkList || initialPhotoRemarkList);

    const selectAfter = (
        <Select defaultValue="KG" style={{ width: 70 }}>
            <Option value="KG">KG</Option>
        </Select>
    );

    function handleRowChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        console.log(index)
        console.log(filedName)
    }

    const handleAdd = () => {
        const newData: APIModel.PhotoRemarkList = {
            ID: ID_STRING(),
            Description: "",
            Time: new Date().toString(),
        };
        setPhotoRemarkList([...photoRemarkList, newData]);
    };

    const handleDelete = (key: any) => {
        const newData = photoRemarkList.filter(item => item.ID !== key);
        setPhotoRemarkList(newData);
    };

    const handleChange = (fieldName: string, value: string) => {
        if (fieldName === 'shipmentNo') {
            if (props.handleChangeLabel) props.handleChangeLabel(value);
        } else if (fieldName === 'TransportVehicleType') {
            setIsContainer(value === "集装箱运输货车")
        }
    };

    const columns: ColumnsType<APIModel.PhotoRemarkList> = [
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`Description${record.ID}`}
                        initialValue={record.Description}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.ID, 'Description', e)
                        }}
                    />
                );
            }
        },
        {
            title: 'Time',
            align: "center",
            dataIndex: 'Time',
            key: 'Time',
            render: (text: any, record, index) => {
                return (
                    <ProFormDateTimePicker
                        name={`Time${record.ID}`}
                        initialValue={record.Time}
                        fieldProps={{
                            // format: (value) => value.format('YYYY-MM-DD'),
                            onChange: (e) => handleRowChange(index, record.ID, 'Description', e)
                        }}
                    />
                );
            }
        },
        {
            title: 'Action',
            align: "center",
            dataIndex: 'photo',
            key: 'photo',
            width: '120px',
            className: "textColor",
            render: (text: any, record, index) => {
                return (
                    <div>
                        <a>View</a>
                        <span className="vertical-line" />
                        <Popconfirm
                            title={'Sure to delete?'}
                            onConfirm={() => handleDelete(record.ID)}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    </div>
                );
            }
        },
    ];


    return (
        <div
            className={styles.antProCard}
        >
            <Row gutter={rowGrid}>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={5} className={'custom-input'}>
                    <ProFormText
                        placeholder=''
                        name={`shipmentNo${batchNo}`}
                        initialValue={data?.shipmentNo}
                        label="Shipment No."
                        fieldProps={{
                            onChange: (e) => handleChange('shipmentNo', e.target.value)
                        }}
                    />
                    <label>G.W.</label>
                    <InputNumber
                        name={`grossWeight${batchNo}`}
                        addonAfter={selectAfter}
                        defaultValue={data?.grossWeight}
                    />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={5}>
                    <ProFormSelect
                        placeholder=''
                        name={`truckingCompany${batchNo}`}
                        label="Trucking Company"
                        initialValue={data?.truckingCompany}
                        options={[
                            {label: '深圳鸿邦物流', value: '深圳鸿邦物流'},
                            {label: '威盛运输企业有限公司', value: '威盛运输企业有限公司'},
                            {label: '招商局建瑞运输有限公司', value: '招商局建瑞运输有限公司'},
                        ]}
                    />
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            placeholder=''
                            name={`Measurement${batchNo}`}
                            initialValue={data?.measurement}
                            label="Meas. (cbm)"
                        />
                        <ProFormText
                            placeholder=''
                            name={`Pieces${batchNo}`}
                            initialValue={data?.pieces}
                            label="QTY."
                        />
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={5}>
                    <ProFormSelect
                        placeholder=''
                        name={`TransportVehicleType${batchNo}`}
                        label="Transport Vehicle Type"
                        // initialValue={data?.vehicleType}
                        initialValue={data?.vehicleType}
                        options={[
                            {label: '平板货车 platform truck(flat bed truck)', value: '平板货车'},
                            {label: '通用货车 general-purpose vehicle', value: '通用货车'},
                            {label: '集装箱运输货车 container carrier', value: '集装箱运输货车'},
                            {label: '厢式货车 van', value: '厢式货车'},
                        ]}
                        fieldProps={{
                            onChange: (e) => handleChange('TransportVehicleType', e)
                        }}
                    />
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            placeholder=''
                            name={`plateNo${batchNo}`}
                            initialValue={data?.plateNo}
                            label="License Plate No."
                        />
                        <ProFormText
                            placeholder=''
                            name={`driverName${batchNo}`}
                            initialValue={data?.driverName}
                            label="Driver Name"
                        />
                    </div>
                </Col>
                {
                    isContainer ?
                        <>
                            <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={1} flex="auto" style={{ textAlign: "center" }}>
                                <Divider type="vertical" style={{ height: '100%' }} />
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={5}>
                                <ProFormText
                                    placeholder=''
                                    name={`receivingContac${batchNo}`}
                                    initialValue={data?.receivingContac}
                                    label="Receiving Contac"
                                />
                                <ProFormText
                                    placeholder=''
                                    name={`phone${batchNo}`}
                                    initialValue={data?.phone}
                                    label="Telephone"
                                />
                            </Col>
                        </>
                        : null
                }
            </Row>

            {
                isContainer ?
                    <ContainerLayout
                        CTNPlanList={CTNPlanList}
                        NBasicInfo={NBasicInfo}
                        batchNo={batchNo}
                        data={data}
                    />
                    :
                    <NonContainerLayout
                        batchNo={batchNo}
                    />
            }

            <ProCard
                className={styles.remark}
                title={'Remark'}
                headerBordered
                collapsible
            >
                <Row gutter={rowGrid}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={7} xxl={5}>
                        <ProFormTextArea
                            name={`OperationRemark${batchNo}`}
                            fieldProps={{rows: 5}}
                            label="Operation Remark"
                            placeholder=''
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={17} xxl={15}>
                        <div className={styles.title}>
                            <div className={'ant-div-left'}>
                                <span>Photo Remark</span>
                            </div>
                            <div className={'ant-div-right'}>
                                <Space>
                                    <Button onClick={handleAdd}><PlusCircleOutlined />Add</Button>
                                </Space>
                            </div>
                        </div>
                        <Table
                            rowKey={'ID'}
                            bordered
                            pagination={false}
                            columns={columns}
                            dataSource={photoRemarkList}
                            locale={{emptyText: "NO DATA"}}
                            className={`tableStyle ${styles.photoRemarkTable}`}
                        />
                    </Col>
                </Row>
            </ProCard>
        </div>
    )
}
export default BasicInfo;