import React, {useState} from 'react';
import {Button, Col, Form, Popconfirm, Row, Space, Table} from "antd";
import {ProCard, ProFormSwitch, ProFormText} from "@ant-design/pro-components";
import styles from "@/pages/sys-job/job/basic-info-form/style.less";
import {DeleteOutlined, PlusCircleOutlined, DownloadOutlined, SyncOutlined, SwapOutlined, CloudUploadOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchModal from "@/components/SearchModal";
import {getBranchID} from "@/utils/auths";
import {IconFont} from "@/utils/units";

interface Props {
    CTNPlanList?: APIModel.ContainerList[],
    CTNActualList?: APIModel.CTNActualList[],
    NBasicInfo: APIModel.NBasicInfo,
}

const FormItem = Form.Item;

const initialContainerList: APIModel.ContainerList[] = [
    {
        ID: 'ID1',
        CTNModelID: 1,
        CTNModelName: "20GP",
        QTY: 2,
        IsSOC: false,
        IsFCL: false,
        Remark: "ANL YF62423",
    },
    {
        ID: 'ID2',
        CTNModelID: 2,
        CTNModelName: "40GP",
        QTY: 1,
        IsSOC: true,
        IsFCL: true,
        Remark: "CSCLYF85868",
    },
    {
        ID: 'ID3',
        CTNModelID: 5,
        CTNModelName: "40HQ",
        QTY: 1,
        IsSOC: true,
        IsFCL: false,
        Remark: "KMTCYF85912",
    },
];

const Containers: React.FC<Props> = (props) => {
    const  {
        CTNPlanList, NBasicInfo,
        CTNActualList
    } = props;

    const [containerList, setContainerList] = useState<APIModel.ContainerList[]>(CTNPlanList || initialContainerList);
    const [cTNActualList, setCTNActualList] = useState<APIModel.CTNActualList[]>(CTNActualList);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    const preBookingColumns: ColumnsType<APIModel.ContainerList> = [
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
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'FCL/LCL',
            dataIndex: 'IsFCL',
            key: 'IsFCL',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) => {
                return (
                    <ProFormSwitch
                        name={`IsFCL${record.ID}`}
                        initialValue={record.IsFCL}
                        checkedChildren="FCL"
                        unCheckedChildren="LCL"
                        fieldProps={{
                            onChange: (e) => handleRowChange(index, record.ID, 'IsFCL', e)
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

    const containersLoadingColumns: ColumnsType<APIModel.CTNActualList> = [
        {
            title: 'SIZE',
            dataIndex: 'CTNModelName',
            key: 'CTNModelName',
            width: '8%',
            align: "center",
        },
        {
            title: 'Container No.',
            dataIndex: "CTNNum",
            key: "CTNNum",
            width: '15%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`CTNNum${record.ID}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleCTNEdit(index, record.ID, 'CTNNum', e)
                        }}
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'Seal No.',
            dataIndex: "SealNum",
            key: "SealNum",
            width: '15%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`SealNum${record.ID}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleCTNEdit(index, record.ID, 'SealNum', e)
                        }}
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'QTY',
            dataIndex: "Pieces",
            key: "Pieces",
            width: '8%',
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`Pieces${record.ID}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleCTNEdit(index, record.ID, 'Pieces', e)
                        }}
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'VGM (kg)',
            dataIndex: "VGM",
            key: "VGM",
            width: '10%',
            className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`VGM${record.ID}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleCTNEdit(index, record.ID, 'VGM', e)
                        }}
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'G.W. (kg)',
            dataIndex: "GrossWeight",
            key: "GrossWeight",
            width: '10%',
            className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`GrossWeight${record.ID}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleCTNEdit(index, record.ID, 'GrossWeight', e)
                        }}
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'Meas. (cbm)',
            dataIndex: "Measurement",
            key: "Measurement",
            width: '10%',
            className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`Measurement${record.ID}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => handleCTNEdit(index, record.ID, 'Measurement', e)
                        }}
                        allowClear={false}
                    />
                );
            },
        },
        {
            title: 'Packaging Methods',
            dataIndex: "PKGTypeID",
            key: "PKGTypeID",
            className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <FormItem
                        name={`PKGTypeID${record.ID}`}
                        initialValue={record.PKGTypeNmae}>
                        <SearchModal
                            qty={20}
                            id={`PKGTypeID${record.ID}`}
                            title={'SIZE'}
                            modalWidth={500}
                            text={record.PKGTypeNmae}
                            query={{ SystemID: 4 }}
                            url={"/apiLocal/MCommon/GetPKGTypeByStr"}
                            handleChangeData={(val: any, option: any)=> handleCTNEdit(index, record.ID, 'PKGTypeID', val, option)}
                        />
                    </FormItem>
                );
            },
        }
    ];

    const rowSelection = {
        columnWidth: 30,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowIDs(selectedRowKeys)
        },
    };

    function handleRowChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        console.log(index)
        console.log(rowID)
        console.log(filedName)
    }

    function handleCTNEdit(index: number, rowID: any, filedName: string, val: any, option?: any) {
        console.log(index)
        console.log(rowID)
        console.log(filedName)
    }

    const handleAdd = () => {
        const newData: APIModel.ContainerList = {
            ID: `ID${(new Date().getTime())}`,
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

    //endregion

    return (
        <div className={styles.seaExportContainers}>
            <ProCard
                title={'Pre-booking Containers'}
                bordered={true}
                headerBordered
                collapsible
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                        <div className={styles.tableHeaderContainer}>
                            <Button onClick={handleAdd}><PlusCircleOutlined />Add</Button>
                            <Popconfirm
                                disabled={selectedRowIDs.length === 0}
                                title={'Sure to delete?'}
                                okText={'Yes'} cancelText={'No'}
                                onConfirm={() => handleDelete()}
                            >
                                <Button disabled={selectedRowIDs.length === 0}><DeleteOutlined />Remove</Button>
                            </Popconfirm>
                            <Button><DownloadOutlined />Export Manifest</Button>
                        </div>
                        <Table
                            rowKey={'ID'}
                            bordered
                            pagination={false}
                            columns={preBookingColumns}
                            dataSource={containerList}
                            locale={{emptyText: "NO DATA"}}
                            rowSelection={rowSelection}
                            className={`tableStyle ${styles.containerTable}`}
                        />
                    </Col>
                </Row>

            </ProCard>

            <ProCard
                title={'Containers Loading Detail'}
                bordered={true}
                headerBordered
                collapsible
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                        <div className={styles.tableHeaderContainer}>
                            <Button><SyncOutlined />Generate by Pre-booking</Button>
                            <Button><SwapOutlined />Devide Equally</Button>
                            <Button><CloudUploadOutlined />Subscribe Tracking & Tracing</Button>
                        </div>
                        <Table
                            rowKey={'ID'}
                            bordered
                            pagination={false}
                            columns={containersLoadingColumns}
                            dataSource={cTNActualList}
                            locale={{emptyText: "NO DATA"}}
                            rowSelection={rowSelection}
                            className={`tableStyle ${styles.containerTable}`}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20} className={styles.summary}>
                        <Space className={'siteSpace'}>
                            <div style={{ margin: '3px 3px 0 0' }}>Loading Summary</div>
                            <span className={'siteSpaceSpan'} />
                            <div className={'loading'}>
                                <span>QTY：<b>11</b></span>
                                <span>G.W.：<b>355.25</b></span>
                                <span>Meas：<b>1.525</b></span>
                            </div>
                        </Space>
                        <IconFont type={'icon-neq'} className={'iconfont'}/>
                        <Space className={'siteSpace'}>
                            <div className={'cargo'}>
                                <span>QTY：<b>13</b></span>
                                <span>G.W.：<b>355.25</b></span>
                                <span>Meas：<b>1.525</b></span>
                            </div>
                            <span className={'siteSpaceSpan'} />
                            <div style={{ margin: '3px 0 0 3px' }}>Cargo Summary</div>
                        </Space>
                    </Col>
                </Row>
            </ProCard>

        </div>

    )
}
export default Containers;