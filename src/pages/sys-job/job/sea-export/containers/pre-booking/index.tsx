import React, {useState} from 'react';
import {Button, Col, Form, Popconfirm, Row, Space, Table} from "antd";
import {ProCard, ProFormSwitch, ProFormText} from "@ant-design/pro-components";
import {
    DeleteOutlined,
    DownloadOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchModal from "@/components/SearchModal";
import {getBranchID} from "@/utils/auths";
import {ID_STRING} from "@/utils/units";

interface Props {
    type?: string;
    CTNPlanList?: APIModel.ContainerList[];
    handleRowChange: (index: number, rowID: any, filedName: string, val: any, option?: any) => void;
}

const FormItem = Form.Item;

const initialContainerList: APIModel.ContainerList[] = [
    {
        id: 'ID1',
        ctnModelId: 1,
        ctnModelName: "20GP",
        qty: 2,
        IsSOC: false,
        IsFCL: false,
        Remark: "ANL YF62423",
    },
    {
        id: 'ID2',
        ctnModelId: 2,
        ctnModelName: "40GP",
        qty: 1,
        IsSOC: true,
        IsFCL: true,
        Remark: "CSCLYF85868",
    },
    {
        id: 'ID3',
        ctnModelId: 5,
        ctnModelName: "40HQ",
        qty: 1,
        IsSOC: true,
        IsFCL: false,
        Remark: "KMTCYF85912",
    },
];

const ProBooking: React.FC<Props> = (props) => {
    const {type, CTNPlanList, handleRowChange} = props;

    const [containerList, setContainerList] = useState<APIModel.ContainerList[]>(CTNPlanList || initialContainerList);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    function onChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        console.log(index)
        handleRowChange(index, rowID, filedName, val, option)
    }

    const preBookingColumns: ColumnsType<APIModel.ContainerList> = [
        {
            title: 'SIZE',
            dataIndex: 'ctnModelId',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <FormItem
                        name={`ctnModelId${record.id}`}
                        initialValue={record.ctnModelName}>
                        <SearchModal
                            qty={30}
                            id={`ctnModelId${record.id}`}
                            title={'SIZE'}
                            modalWidth={500}
                            // value={record.ctnModelName}
                            text={record.ctnModelName}
                            query={{Type: 5, BranchID: getBranchID(), BizType1ID: 1}}
                            url={"/apiLocal/MCommon/GetCTNModelByStr"}
                            handleChangeData={(val: any, option: any) => onChange(index, record.id, 'ctnModelId', val, option)}
                        />
                    </FormItem>
                );
            },
        },
        {
            title: 'qty',
            dataIndex: 'qty',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`QTY${record.id}`}
                        initialValue={record.qty}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'qty', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'FCL/LCL',
            dataIndex: 'IsFCL',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) => {
                return (
                    <ProFormSwitch
                        name={`IsFCL${record.id}`}
                        initialValue={record.IsFCL}
                        checkedChildren="FCL"
                        unCheckedChildren="LCL"
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'IsFCL', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'SOC/COC',
            dataIndex: 'IsSOC',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) => {
                return (
                    <ProFormSwitch
                        name={`IsSOC${record.id}`}
                        initialValue={record.IsSOC}
                        checkedChildren="SOC"
                        unCheckedChildren="COC"
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'IsSOC', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'Remark',
            dataIndex: 'Remark',
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`Remark${record.id}`}
                        initialValue={record.Remark}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'Remark', e)
                        }}
                    />
                );
            }
        },
    ];

    const rowSelection = {
        columnWidth: 30,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowIDs(selectedRowKeys)
        },
    };

    const handleAdd = () => {
        const newData: APIModel.ContainerList = {
            id: ID_STRING(),
            qty: 1,
            IsSOC: false,
            Owner: "",
            Remark: "",
        };
        setContainerList([...containerList, newData]);
    };

    const handleDelete = () => {
        const newData =
            containerList.filter(item => !selectedRowIDs.includes(item.id));
        setContainerList(newData);
    };

    //endregion

    return (
        <ProCard hidden={type === 'import'} title={'Pre-booking Containers'} collapsible headerBordered bordered>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                    <Space className={'tableHeaderContainer'}>
                        <Button onClick={handleAdd}><PlusCircleOutlined/>Add</Button>
                        <Popconfirm
                            disabled={selectedRowIDs.length === 0}
                            title={'Sure to delete?'}
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleDelete()}
                        >
                            <Button disabled={selectedRowIDs.length === 0}><DeleteOutlined/>Remove</Button>
                        </Popconfirm>
                        <Button><DownloadOutlined/>Export Manifest</Button>
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                    <Table
                        rowKey={'id'}
                        bordered
                        pagination={false}
                        columns={preBookingColumns}
                        dataSource={containerList}
                        locale={{emptyText: "NO DATA"}}
                        rowSelection={rowSelection}
                        className={`tableStyle containerTable`}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default ProBooking;