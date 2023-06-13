import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import {ProTable} from '@ant-design/pro-components'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Input, message, Popconfirm} from 'antd'
import {CustomizeIcon} from "@/utils/units";
import PortDrawerForm from '@/pages/sys-manager/port/form'
import ls from 'lodash'
import {history} from "@@/core/history";

const {Search} = Input;

type APIVoyage = APIManager.Voyage;
type APIVessel = APIManager.Vessel;
type APILine = APIManager.Line;
type APISearchShipping = APIManager.SearchShippingParams;

const initSearchParam = {name: '', currentPage: 1, pageSize: 20,};

interface Props {
    type: string,
    queryAPI: any,
    deleteAPI: any,
    operateAPI: any,
    addAPI: any,
    editAPI: any,
}

const ShippingTable: React.FC<Props> = (props) => {
    const {type, queryAPI, deleteAPI, operateAPI, addAPI, editAPI,} = props;

    const [open, setOpen] = useState<boolean>(false);
    const [shippingIndex, setShippingIndex] = useState<number>(-2);
    const [ShippingInfoVO, setShippingInfoVO] = useState<any>({});
    const [searchParams, setSearchParams] = useState<APISearchShipping>(initSearchParam);
    const [loading, setLoading] = useState<boolean>(false);
    const [ShippingListVO, setShippingListVO] = useState<APIVoyage[]>([]);

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
     * @Description: TODO:  删除、冻结操作
     * @author LLS
     * @date 2023/6/6
     * @param index     当前行序号
     * @param record    当前行数据
     * @param state     操作状态：delete：删除；freeze：冻结
     * @returns
     */
    const handleOperateShipping = async (index: number, record: APIVoyage, state: string) => {
        setLoading(true);
        let result: API.Result;
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        const newData = ls.cloneDeep(ShippingListVO);
        // TODO: 删除
        if (state === 'deleteFlag') {
            result = await deleteAPI(params);
            // TODO: 过滤删除行
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateAPI(params);
            // TODO: 更新删除行
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

    /**
     * @Description: TODO: 编辑页面 打开/关闭 状态
     * @author XXQ
     * @date 2023/6/6
     * @param state     编辑页打开状态
     * @param index     编辑行序号
     * @param record    编辑行信息
     * @returns
     */
    const handleSetOpen = (state: boolean, index: number, record?: APIVoyage) => {
        setOpen(state);
        setShippingInfoVO(record || {});
        if (state) {
            // TODO: 当是打开编辑时，记录下当前行的序列虚；否则为编辑
            setShippingIndex(index);
        } else {
            // TODO: 关闭时，重置初始化
            setShippingIndex(-2);
        }
    }


    /**
     * @Description: TODO: 编辑 船代 信息
     * @author LLS
     * @date 2023/6/12
     * @param record    操作当前行
     * @returns
     */
    const handleEditShipping = (record: APIVoyage) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/shipping/form/${btoa(record.id)}`;
        // TODO: 跳转页面<带参数>
        history.push({pathname: url})
    }

    /**
     * @Description: TODO: 更新本地数据
     * @author XXQ
     * @date 2023/6/6
     * @param record    编辑行信息
     * @returns
     */
    const handleSaveShipping = (record: APIVoyage) => {
        const newData: APIVoyage[] = ls.cloneDeep(ShippingListVO);
        // TODO: shippingIndex === -1 ==> 添加；否则为 1，修改
        newData.splice(shippingIndex === -1 ? 0 : shippingIndex, shippingIndex === -1 ? 0 : 1, record);
        handleSetOpen(false, -2);
        setShippingListVO(newData);
    }

    const voyageColumns: ProColumns<APIVoyage>[] = [
        {
            title: 'Voyage',
            dataIndex: 'name',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'Vessel Name',
            dataIndex: 'vesselName',
            ellipsis: true,
        },
        {
            title: 'Shipping Line',
            dataIndex: 'lineName',
            ellipsis: true,
        },
        {
            title: 'ETD',
            dataIndex: 'etd',
            valueType: "date",
            width: 110,
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditShipping(record)}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateShipping(index, record, 'enableFlag')}
                        >
                            <Divider type='vertical'/>
                            <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateShipping(index, record, 'deleteFlag')}
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
            ellipsis: true,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'Call Sign',
            dataIndex: 'callSign',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'IMO No.',
            dataIndex: 'imoNum',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'Carrier',
            dataIndex: 'carrierName',
            ellipsis: true,
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditShipping(record)}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateShipping(index, record, 'enableFlag')}
                        >
                            <Divider type='vertical'/>
                            <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateShipping(index, record, 'deleteFlag')}
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

    const lineColumns: ProColumns<APILine>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Area Code',
            dataIndex: 'areaCode',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'Service ID',
            dataIndex: 'serverId',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'Carrier',
            dataIndex: 'carrierName',
            ellipsis: true,
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditShipping(record)}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperateShipping(index, record, 'enableFlag')}
                        >
                            <Divider type='vertical'/>
                            <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateShipping(index, record, 'deleteFlag')}
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

    let columns: any[] = []
    // TODO: 海运类型加一个显示列
    if (type === 'Voyage') {
        columns = voyageColumns
    } else if (type === 'Vessel') {
        columns = vesselColumns
    } else if (type === 'Line') {
        columns = lineColumns
    }

    return (
        <Fragment>
            <ProTable<APIVoyage>
                rowKey={'id'}
                search={false}
                options={false}
                bordered={true}
                loading={loading}
                columns={columns}
                params={searchParams}
                dataSource={ShippingListVO}
                // className={'antd-pro-table-port-list ant-pro-table-search'}
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
            {open ? <PortDrawerForm
                addAPI={addAPI}
                editAPI={editAPI}
                handleSavePort={handleSaveShipping}
                open={open} PortInfo={ShippingInfoVO} setOpen={handleSetOpen}
            /> : null}
        </Fragment>
    )
}
export default ShippingTable;