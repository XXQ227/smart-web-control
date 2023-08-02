import React, {useState} from 'react';
import {ProCard, ProFormText, ProFormSwitch, ProFormDateTimePicker} from '@ant-design/pro-components';
import {Col, Row, Form, Space, Button, Table, Popconfirm} from 'antd';
import {getBranchID} from '@/utils/auths';
import styles from "@/pages/sys-job/job/style.less";
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
    CTNPlanList?: APIModel.ContainerList[],
    NBasicInfo: APIModel.NBasicInfo,
}

const FormItem = Form.Item;

const initialContainerList: APIModel.ContainerList[] = [
    {
        ID: 'ID1',
        CTNModelID: 1,
        CTNModelName: "20GP",
        QTY: 1,
        IsSOC: false,
        Owner: "码头箱主",
        Remark: "abcde",
    },
    {
        ID: 'ID2',
        CTNModelID: 2,
        CTNModelName: "40GP",
        QTY: 2,
        IsSOC: true,
        Owner: "Owner456",
        Remark: "123",
    },
];

const ContainerLayout: React.FC<Props> = (props) => {
    const  {
        CTNPlanList, NBasicInfo,
        batchNo
    } = props;

    const [containerList, setContainerList] = useState<APIModel.ContainerList[]>(CTNPlanList || initialContainerList);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    const columns: ColumnsType<APIModel.ContainerList> = [
        {
            title: 'SIZE',
            dataIndex: 'CTNModelID',
            key: 'CTNModelID',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <FormItem
                        name={`CTNModelID${record.ID}`}
                        initialValue={record.CTNModelName}>
                        <SearchModal
                            qty={30}
                            id={`CTNModelID${record.ID}`}
                            title={'SIZE'}
                            modalWidth={500}
                            // value={record.CTNModelName}
                            text={record.CTNModelName}
                            query={{ Type: [6, 7].includes(NBasicInfo.OceanTransportTypeID) ? 5 : null, BranchID: getBranchID(), BizType1ID: NBasicInfo.BizType1ID }}
                            url={"/apiLocal/MCommon/GetCTNModelByStr"}
                            handleChangeData={(val: any, option: any)=> handleRowChange(index, record.ID, 'CTNModelID', val, option)}
                        />
                    </FormItem>
                );
            },
        },
        {
            title: 'QTY',
            dataIndex: 'QTY',
            key: 'QTY',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`QTY${record.ID}`}
                        initialValue={record.QTY}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.ID, 'QTY', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'SOC/COC',
            dataIndex: 'IsSOC',
            key: 'IsSOC',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) => {
                return (
                    <ProFormSwitch
                        name={`IsSOC${record.ID}`}
                        initialValue={record.IsSOC}
                        checkedChildren="SOC"
                        unCheckedChildren="COC"
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.ID, 'IsSOC', e)
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
                        name={`Owner${record.ID}`}
                        initialValue={record.Owner}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.ID, 'Owner', e)
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
                        name={`Remark${record.ID}`}
                        initialValue={record.Remark}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.ID, 'Remark', e)
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
        onChange: (selectedRowKeys: React.Key[], selectedRows: APIModel.ContainerList[]) => {
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
        const newData: APIModel.ContainerList = {
            ID: ID_STRING(),
            CTNModelID: 0,
            CTNModelName: "",
            QTY: 1,
            IsSOC: false,
            Owner: "",
            Remark: "",
        };
        setContainerList([...containerList, newData]);
    };

    const handleDelete = () => {
        const newData = containerList.filter(item => !selectedRowIDs.includes(item.ID));
        setContainerList(newData);
    };

    return (
        <ProCard
            className={styles.containerLayout}
            title={'Task'}
            headerBordered
            collapsible
        >
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={22} xxl={20}>
                    <div className={styles.title}>
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
                        rowKey={'ID'}
                        bordered
                        pagination={false}
                        columns={columns}
                        dataSource={containerList}
                        locale={{emptyText: "NO DATA"}}
                        rowSelection={rowSelection}
                        className={`tableStyle ${styles.containerTable}`}
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