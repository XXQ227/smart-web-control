import React, {useEffect, useState} from 'react';
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
import ls from 'lodash'
import * as XLSX from 'xlsx'
import ParseExcel from '@/components/ParseExcel'
import {useModel} from 'umi'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'

const FormItem = Form.Item;

interface Props {
    form?: any;
    type?: string;
    serviceId: string;
    containerList: any[];
    handleProFormValueChange: (value: any) => void,
}

const CTNLoading: React.FC<Props> = (props) => {
    const {type, form, containerList, serviceId} = props;

    const {CargoInfo} = useModel('job.job', (res: any) => ({CargoInfo: res.CargoInfo}))
    const {queryDictCommonReturn} = useModel('common', (res: any) => ({queryDictCommonReturn: res.queryDictCommonReturn,}))

    const [cTNActualList, setCTNActualList] = useState<APIModel.CTNActualList[]>(containerList);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    const [loadingSummary, setLoadingSummary] = useState<any>({qty: 0, grossWeight: 0, measurement: 0});

    useEffect(()=> {
        if (cTNActualList?.length > 0 && loadingSummary.qty === 0) {
            getCtnBalance(cTNActualList);
        }
    }, [cTNActualList, loadingSummary.qty])


    // TODO: 多选
    const rowSelection = {
        columnWidth: 30,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowIDs(selectedRowKeys)
        },
    };

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
        const newData: any[] = ls.cloneDeep(cTNActualList);
        const target = newData.find((item: any)=> item.id === rowID);
        target[filedName] = val?.target ? val.target.value : val;
        // TODO: 需要存箱型名字
        if (filedName === 'ctnModelId') {
            target.ctnModelName = option.label;
        }
        newData.splice(index, 1, target);
        // TODO: 当 【件、重、尺】 有编辑时，需要重新计算 【Loading Summary】 的值
        if (['qty', 'grossWeight', 'measurement'].includes(filedName)) {
            getCtnBalance(newData);
        }
        form.setFieldsValue({
            [`${filedName}_table_${target.id}`]: target[filedName],
            containersLoadingDetailEntityList: newData
        });
        setCTNActualList(newData);
        props.handleProFormValueChange({
            [`${filedName}_table_${target.id}`]: target[filedName],
            containersLoadingDetailEntityList: newData
        });
    }

    // TODO: 添加箱量
    const handleAdd = () => {
        const newData: APIModel.CTNActualList = {id: ID_STRING(),};
        form.setFieldsValue({'containersLoadingDetailEntityList': newData});
        setCTNActualList([...cTNActualList, newData]);
    };

    // TODO: 删除箱量
    const handleDelete = () => {
        const newData = cTNActualList.slice(0).filter((item: any)=> !selectedRowIDs.includes(item.id));
        form.setFieldsValue({'containersLoadingDetailEntityList': newData});
        setCTNActualList(newData);
        setSelectedRowIDs([]);
    };

    //region TODO: 引入预配箱信息、把货信息的 【件、重、尺】 均分到每个箱中
    /**
     * @Description: TODO: 引入预配箱信息，生成为一个个的实装
     * @author XXQ
     * @date 2023/8/1
     * @returns
     */
    const handlePreBooking = ()=> {
        // TODO: 预配箱的箱量
        const preBookingList: any[] = form.getFieldValue('preBookingContainersEntityList') || [];
        if (preBookingList?.length > 0) {
            let actualArr: APIModel.CTNActualList[] = [];
            preBookingList.map((item: any) => {
                const obj: APIModel.CTNActualList = {
                    id: ID_STRING(), ctnModelId: item.ctnModelId, ctnModelName: item.ctnModelName, serviceId
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
            const qtyPerPart = Math.floor(CargoInfo.qty / ctnQty);
            const grossWeightPerPart = Math.floor(CargoInfo.grossWeight / ctnQty);
            const measurementPerPart = Math.floor(CargoInfo.measurement / ctnQty);

            // TODO: 计算剩余的值
            const qtyRemainder = keepDecimal(CargoInfo.qty - qtyPerPart * ctnQty, 6) || 0;
            const grossWeightRemainder = keepDecimal(CargoInfo.grossWeight - grossWeightPerPart * ctnQty, 6) || 0;
            const measurementRemainder = keepDecimal(CargoInfo.measurement - measurementPerPart * ctnQty, 6) || 0;

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
            setValueObj['containersLoadingDetailEntityList'] = actualArr;
            getCtnBalance(actualArr);
            setCTNActualList(actualArr);
            setLoadingSummary(CargoInfo);
            form.setFieldsValue(setValueObj);
        } else {
            message.warn('Please add container details');
        }
    }
    //endregion

    //region TODO: 解析 excel 数据
    /**
     * @Description: TODO: 解析 excel 数据
     * @author XXQ
     * @date 2023/8/3
     * @param file  文档数据
     * @returns
     */
    const handleParseExcel = (file: any)=> {
        if (file) {
            if (file.name?.indexOf('.xls') > -1 || file.name?.indexOf('.xlsx') > -1) {
                const reader = new FileReader();
                reader.onload = async (event: any) => {
                    const data = event.target.result;

                    // TODO: 文档解析数据
                    const workbook = XLSX.read(data, { type: 'binary' });
                    // TODO: sheet 页面名
                    const sheetName = workbook.SheetNames[0];
                    // TODO: 表格数据
                    const worksheet = workbook.Sheets[sheetName];
                    // TODO: 解析完成的 excel 数据
                    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    // TODO: 处理解析后的数据 excelData
                    if (excelData?.length > 2) {
                        // TODO: excel 第一行：数据 label 行
                        const excelTitleRow: string[] = [];
                        // TODO: 数据转小写
                        // @ts-ignore
                        excelData[0].map((item: any) => item?.trim() && excelTitleRow.push(item.trim().toLowerCase()));

                        // TODO: 把 excel 数据生成 json 数据；【slice() 用于提取数组中的一部分元素，创建一个新的数组并返回，而不会修改原始数组】
                        let targetArray: APIModel.CTNActualList[] = excelData.slice(1).map((row: any) => {
                            const [ctnModelName, containerNum, sealNum, vgm, qty, grossWeight, measurement] = row;
                            return {
                                ctnModelName, containerNum, sealNum,
                                vgm: typeof vgm === "number" ? vgm : null,
                                qty: typeof qty === "number" ? qty : null,
                                grossWeight: typeof grossWeight === "number" ? grossWeight : null,
                                measurement: typeof measurement === "number" ? measurement : null,
                            };
                        });

                        // TODO: 获取箱型的 id 信息
                        if (targetArray?.length > 0) {
                            // TODO: 从接口获取数据，找到对应的箱型，匹配上对应的
                            const ctnSizeApi: any[] = await queryDictCommonReturn({dictCodes: ['ctn_model']});
                            const ctnSizeResult: any[] = ctnSizeApi.find((item: any) => item.dictCode === 'ctn_model')?.data || [];
                            // TODO: 当有箱型不在系统存在的箱型，用于弹框提醒
                            const missCtnSizeArr: string[] = [];
                            // TODO: 遍历数据，整理箱型信息
                            targetArray = targetArray.map((item: any, index: number) => {
                                item.id = ID_STRING() + index;
                                // TODO: 找到对应箱型的 id
                                const ctnSizeObj: any = ctnSizeResult?.find((x: any) => x.label === item.ctnModelName) || {};
                                // TODO: 更新箱型 id 数据
                                if (ctnSizeObj.value) {
                                    item.ctnModelId = ctnSizeObj.value;
                                    item.ctnModelName = ctnSizeObj.label;
                                    return item;
                                }
                                // TODO: 获取系统不存在的箱型数据
                                else if (!missCtnSizeArr.includes(item.ctnModelName)) {
                                    missCtnSizeArr.push(item.ctnModelName);
                                }
                            })
                            targetArray = targetArray.filter(item => !!item);
                            // TODO: 当有箱型不在系统存在时，做出警告提示
                            if (missCtnSizeArr?.length > 0) {
                                message.warn(`【${missCtnSizeArr}】The container type does not exist in the system, please contact the administrator to add it.`);
                            }
                            // TODO: 当存在有数据时，把数据加到箱信息中
                            if (targetArray?.length > 0) {
                                setCTNActualList(targetArray);
                                getCtnBalance(targetArray);
                                form.setFieldsValue({'containersLoadingDetailEntityList': targetArray});
                            }
                        }
                    } else {
                        message.warn(`Please enter container information.`);
                    }
                };
                reader.readAsBinaryString(file);
            } else {
                message.error("选择Excel格式的文件导入!");
            }
        }
    }
    // endregion

    //region // TODO: 算  Loading Summary 的数据
    /**
     * @Description: TODO: 获取箱型箱量分配到的件重尺总的数量
     * @author XXQ
     * @date 2023/8/7
     * @param data  箱信息数据集
     * @returns
     */
    function getCtnBalance(data: any[]) {
        if (data?.length > 0) {
            // TODO: 计算 ctn 数组中的 qty、grossWeight 和 measurement 总和
            const ctnQtyTotal = data.reduce((total, item) => total + Number(item.qty || 0), 0);
            const ctnGrossWeightTotal = data.reduce((total, item) => total + Number(item.grossWeight || 0), 0);
            const ctnMeasurementTotal = data.reduce((total, item) => total + Number(item.measurement || 0), 0);

            // TODO: Container 总的 件重尺数量
            const ctnTotal: any = {
                qty: ctnQtyTotal,
                grossWeight: ctnGrossWeightTotal,
                measurement: ctnMeasurementTotal
            };
            setLoadingSummary(ctnTotal);
        }
    }

    //endregion

    const containersLoadingColumns: ColumnsType<APIModel.CTNActualList> = [
        {title: 'SIZE', dataIndex: 'ctnModelName', width: '8%', align: "center",},
        {
            title: 'Container No.', dataIndex: "containerNum", width: '15%', className: "textCenter",
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    initialValue={text}
                    name={`CTNNum_table_${record.id}`}
                    rules={[{required: true, message: 'Container No.'}]}
                    onChange={(val: any) => onChange(index, record.id, 'containerNum', val)}
                />
        },
        {
            title: 'Seal No.', dataIndex: "sealNum", width: '15%', className: "textCenter",
            render: (text: any, record, index) =>
                <FormItemInput
                    initialValue={text}
                    name={`SealNum_table_${record.id}`}
                    onChange={(val: any) => onChange(index, record.id, 'sealNum', val)}
                />
        },
        {
            title: 'QTY', dataIndex: "qty", width: '8%', className: "textCenter",
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    initialValue={text}
                    name={`qty_table_${record.id}`}
                    rules={[{required: true, message: 'QTY'}]}
                    onChange={(val: any) => onChange(index, record.id, 'qty', val)}
                />
        },
        {
            title: 'G.W. (kg)', dataIndex: "grossWeight", width: '10%', className: "textRight",
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    initialValue={text}
                    name={`grossWeight_table_${record.id}`}
                    rules={[{required: true, message: 'G.W.'}]}
                    onChange={(val: any) => onChange(index, record.id, 'grossWeight', val)}
                />
        },
        {
            title: 'Meas. (cbm)', dataIndex: "measurement", width: '10%', className: "textRight",
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    initialValue={text}
                    name={`measurement_table_${record.id}`}
                    rules={[{required: true, message: 'Meas.'}]}
                    onChange={(val: any) => onChange(index, record.id, 'measurement', val)}
                />
        },
        {
            title: 'VGM (kg)', dataIndex: "vgm", width: '10%', className: "textRight",
            render: (text: any, record, index) =>
                <FormItemInput
                    initialValue={text}
                    name={`vgm_table_${record.id}`}
                    onChange={(val: any) => onChange(index, record.id, 'vgm', val)}
                />
        },
        {
            title: 'Packaging Methods', dataIndex: "packagingMethodId", className: "textCenter",
            render: (text: any, record, index) =>
                <FormItem
                    name={`packagingMethodId_table_${record.id}`}
                    initialValue={record.packagingMethodName}
                >
                    <SearchModal
                        qty={20}
                        modalWidth={500}
                        query={{SystemID: 4}}
                        title={'Packaging Methods'}
                        text={record.packagingMethodName}
                        url={"/apiLocal/MCommon/GetPKGTypeByStr"}
                        handleChangeData={(val: any, option: any) => onChange(index, record.id, 'packagingMethodId', val, option)}
                    />
                </FormItem>
        }
    ];

    // TODO: 进口显示其他选项
    if (type === 'import') {
        containersLoadingColumns.splice(0, 1,
            {
                title: 'SIZE', dataIndex: 'ctnModelId', width: '10%', className: "textCenter",
                render: (text: any, record, index) =>
                    <FormItem
                        name={`ctnModelId_table_${record.id}`}
                        initialValue={record.ctnModelName}
                        required rules={[{required: true, message: 'SIZE'}]}
                    >
                        <SearchModal
                            qty={30}
                            title={'SIZE'}
                            modalWidth={500}
                            text={record.ctnModelName}
                            query={{dictCode: "ctn_model"}}
                            url={"/apiBase/dict/queryDictDetailCommon"}
                            handleChangeData={(val: any, option: any) => onChange(index, record.id, 'ctnModelId', val, option)}
                        />
                    </FormItem>
            },
            {
                title: 'Yard Container No.', dataIndex: "yardContainerNum", className: "textCenter",
                render: (text: any, record, index) =>
                    <FormItemInput
                        initialValue={text}
                        name={`yardContainerNum_table_${record.id}`}
                        onChange={(val: any) => onChange(index, record.id, 'yardContainerNum', val)}
                    />
            }
        );
        containersLoadingColumns.splice(7, 2, {
            title: 'Tare Weight',   dataIndex: "TareWeight", width: '10%', className: "textRight",
            render: (text: any, record, index) =>
                <FormItemInput
                    initialValue={text}
                    name={`TareWeight_table_${record.id}`}
                    onChange={(val: any) => onChange(index, record.id, 'tareWeight', val)}
                />
        });
    }

    let iconFortStr = 'icon-neq', isEqual = !(cTNActualList?.length > 0);
    if (
        loadingSummary.qty === CargoInfo.qty
        && loadingSummary.grossWeight === CargoInfo.grossWeight
        && loadingSummary.measurement === CargoInfo.measurement
    ) {
        iconFortStr = 'icon-equal-to';
        isEqual = true;
    }

    return (
        <ProCard title={'Containers Loading Detail'} bordered headerBordered collapsible className={'ant-card'}>
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
                        <Button icon={<PlusCircleOutlined/>} onClick={handleAdd}>Add</Button>
                        <Popconfirm
                            disabled={selectedRowIDs.length === 0}
                            title={'Sure to delete?'}
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleDelete()}
                        >
                            <Button icon={<DeleteOutlined/>} disabled={selectedRowIDs.length === 0}>Remove</Button>
                        </Popconfirm>
                        <Button icon={<DownloadOutlined/>}>Export Manifest</Button>
                        <ParseExcel label={'Parse Excel'} onChange={handleParseExcel}/>
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

                    {/* // TODO: 用于保存时，获取数据用 */}
                    <ProFormText hidden={true} name={'containersLoadingDetailEntityList'} />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20} className={'summary'}>
                    <Space className={'siteSpace'}>
                        <div style={{margin: '0 3px 1px 0'}}>Loading Summary</div>
                        <span className={'siteSpaceSpan'}/>
                        <div className={'loading'}>
                            <span>QTY：<b>{loadingSummary.qty}</b></span>
                            <span>G.W.：<b>{loadingSummary.grossWeight}</b></span>
                            <span>Meas：<b>{loadingSummary.measurement}</b></span>
                        </div>
                    </Space>
                    <IconFont type={iconFortStr} className={'iconfont'}/>
                    <Space className={'siteSpace'}>
                        <div className={'cargo'}>
                            <span>QTY：<b>{CargoInfo.qty}</b></span>
                            <span>G.W.：<b>{CargoInfo.grossWeight}</b></span>
                            <span>Meas：<b>{CargoInfo.measurement}</b></span>
                        </div>
                        <span className={'siteSpaceSpan'}/>
                        <div style={{marginLeft: '3px'}}>Cargo Summary</div>
                    </Space>
                    {/* // TODO: 用于验证箱型的【件重尺】是否跟 【CargoInfo】中的匹配 */}
                    <ProFormText
                        hidden={true}
                        required={!isEqual} name={'requiredCtn'}
                        rules={[{required: !isEqual, message: 'Loading Summary !== Cargo Summary !!!'}]}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default CTNLoading;