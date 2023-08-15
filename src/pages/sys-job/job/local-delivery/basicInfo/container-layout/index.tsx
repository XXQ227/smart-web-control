import React, {useState} from 'react';
import {ProCard, ProFormText, ProFormSwitch, ProFormDateTimePicker} from '@ant-design/pro-components';
import {Col, Row, Form, Space, Button, Table, Popconfirm} from 'antd';
import {getBranchID} from '@/utils/auths';
import {PlusCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import type { ColumnsType } from 'antd/es/table';
import SearchModal from "@/components/SearchModal";
import {ID_STRING} from "@/utils/units";

interface Props {
    // FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
    CTNPlanList?: APIModel.PreBookingList[],
    NBasicInfo: APIModel.NBasicInfo,
}

const FormItem = Form.Item;

const initialContainerList: APIModel.PreBookingList[] = [
    {
        id: 'ID1',
        ctnModelId: 1,
        ctnModelName: "20GP",
        qty: 1,
        socFlag: false,
        Owner: "码头箱主",
        Remark: "abcde",
    },
    {
        id: 'ID2',
        ctnModelId: 2,
        ctnModelName: "40GP",
        qty: 2,
        socFlag: true,
        Owner: "Owner456",
        Remark: "123",
    },
];

const ContainerLayout: React.FC<Props> = (props) => {
    const  {
        CTNPlanList, NBasicInfo,
        batchNo
    } = props;

    const [containerList, setContainerList] = useState<APIModel.PreBookingList[]>(CTNPlanList || initialContainerList);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    const columns: ColumnsType<APIModel.PreBookingList> = [
        {
            title: 'SIZE',
            dataIndex: 'ctnModelId',
            key: 'ctnModelId',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <FormItem
                        name={`CTNModelID${record.id}`}
                        initialValue={record.ctnModelName}>
                        <SearchModal
                            qty={30}
                            id={`CTNModelID${record.id}`}
                            title={'SIZE'}
                            modalWidth={500}
                            // value={record.ctnModelName}
                            text={record.ctnModelName}
                            query={{ Type: [6, 7].includes(NBasicInfo.OceanTransportTypeID) ? 5 : null, BranchID: getBranchID(), BizType1ID: NBasicInfo.BizType1ID }}
                            url={"/apiLocal/MCommon/GetCTNModelByStr"}
                            handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'ctnModelId', val, option)}
                        />
                    </FormItem>
                );
            },
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            key: 'qty',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`QTY${record.id}`}
                        initialValue={record.qty}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.id, 'qty', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'SOC/COC',
            dataIndex: 'socFlag',
            key: 'socFlag',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) => {
                return (
                    <ProFormSwitch
                        name={`socFlag${record.id}`}
                        initialValue={record.socFlag}
                        checkedChildren="SOC"
                        unCheckedChildren="COC"
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.id, 'socFlag', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'Owner',
            dataIndex: 'Owner',
            key: 'Owner',
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`Owner${record.id}`}
                        initialValue={record.Owner}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.id, 'Owner', e)
                        }}
                    />
                );
            }
        },
        {
            title: 'Remark',
            dataIndex: 'Remark',
            key: 'Remark',
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`Remark${record.id}`}
                        initialValue={record.Remark}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.id, 'Remark', e)
                        }}
                    />
                );
            }
        },
    ];

    const rowSelection = {
        columnWidth: 30,
        // selectedRowKeys,
        /*onChange: (selectedRowKeys: React.Key[], ) => {
            let disabled = true;
            if (selectedRowKeys?.length > 0) disabled = false;
            this.setState({selectedRowKeys, disable: disabled});
        },
        onChange: (selectedRowKeys: React.Key[], selectedRows: APIModel.PreBookingList[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        */
        onChange: (selectedRowKeys: React.Key[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`);
            setSelectedRowIDs(selectedRowKeys)
        },
        /*getCheckboxProps: (record: DataType) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),*/
    };

    function handleRowChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        console.log(index)
        console.log(filedName)
    }

    const handleAdd = () => {
        const newData: APIModel.PreBookingList = {
            id: ID_STRING(),
            ctnModelId: 0,
            ctnModelName: "",
            qty: 1,
            socFlag: false,
            Owner: "",
            Remark: "",
        };
        setContainerList([...containerList, newData]);
    };

    const handleDelete = () => {
        const newData = containerList.filter(item => !selectedRowIDs.includes(item.id));
        setContainerList(newData);
    };

    return (
        <ProCard
            className={'containerLayout'}
            title={'Task'}
            headerBordered
            collapsible
        >
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={22} xxl={20}>
                    <div className={'container-list-title'}>
                        <div className={'ant-div-left'}>
                            <span>Container List</span>
                        </div>
                        <div className={'ant-div-right'}>
                            <Space>
                                <Button onClick={handleAdd}><PlusCircleOutlined />Add</Button>
                                <Popconfirm
                                    disabled={selectedRowIDs.length === 0}
                                    title={'Sure to delete?'}
                                    okText={'Yes'} cancelText={'No'}
                                    onConfirm={() => handleDelete()}
                                >
                                    <Button disabled={selectedRowIDs.length === 0}><DeleteOutlined />Remove</Button>
                                </Popconfirm>
                            </Space>
                        </div>
                    </div>
                    <Table
                        rowKey={'id'}
                        bordered
                        pagination={false}
                        columns={columns}
                        dataSource={containerList}
                        locale={{emptyText: "NO DATA"}}
                        rowSelection={rowSelection}
                        className={`tableStyle containerTable`}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        name={`pickupLoc${batchNo}`}
                        initialValue={'香港九龍灣宏光道1號億京中心B座20樓E室'}
                        label="Pickup Location"
                        placeholder={''}
                    />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker
                        name={`pickupTime${batchNo}`}
                        label="Pickup Time"
                        initialValue={'2023-05-19 00:00:10'}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        name={`S&DLoc${batchNo}`}
                        initialValue={'Unit F & G, 20/F., MG Tower, 133 Hoi Bun Road, Kwun Tong, Hong Kong'}
                        label="Containing Stuffing & Devanning at"
                        placeholder={''}
                    />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker
                        name={`S&DTime${batchNo}`}
                        label="Stuffing & Devanning Time"
                        initialValue={'2023-05-19 00:00:10'}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        name={`returnLoc${batchNo}`}
                        initialValue={'16/F, Richmond Commercial Building, 109 Argyle Street, Mongkok, Kowloon'}
                        label="Return Location"
                        placeholder={''}
                    />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker
                        name={`returnTime${batchNo}`}
                        label="Return Time"
                        initialValue={'2023-05-19 00:00:10'}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default ContainerLayout;