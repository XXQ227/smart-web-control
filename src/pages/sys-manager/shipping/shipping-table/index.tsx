import React, {Fragment, useEffect, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import {ProTable} from '@ant-design/pro-components'
import {DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import {Button, Divider, Form, Input, message, Popconfirm} from 'antd'
import {IconFont, getFormErrorMsg, ID_STRING} from "@/utils/units";
import ls from 'lodash'
import {history} from "@@/core/history";
import FormItemInput from "@/components/FormItemComponents/FormItemInput";
import SearchModal from "@/components/SearchModal";
import DividerCustomize from "@/components/Divider";
import {BRANCH_ID} from '@/utils/auths'

const {Search} = Input;

type APIVoyage = APIManager.Voyage;
type APIVessel = APIManager.Vessel;
type APILine = APIManager.Line;
type APISearchShipping = APIManager.SearchShippingParams;

const initSearchParam = {name: '', currentPage: 1, pageSize: 20,};

interface Props {
    type: string,
    queryAPI: any,
    deleteAPI?: any,
    operateAPI?: any,
    addAPI?: any,
    editAPI?: any,
}

const ShippingTable: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const {type, queryAPI, deleteAPI, operateAPI, addAPI, editAPI,} = props;

    const [searchParams, setSearchParams] = useState<APISearchShipping>(initSearchParam);
    const [loading, setLoading] = useState<boolean>(false);
    const [ShippingListVO, setShippingListVO] = useState<any[]>([]);

    useEffect(()=> {
        if (searchParams?.name) {
            searchParams.name = ''
        }
    }, [type])

    /**
     * @Description: TODO 获取港口列表
     * @author LLS
     * @date 2023/6/5
     * @param params    参数
     * @returns
     */
    async function handleGetShippingList(params: APISearchShipping) {
        setLoading(true);
        const result: API.Result = await queryAPI(params);
        setShippingListVO(result.data || []);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑 船代 信息
     * @author LLS
     * @date 2023/6/12
     * @param record    操作当前行
     * @returns
     */
    const handleEditShipping = (record: any) => {
        if (type === 'Voyage') {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            const url = `/manager/shipping/voyage/form/${btoa(record.id)}`;
            // TODO: 跳转页面<带参数>
            history.push({pathname: url})
        } else {
            const newData: any[] = ls.cloneDeep(ShippingListVO) || [];
            const rowKey = ID_STRING();
            newData.splice(0, 0, {id: rowKey,});
            setShippingListVO(newData);
        }
    }

    /**
     * @Description: TODO: 编辑当前行
     * @author LLS
     * @date 2023/6/13
     * @param index     当前行序号
     * @param record    操作行数据
     * @param filedName 编辑字段
     * @param val       编辑值
     * @returns
     */
    const handleChangeShipping = (index: number, record: any, filedName: string, val: any) => {
        const newData: any[] = ls.cloneDeep(ShippingListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setShippingListVO(newData);
    }

    const handleSaveShipping = async (index: number, record: any, state?: string) => {
        form.validateFields()
            .then(async ()=> {
                setLoading(true);
                let result: API.Result;
                const newData: any[] = ls.cloneDeep(ShippingListVO);
                // TODO: 保存、添加 公共参数
                let params: any;
                if (type === 'Vessel') {
                    // 新增船舶参数
                    params = {
                        name: record.name,
                        code: record.code,
                        callSign: record.callSign,
                        imoNum: record.imoNum,
                        branchId: "1665596906844135426",
                        carrierId: 0,
                    };
                } else {
                    // 新增航线参数
                    params = {
                        name: record.name,
                        areaCode: record.areaCode,
                        serverId: record.serverId,
                        branchId: "1665596906844135426",
                        carrierId: 0,
                    };
                }
                // TODO: 添加
                if (state === 'add') {
                    result = await addAPI(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editAPI(params);
                }
                record.isChange = false;
                newData.splice(index, 1, record);
                if (result.success) {
                    message.success('Success');
                    setShippingListVO(newData);
                } else {
                    message.error(result.message);
                }
                setLoading(false);
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    const handleOperateShipping = async (index: number, record: any, state: string) => {
        setLoading(true);
        let result: API.Result;
        const newData: any[] = ls.cloneDeep(ShippingListVO);
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        // TODO: 删除
        if (state === 'delete') {
            // TODO: 本地删除，不调接口 <未创建的数据>
            if (record.id.indexOf('ID_') > -1) {
                result = {success: true};
            } else {
                result = await deleteAPI(params);
            }
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateAPI(params);
            // TODO: 冻结成功后，把当前行冻结状态调整
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('Success');
            setShippingListVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);

    }

    console.log(ShippingListVO);

    const voyageColumns: ProColumns<APIVoyage>[] = [
        {title: 'Voyage', dataIndex: 'name', width: 120, ellipsis: true,},
        {title: 'Vessel Name', dataIndex: 'vesselName', ellipsis: true,},
        {title: 'Shipping Line', dataIndex: 'lineName', ellipsis: true,},
        {title: 'ETD', dataIndex: 'etd', valueType: "date", width: 110, align: 'center', ellipsis: true,},
        {
            title: 'Action', width: 110, align: 'center', className: 'cursorStyle',
            render: (text, record, index) => {
                console.log(!!record.enableFlag);
                return (
                    <Fragment>
                        <EditOutlined
                            onClick={() => handleEditShipping(record)}
                            color={'#1765AE'} hidden={!!record.enableFlag}
                        />
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateShipping(index, record, 'freeze')}
                        >
                            <DividerCustomize hidden={!!record.enableFlag} />
                            <IconFont type={!!record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateShipping(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'} placement={'topRight'}
                        >
                            <Divider type='vertical'/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    const vesselColumns: ProColumns<APIVessel>[] = [
        {
            title: 'Vessel Name',
            dataIndex: 'name',
            width: 180,
            tooltip: 'Vessel Name is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`name${record.id}`}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    disabled={record.enableFlag}
                    rules={[{required: true, message: 'Vessel Name'}]}
                    onChange={(val: any) => handleChangeShipping(index, record, 'name', val)}
                />
        },
        {
            title: 'Code',
            dataIndex: 'code',
            width: 120,
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`code${record.id}`}
                    name={`code${record.id}`}
                    initialValue={record.code}
                    disabled={record.enableFlag}
                    rules={[{required: true, message: 'Code'}]}
                    onChange={(val: any) => handleChangeShipping(index, record, 'code', val)}
                />
        },
        {
            title: 'Call Sign',
            dataIndex: 'callSign',
            width: 120,
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`callSign${record.id}`}
                    name={`callSign${record.id}`}
                    initialValue={record.callSign}
                    disabled={record.enableFlag}
                    onChange={(val: any) => handleChangeShipping(index, record, 'callSign', val)}
                />
        },
        {
            title: 'IMO No.',
            dataIndex: 'imoNum',
            width: 120,
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`imoNum${record.id}`}
                    name={`imoNum${record.id}`}
                    initialValue={record.imoNum}
                    disabled={record.enableFlag}
                    onChange={(val: any) => handleChangeShipping(index, record, 'imoNum', val)}
                />
        },
        {
            title: 'Carrier',
            dataIndex: 'carrierId',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                /*<FormItemInput
                    required
                    placeholder=''
                    id={`code${record.id}`}
                    name={`code${record.id}`}
                    initialValue={record.code}
                    disabled={record.enableFlag}
                    rules={[{required: true, message: 'Code'}]}
                    onChange={(val: any) => handleChangeShipping(index, record, 'code', val)}
                />*/
                <SearchModal
                    qty={20}
                    id={'carrierId'}
                    title={'Shipment Term'}
                    modalWidth={500}
                    value={record.carrierId}
                    text={record.carrierName}
                    disabled={!!record.enableFlag}
                    url={"/api/MCommon/GetServiceType"}
                    handleChangeData={(val: any, option: any) => handleChangeShipping(index, record, 'carrierId', val)}
                />
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveShipping(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateShipping(index, record, 'freeze')}
                        >
                            <DividerCustomize hidden={!record.isChange} />
                            <IconFont
                                hidden={isAdd}
                                type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}
                            />
                        </Popconfirm>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            title={`Sure to delete?`}
                            onConfirm={() => handleOperateShipping(index, record, 'delete')}
                        >
                            <DividerCustomize hidden={isAdd}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            }
        },
    ];

    const lineColumns: ProColumns<APILine>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
            tooltip: 'Name is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`name${record.id}`}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    disabled={record.enableFlag}
                    rules={[{required: true, message: 'Name'}]}
                    onChange={(val: any) => handleChangeShipping(index, record, 'name', val)}
                />
        },
        {
            title: 'Area Code',
            dataIndex: 'areaCode',
            width: 120,
            tooltip: 'Area Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`areaCode${record.id}`}
                    name={`areaCode${record.id}`}
                    initialValue={record.areaCode}
                    disabled={record.enableFlag}
                    rules={[{required: true, message: 'Area Code'}]}
                    onChange={(val: any) => handleChangeShipping(index, record, 'areaCode', val)}
                />
        },
        {
            title: 'Service ID',
            dataIndex: 'serverId',
            width: 120,
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    id={`serverId${record.id}`}
                    name={`serverId${record.id}`}
                    initialValue={record.serverId}
                    disabled={record.enableFlag}
                    onChange={(val: any) => handleChangeShipping(index, record, 'serverId', val)}
                />
        },
        {
            title: 'Carrier',
            dataIndex: 'carrierId',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <SearchModal
                    qty={20}
                    id={'carrierId'}
                    title={'Shipment Term'}
                    modalWidth={500}
                    value={record.carrierId}
                    text={record.carrierName}
                    disabled={!!record.enableFlag}
                    query={{branchId: BRANCH_ID(), buType: 1}}
                    url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                    handleChangeData={(val: any, option: any) => handleChangeShipping(index, record, 'carrierId', val)}
                />
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveShipping(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateShipping(index, record, 'freeze')}
                        >
                            <DividerCustomize hidden={!record.isChange} />
                            <IconFont
                                hidden={isAdd}
                                type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}
                            />
                        </Popconfirm>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            title={`Sure to delete?`}
                            onConfirm={() => handleOperateShipping(index, record, 'delete')}
                        >
                            <DividerCustomize hidden={isAdd}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            }
        }
    ];

    let columns: any[] = []
    let className = 'ant-pro-table-edit';
    if (type === 'Voyage') {
        columns = voyageColumns
        className = 'antd-pro-table-port-list';
    } else if (type === 'Vessel') {
        columns = vesselColumns
    } else if (type === 'Line') {
        columns = lineColumns
    }

    return (
        <Form form={form}>
            <ProTable
                rowKey={'id'}
                search={false}
                options={false}
                bordered={true}
                loading={loading}
                columns={columns}
                params={searchParams}
                dataSource={ShippingListVO}
                className={className}
                headerTitle={
                    <Search
                        placeholder='' enterButton="Search" loading={loading}
                        onSearch={async (val: any) => {
                            searchParams.name = val;
                            await handleGetShippingList(searchParams);
                        }}
                    />
                }
                rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                toolbar={{
                    actions: [
                        <Button key={'add'} onClick={() => handleEditShipping({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                            Add {type}
                        </Button>
                    ]
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: [20, 30, 50, 100],
                    onChange: (page, pageSize) => {
                        searchParams.currentPage = page;
                        searchParams.pageSize = pageSize;
                        setSearchParams(searchParams);
                    },
                }}
                // @ts-ignore
                request={async (params) => {
                    params.currentPage = searchParams.currentPage;
                    return handleGetShippingList(params)
                }}
            />
        </Form>
    )
}
export default ShippingTable;