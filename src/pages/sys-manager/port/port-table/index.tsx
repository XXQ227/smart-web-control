import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import {ProTable} from '@ant-design/pro-components'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Input} from 'antd'
import {CustomizeIcon} from "@/utils/units";
import PortDrawerForm from '@/pages/sys-manager/port/form'
import ls from 'lodash'

const {Search} = Input;

type APIPort = APIManager.Port;

interface Props {
    loading: boolean,
    PortList: APIPort[],
    searchParams: APIManager.SearchPortParams,
    handleOperatePort: (index: number, record: APIPort, state: string) => void,
    handleGetPortList: (params: APIManager.SearchPortParams) => void,
    handleSetPortVO: (data: APIPort[]) => void,
}

const PortTable: React.FC<Props> = (props) => {
    const {
        loading, PortList,
        searchParams, handleGetPortList, handleOperatePort,
        handleSetPortVO
    } = props;

    const [open, setOpen] = useState<boolean>(false);
    const [portIndex, setPortIndex] = useState<number>(-2);
    const [PortInfoVO, setPortInfoVO] = useState<any>({});

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
        const newData: APIPort[] = ls.cloneDeep(PortList);
        // TODO: portIndex === -1 ==> 添加；否则为 1，修改
        newData.splice(portIndex, portIndex === -1 ? 0 : 1, record);
        handleSetOpen(false, -2);
        handleSetPortVO(newData);
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
            title: 'Alias',
            dataIndex: 'alias',
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
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleSetOpen(true, index, record)}/>
                        <Divider type='vertical'/>
                        <CustomizeIcon
                            type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}
                            onClick={() => handleOperatePort(index, record, 'freeze')}
                        />
                        <Divider type='vertical'/>
                        <DeleteOutlined color={'red'} onClick={() => handleOperatePort(index, record, 'delete')}/>
                    </Fragment>
                )
            },
        },
    ];

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
                dataSource={PortList}
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
                pagination={{showSizeChanger: true, pageSizeOptions: [20, 30, 50, 100]}}
                // @ts-ignore
                request={async (params) => handleGetPortList(params)}
            />
            {open ? <PortDrawerForm
                handleSavePort={handleSavePort}
                open={open} PortInfo={PortInfoVO} setOpen={handleSetOpen}
            /> : null}
        </Fragment>
    )
}
export default PortTable;