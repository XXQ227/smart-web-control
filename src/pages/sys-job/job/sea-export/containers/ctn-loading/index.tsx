import React, {useState} from 'react';
import {Button, Col, Form, message, Popconfirm, Row, Space, Table} from "antd";
import {ProCard, ProFormText} from "@ant-design/pro-components";
import {
    CloudUploadOutlined,
    DeleteOutlined,
    DownloadOutlined,
    PlusCircleOutlined,
    SwapOutlined,
    SyncOutlined
} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchModal from "@/components/SearchModal";
import {IconFont, ID_STRING, keepDecimal} from "@/utils/units";

interface Props {
    type?: string;
    form?: any;
    CTNActualList?: APIModel.CTNActualList[];
    containerList: APIModel.ContainerList[];
    cargoInfo: any;
    handleCTNEdit: (index: number, rowID: any, filedName: string, val: any, option?: any) => void;
    handleDelete: () => void;
}

const FormItem = Form.Item;


const CTNLoading: React.FC<Props> = (props) => {
    const {
        type, form,
        CTNActualList, containerList, cargoInfo,
        handleCTNEdit, handleDelete
    } = props;

    const [cTNActualList, setCTNActualList] = useState<APIModel.CTNActualList[]>(CTNActualList || []);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    const [loadingSummary, setLoadingSummary] = useState<any>({qty: 0, grossWeight: 0, measurement: 0});

    function handleRowChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        console.log(index)
        console.log(rowID)
        console.log(filedName)
    }

    /**
     * @Description: TODO: 实装箱信息修改
     * @author XXQ
     * @date 2023/8/1
     * @param index
     * @param rowID
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    function onChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        handleCTNEdit(index, rowID, filedName, val, option);
    }

    const rowSelection = {
        columnWidth: 30,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowIDs(selectedRowKeys)
        },
    };

    const handleAdd = () => {
        const newData: APIModel.CTNActualList = {
            id: ID_STRING(),
            qty: 0,
            VGM: 0,
            grossWeight: 0,
            measurement: 0,
        };
        setCTNActualList([...cTNActualList, newData]);
    };


    /**
     * @Description: TODO: 引入预配箱信息，生成为一个个的实装
     * @author XXQ
     * @date 2023/8/1
     * @returns
     */
    function handlePreBooking() {
        if (containerList?.length > 0) {
            let actualArr: APIModel.CTNActualList[] = [];
            containerList.map((item: any) => {
                const obj: APIModel.CTNActualList = {
                    id: ID_STRING(), ctnModelId: item.ctnModelId, ctnModelName: item.ctnModelName
                };
                // TODO: 当箱量大于 1 时。循环箱量
                if (item.qty > 1) {
                    for (let i = 1; i <= item.qty; i++) {
                        actualArr.push(obj);
                    }
                } else {
                    actualArr.push(obj);
                }
            });
            // TODO: 设置 id 值
            if (actualArr?.length > 0) {
                actualArr = actualArr.map((item: any, index: number) => ({...item, id: ID_STRING() + index}));
            }
            setCTNActualList(actualArr);
        }
    }

    /**
     * @Description: TODO: 把货物均分到每个箱里。超出部门放到第一个箱子里
     * @author XXQ
     * @date 2023/8/2
     * @returns
     */
    function handleDivideEqually() {

        if (cTNActualList?.length > 0) {
            const ctnQty = cTNActualList?.length || 1;

            // TODO: 用于动态更新 container 的件重尺 数据
            const setValueObj = {};

            // TODO: 计算每一份的值
            const qtyPerPart = Math.floor(cargoInfo.qty / ctnQty);
            const grossWeightPerPart = Math.floor(cargoInfo.grossWeight / ctnQty);
            const measurementPerPart = Math.floor(cargoInfo.measurement / ctnQty);

            console.log(grossWeightPerPart, qtyPerPart, measurementPerPart);
            // TODO: 计算剩余的值
            const qtyRemainder = keepDecimal(cargoInfo.qty - qtyPerPart * ctnQty, 6) || 0;
            const grossWeightRemainder = keepDecimal(cargoInfo.grossWeight - grossWeightPerPart * ctnQty, 6) || 0;
            const measurementRemainder = keepDecimal(cargoInfo.measurement - measurementPerPart * ctnQty, 6) || 0;

            console.log(grossWeightRemainder, qtyRemainder, measurementRemainder);
            // TODO: 把均分的件重尺放到每一个箱中
            let actualArr: any[] = cTNActualList.map((item: any)=> ({
                ...item,
                qty: qtyPerPart,
                grossWeight: grossWeightPerPart,
                measurement: measurementPerPart,
            }));
            // TODO: 把出来的数量放到第一个箱中
            actualArr = actualArr.map((item: any, index: number)=> {
                if (index === 0) {
                    item.qty += qtyRemainder;
                    item.grossWeight += grossWeightRemainder;
                    item.measurement += measurementRemainder;
                }
                setValueObj[`qty_table_${item.id}`] = item.qty;
                setValueObj[`grossWeight_table_${item.id}`] = item.grossWeight;
                setValueObj[`measurement_table_${item.id}`] = item.measurement;
                return item;
            });

            setCTNActualList(actualArr);
            setLoadingSummary(cargoInfo);
            form.setFieldsValue(setValueObj);
        } else {
            message.warn('Please add container details');
        }
    }

    //endregion

    const containersLoadingColumns: ColumnsType<APIModel.CTNActualList> = [
        {title: 'SIZE', dataIndex: 'ctnModelName', width: '8%', align: "center",},
        {
            title: 'Container No.', dataIndex: "containerNum", width: '15%', className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        required
                        placeholder={''}
                        initialValue={text}
                        name={`CTNNum_table_${record.id}`}
                        rules={[{required: true, message: 'Container No.'}]}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'containerNum', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'Seal No.', dataIndex: "sealNum", width: '15%', className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        name={`SealNum_table_${record.id}`}
                        initialValue={text}
                        placeholder={''}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'sealNum', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'qty', dataIndex: "qty", width: '8%', className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        required
                        placeholder={''}
                        initialValue={text}
                        name={`qty_table_${record.id}`}
                        rules={[{required: true, message: 'QTY'}]}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'Pieces', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'G.W. (kg)', dataIndex: "grossWeight", width: '10%', className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        required
                        placeholder={''}
                        initialValue={text}
                        name={`grossWeight_table_${record.id}`}
                        rules={[{required: true, message: 'G.W.'}]}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'grossWeight', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'Meas. (cbm)', dataIndex: "measurement", width: '10%', className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        required
                        placeholder={''}
                        initialValue={text}
                        name={`measurement_table_${record.id}`}
                        rules={[{required: true, message: 'Meas.'}]}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'measurement', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'VGM (kg)', dataIndex: "vgm", width: '10%', className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        placeholder={''}
                        initialValue={text}
                        name={`vgm_table_${record.id}`}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'vgm', e)
                        }}
                    />
                );
            },
        },
        {
            title: 'Packaging Methods', dataIndex: "packagingMethodId", className: "textCenter",
            render: (text: any, record, index) => {
                return (
                    <FormItem
                        name={`packagingMethodId_table_${record.id}`}
                        initialValue={record.packagingMethodName}
                    >
                        <SearchModal
                            qty={20}
                            title={'SIZE'}
                            modalWidth={500}
                            query={{SystemID: 4}}
                            text={record.packagingMethodName}
                            // id={`packagingMethodId_table_${record.id}`}
                            url={"/apiLocal/MCommon/GetPKGTypeByStr"}
                            handleChangeData={(val: any, option: any) => onChange(index, record.id, 'packagingMethodId', val, option)}
                        />
                    </FormItem>
                );
            },
        }
    ];

    if (type === 'import') {
        containersLoadingColumns.splice(0, 1,
            {
                title: 'SIZE',
                dataIndex: 'ctnModelId',
                width: '10%',
                className: "textCenter",
                render: (text: any, record, index) => {
                    return (
                        <FormItem name={`ctnModelId_table_${record.id}`} initialValue={record.ctnModelName}>
                            <SearchModal
                                qty={30}
                                title={'SIZE'}
                                modalWidth={500}
                                text={record.ctnModelName}
                                query={{dictCode: "ctn_model"}}
                                url={"/apiBase/dict/queryDictDetailCommon"}
                                handleChangeData={(val: any, option: any) => handleRowChange(index, record.id, 'ctnModelId', val, option)}
                            />
                        </FormItem>
                    );
                },
            },
            {
                title: 'Yard Container No.',
                dataIndex: "YardCTNNum",
                className: "textCenter",
                render: (text: any, record, index) => {
                    return (
                        <ProFormText
                            placeholder={''}
                            initialValue={text}
                            name={`YardCTNNum_table_${record.id}`}
                            fieldProps={{
                                onChange: (e) => onChange(index, record.id, 'YardCTNNum', e)
                            }}
                            allowClear={false}
                        />
                    );
                },
            }
        );
        containersLoadingColumns.splice(5, 1);
        containersLoadingColumns.splice(7, 1, {
            title: 'Tare Weight',   dataIndex: "TareWeight", width: '10%', className: "textRight",
            render: (text: any, record, index) => {
                return (
                    <ProFormText
                        placeholder={''}
                        initialValue={text}
                        name={`TareWeight_table_${record.id}`}
                        fieldProps={{
                            onChange: (e) => onChange(index, record.id, 'TareWeight', e)
                        }}
                    />
                );
            },
        });
    }

    let iconFortStr = 'icon-neq';
    if (
        loadingSummary.qty === cargoInfo.qty
        && loadingSummary.grossWeight === cargoInfo.grossWeight
        && loadingSummary.measurement === cargoInfo.measurement
    ) {
        iconFortStr = 'icon-equal-to'
    }

    return (
        <ProCard title={'Containers Loading Detail'} bordered headerBordered collapsible>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                    {/* 进口隐藏 */}
                    <div hidden={type === 'import'} className={'tableHeaderContainer'}>
                        <Button onClick={handlePreBooking} icon={<SyncOutlined/>}>Generate by Pre-booking</Button>
                        <Button onClick={handleDivideEqually} icon={<SwapOutlined/>}>Divide Equally</Button>
                        <Button icon={<CloudUploadOutlined/>}>Subscribe Tracking & Tracing</Button>
                    </div>
                    {/* 进口显示 */}
                    <div hidden={type !== 'import'} className={'tableHeaderContainer'}>
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
                    </div>
                    <Table
                        bordered
                        rowKey={'id'}
                        pagination={false}
                        dataSource={cTNActualList}
                        rowSelection={rowSelection}
                        locale={{emptyText: "NO DATA"}}
                        columns={containersLoadingColumns}
                        className={`tableStyle containerTable`}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20} className={'summary'}>
                    <Space className={'siteSpace'}>
                        <div style={{margin: '3px 3px 0 0'}}>Loading Summary</div>
                        <span className={'siteSpaceSpan'}/>
                        <div className={'loading'}>
                            <span>qty：<b>{loadingSummary.qty}</b></span>
                            <span>G.W.：<b>{loadingSummary.grossWeight}</b></span>
                            <span>Meas：<b>{loadingSummary.measurement}</b></span>
                        </div>
                    </Space>
                    <IconFont type={iconFortStr} className={'iconfont'}/>
                    <Space className={'siteSpace'}>
                        <div className={'cargo'}>
                            <span>qty：<b>{cargoInfo.qty}</b></span>
                            <span>G.W.：<b>{cargoInfo.grossWeight}</b></span>
                            <span>Meas：<b>{cargoInfo.measurement}</b></span>
                        </div>
                        <span className={'siteSpaceSpan'}/>
                        <div style={{margin: '3px 0 0 3px'}}>Cargo Summary</div>
                    </Space>
                </Col>
            </Row>
        </ProCard>
    )
}
export default CTNLoading;