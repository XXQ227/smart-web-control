import React, {useState} from 'react';
import {
    ProCard,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import {Col, Row, Select, Divider, Space, Button, Popconfirm, Table} from 'antd';
import {ID_STRING, rowGrid} from '@/utils/units';
import {PlusCircleOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import NonContainerLayout from "./non-container-layout";
import ContainerLayout from "./container-layout";
import ls from 'lodash';
import FormItemInput from "@/components/FormItemComponents/FormItemInput";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import moment from "moment/moment";
import {BRANCH_ID} from '@/utils/auths'

interface Props {
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data: any,
    handleChangeLabel: (val: any) => void,   // 选中后，返回的结果
    handleChangeData: (val: any) => void,    // 设置数据
}

const { Option } = Select;

const BasicInfo: React.FC<Props> = (props) => {
    const {
        batchNo, data, form
    } = props;

    const [isContainer, setIsContainer] = useState(data[0]?.transportVehicleTypeId === 3);
    const [photoRemarkList, setPhotoRemarkList] = useState<APIModel.PhotoRemarkList[]>(data[0]?.photoRemarkEntityList || []);

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
        newData.splice(index, 1, target);
        // TODO: 把数据更新到表单里
        props.handleChangeData({photoRemarkEntityList: newData});
        setPhotoRemarkList(newData);
    }

    /**
     * @Description: TODO:
     * @author LLS
     * @date 2023/8/21
     * @param filedName 操作的数据字段
     * @param val       修改的值
     * @param option    其他数据
     * @returns
     */
    const handleChange = (filedName: string, val: any, option?: any) => {
        const setValueObj: any = {[filedName]: val};
        switch (filedName) {
            case 'shipmentNum':
                if (props.handleChangeLabel) props.handleChangeLabel(val);
                break;
            case 'truckingCompanyId':
                setValueObj.truckingCompanyNameCn = option?.nameFullCn;
                setValueObj.truckingCompanyNameEn = option?.nameFullEn || option?.nameFullCn;
                setValueObj.truckingCompanyOracleId = option?.oracleCustomerCode;
                // TODO: 把数据更新到表单里
                props.handleChangeData(setValueObj);
                break;
            case 'transportVehicleTypeId':
                setIsContainer(val === 3);
                break;
            default: break;
        }
    }

    const handleAdd = () => {
        const newData: APIModel.PhotoRemarkList = {
            id: ID_STRING(),
            description: "",
            createTime: "",
        };
        setPhotoRemarkList([...photoRemarkList, newData]);
    };

    const handleDelete = (key: any) => {
        const newData = photoRemarkList.filter(item => item.id !== key);
        // TODO: 把数据更新到表单里
        props.handleChangeData({photoRemarkEntityList: newData});
        setPhotoRemarkList(newData);
    };

    const columns: ColumnsType<APIModel.PhotoRemarkList> = [
        {
            title: 'Description',
            dataIndex: 'description',
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    name={['0', `description_remark_table_${record.id}`]}
                    initialValue={record.description}
                    rules={[{required: true, message: 'Description'}]}
                    onChange={(e) => onChange(index, record.id, 'description', e)}
                />
        },
        {
            title: 'Time',
            align: "center",
            width: '140px',
            dataIndex: 'createTime',
            render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: 'Action',
            align: "center",
            dataIndex: 'photo',
            width: '120px',
            className: "textColor",
            render: (text: any, record) => {
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
        <Row className={'antProCard'}>
            <Row gutter={rowGrid}>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={isContainer ? 6 : 8} className={'custom-input'}>
                    <ProFormText
                        required
                        placeholder=''
                        name='shipmentNum'
                        label="Shipment No."
                        rules={[{required: true, message: 'Shipment No.'}]}
                        fieldProps={{
                            onChange: (e) => handleChange('shipmentNum', e.target.value)
                        }}
                    />
                    <label>G.W.</label>
                    <ProFormDigit
                        placeholder=''
                        min={0}
                        name='grossWeight'
                        fieldProps={{addonAfter: selectAfter}}
                    />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={isContainer ? 6 : 8}>
                    <SearchProFormSelect
                        required
                        qty={5}
                        isShowLabel={true}
                        id={'truckingCompanyId'}
                        name={`truckingCompanyId`}
                        label="Trucking Company"
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        valueObj={{value: data[0]?.truckingCompanyId, label: data[0]?.truckingCompanyNameEn}}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        query={{branchId: BRANCH_ID(), buType: 1}}
                        handleChangeData={(val: any, option: any) => handleChange('truckingCompanyId', val, option)}
                    />
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            placeholder=''
                            name='measurement'
                            label="Meas. (cbm)"
                            rules={[{pattern: /[0-9]+$/, message: 'Only numbers can be entered'}]}
                        />
                        <ProFormText
                            placeholder=''
                            name='qty'
                            label="QTY."
                            rules={[{pattern: /^[0-9]*$/, message: 'Only integer numbers can be entered'}]}
                        />
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={7} xxl={isContainer ? 6 : 8}>
                    <ProFormSelect
                        required
                        placeholder=''
                        name={'transportVehicleTypeId'}
                        label="Transport Vehicle Type"
                        options={[
                            {label: '平板货车 platform truck(flat bed truck)', value: 1},
                            {label: '通用货车 general-purpose vehicle', value: 2},
                            {label: '集装箱运输货车 container carrier', value: 3},
                            {label: '厢式货车 van', value: 4},
                        ]}
                        rules={[{required: true, message: 'Transport Vehicle Type'}]}
                        fieldProps={{
                            onChange: (e) => handleChange('transportVehicleTypeId', e)
                        }}
                    />
                    <div className={'proFormTextContainer'}>
                        <ProFormText
                            placeholder=''
                            name='licensePlateNum'
                            label="License Plate No."
                        />
                        <ProFormText
                            placeholder=''
                            name='driverName'
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
                                    name='receivingContact'
                                    label="Receiving Contact"
                                />
                                <ProFormText
                                    placeholder=''
                                    name='receivingContactTelephone'
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
                        preBookingList={data[0]?.preBookingContainersEntityList || []}
                        handleChangeData={(val: any) => props.handleChangeData(val)}
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
                            name='operationRemark'
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
                            rowKey={'id'}
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
        </Row>
    )
}
export default BasicInfo;