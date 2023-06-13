import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import {ProTable} from '@ant-design/pro-components'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Input, message, Popconfirm} from 'antd'
import {CustomizeIcon} from "@/utils/units";
import PortDrawerForm from '@/pages/sys-manager/port/form'
import ls from 'lodash'

const {Search} = Input;

type APIPort = APIManager.Port;
type APISearchPort = APIManager.SearchPortParams;

const initSearchParam = {name: '', currentPage: 1, pageSize: 20,};

interface Props {
    type: string,
    queryAPI: any,
    deleteAPI: any,
    operateAPI: any,
    addAPI: any,
    editAPI: any,
}


const PortTable: React.FC<Props> = (props) => {
    const {type, queryAPI, deleteAPI, operateAPI, addAPI, editAPI,} = props;

    const [open, setOpen] = useState<boolean>(false);
    const [portIndex, setPortIndex] = useState<number>(-2);
    const [PortInfoVO, setPortInfoVO] = useState<any>({});
    const [searchParams, setSearchParams] = useState<APISearchPort>(initSearchParam);


    const [loading, setLoading] = useState<boolean>(false);
    const [PortListVO, setPortListVO] = useState<APIPort[]>([]);

    /**
     * @Description: TODO 获取港口列表
     * @author LLS
     * @date 2023/6/5
     * @param params    参数
     * @returns
     */
    async function handleGetPortList(params: APISearchPort) {
        setLoading(true);
        const result: API.Result = await queryAPI(params);
        setPortListVO(result.data || []);
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
    const handleOperatePort = async (index: number, record: APIPort, state: string) => {
        setLoading(true);
        let result: API.Result;
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        const newData = ls.cloneDeep(PortListVO);
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
            setPortListVO(newData);
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
    const handleSetOpen = (state: boolean, index: number, record?: APIPort) => {
        setOpen(state);
        setPortInfoVO(record || {});
        if (state) {
            // TODO: 当是打开编辑时，记录下当前行的序列虚；否则为编辑
            setPortIndex(index);
        } else {
            // TODO: 关闭时，重置初始化
            setPortIndex(-2);
        }
    }

    /**
     * @Description: TODO: 更新本地数据
     * @author XXQ
     * @date 2023/6/6
     * @param record    编辑行信息
     * @returns
     */
    const handleSavePort = (record: APIPort) => {
        const newData: APIPort[] = ls.cloneDeep(PortListVO);
        // TODO: portIndex === -1 ==> 添加；否则为 1，修改
        newData.splice(portIndex === -1 ? 0 : portIndex, portIndex === -1 ? 0 : 1, record);
        handleSetOpen(false, -2);
        setPortListVO(newData);
    }

    const columns: ProColumns<APIPort>[] = [
        {
            title: 'Code',
            dataIndex: 'code',
            width: 120,
            disable: true,
            align: 'center',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            disable: true,
            align: 'center',
        },
        {
            title: 'City',
            dataIndex: 'cityName',
            width: 150,
            disable: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 110,
            disable: true,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleSetOpen(true, index, record)}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleOperatePort(index, record, 'enableFlag')}
                        >
                            <Divider type='vertical'/>
                            <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperatePort(index, record, 'deleteFlag')}
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

    // TODO: 海运类型加一个显示列
    if (type === 'sea') {
        columns.splice(1, 0, {title: 'Alias', dataIndex: 'alias', disable: true, align: 'center'});
    }

    return (
        <Fragment>
            <ProTable<APIPort>
                rowKey={'id'}
                search={false}
                options={false}
                bordered={true}
                loading={loading}
                columns={columns}
                params={searchParams}
                dataSource={PortListVO}
                className={'antd-pro-table-port-list ant-pro-table-search'}
                headerTitle={
                    <Search
                        placeholder='' enterButton="Search" loading={loading}
                        onSearch={async (val: any) => {
                            searchParams.name = val;
                            await handleGetPortList(searchParams);
                        }}
                    />
                }
                rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                toolbar={{
                    actions: [
                        <Button key={'add'} onClick={() => handleSetOpen(true, -1)} type={'primary'} icon={<PlusOutlined/>}>
                            Add Port
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
                    return handleGetPortList(params)
                }}
            />
            {open ? <PortDrawerForm
                type={type}
                addAPI={addAPI}
                editAPI={editAPI}
                handleSavePort={handleSavePort}
                open={open} PortInfo={PortInfoVO} setOpen={handleSetOpen}
            /> : null}
        </Fragment>
    )
}
export default PortTable;