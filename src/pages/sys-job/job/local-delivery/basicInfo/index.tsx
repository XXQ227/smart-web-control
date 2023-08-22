import React, {useState} from 'react';
import {ProCard, ProFormDateTimePicker, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import {Col, Row, InputNumber, Select, Divider, Space, Button, Popconfirm, Table} from 'antd';
import {ID_STRING, rowGrid} from '@/utils/units';
import {PlusCircleOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import NonContainerLayout from "./non-container-layout";
import ContainerLayout from "./container-layout";
import ls from 'lodash';
import FormItemInput from "@/components/FormItemComponents/FormItemInput";

interface Props {
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
    CTNPlanList?: APIModel.PreBookingList[],
    PhotoRemarkList?: APIModel.PhotoRemarkList[],
    NBasicInfo: APIModel.NBasicInfo,
    handleChangeLabel: (val: any) => void,   // 选中后，返回的结果
}

const { Option } = Select;

const initialPhotoRemarkList: APIModel.PhotoRemarkList[] = [
    {
        id: 'ID1',
        description: "青衣碼頭裝箱照片",
        Time: "2023-03-20 15:30",
    },
    {
        id: 'ID2',
        description: "港區入口交通擁堵，無法及時提柜",
        Time: "2023-03-20 20:10",
    },
];

const BasicInfo: React.FC<Props> = (props) => {
    const  {
        batchNo, data, form,
        CTNPlanList, PhotoRemarkList, NBasicInfo
    } = props;

    const [isContainer, setIsContainer] = useState(data?.vehicleType === '集装箱运输货车');
    const [photoRemarkList, setPhotoRemarkList] = useState<APIModel.PhotoRemarkList[]>(PhotoRemarkList || initialPhotoRemarkList);

    const selectAfter = (
        <Select defaultValue="KG" style={{ width: 70 }}>
            <Option value="KG">KG</Option>
        </Select>
    );

    /**
     * @Description: TODO: 更新Photo Remark信息
     * @author LLS
     * @date 2023/8/17
     * @param index
     * @param rowID
     * @param filedName
     * @param val
     * @returns
     */
    function onChange(index: number, rowID: any, filedName: string, val: any) {
        const newData: any[] = ls.cloneDeep(photoRemarkList);
        const target = newData.find((item: any)=> item.id === rowID) || {};
        target[filedName] = val?.target ? val.target.value : val;
        console.log(target);
        newData.splice(index, 1, target);
        // TODO: 把数据接口给到 FormItem 表单里
        form.setFieldsValue({
            [`${filedName}_remark_table_${target.id}`]: target[filedName],
            photoRemarkEntityList: newData
        });
        setPhotoRemarkList(newData);
    }

    const handleAdd = () => {
        const newData: APIModel.PhotoRemarkList = {
            id: ID_STRING(),
            description: "",
            Time: "",
            // Time: new Date().toString(),
        };
        setPhotoRemarkList([...photoRemarkList, newData]);
    };

    const handleDelete = (key: any) => {
        const newData = photoRemarkList.filter(item => item.id !== key);
        setPhotoRemarkList(newData);
    };

    const handleChange = (fieldName: string, value: string) => {
        if (fieldName === 'shipmentNum') {
            if (props.handleChangeLabel) props.handleChangeLabel(value);
        } else if (fieldName === 'TransportVehicleType') {
            setIsContainer(value === "集装箱运输货车")
        }
    };

    const columns: ColumnsType<APIModel.PhotoRemarkList> = [
        {
            title: 'Description',
            dataIndex: 'Description',
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    placeholder={''}
                    initialValue={record.description}
                    name={`description_remark_table_${record.id}`}
                    rules={[{required: true, message: 'Description'}]}
                    onChange={(e) => onChange(index, record.id, 'description', e)}
                />
        },
        {
            title: 'Time',
            align: "center",
            dataIndex: 'Time',
        },
        {
            title: 'Action',
            align: "center",
            dataIndex: 'photo',
            width: '120px',
            className: "textColor",
            render: (text: any, record, index) => {
                return (
                    <div>
                        <a>View</a>
                        <span className="vertical-line" />
                        <Popconfirm
                            title={'Sure to delete?'}
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    </div>
                );
            }
        },
    ];

    return (
        <div className={'antProCard'}>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={5} className={'custom-input'}>
                    <ProFormText
                        placeholder=''
                        name={`shipmentNum${batchNo}`}
                        initialValue={data?.shipmentNum}
                        label="Shipment No."
                        fieldProps={{
                            onChange: (e) => handleChange('shipmentNum', e.target.value)
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
                            name={`licensePlateNum${batchNo}`}
                            initialValue={data?.licensePlateNum}
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
                                    name={`receivingContact${batchNo}`}
                                    initialValue={data?.receivingContact}
                                    label="Receiving Contact"
                                />
                                <ProFormText
                                    placeholder=''
                                    name={`receivingContactTelephone${batchNo}`}
                                    initialValue={data?.receivingContactTelephone}
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
                        form={form}
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
                className={'remark'}
                title={'Remark'}
                headerBordered
                collapsible
            >
                <Row gutter={rowGrid}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={7} xxl={5}>
                        <ProFormTextArea
                            name={`operationRemark${batchNo}`}
                            fieldProps={{rows: 5}}
                            label="Operation Remark"
                            placeholder=''
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={17} xxl={15}>
                        <div className={'photo-remark-title'}>
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
                            dataSource={photoRemarkList}
                            columns={columns}
                            locale={{emptyText: "NO DATA"}}
                            className={'tableStyle photoRemarkTable'}
                        />

                        {/* // TODO: 用于保存时，获取数据用 */}
                        <ProFormText hidden={true} name={'photoRemarkEntityList'}/>
                    </Col>
                </Row>
            </ProCard>
        </div>
    )
}
export default BasicInfo;