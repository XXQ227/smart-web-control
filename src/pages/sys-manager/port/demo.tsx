import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-table';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Input, message} from 'antd'
import PortDrawerForm from '@/pages/sys-manager/port/form'
import {CustomizeIcon} from "@/utils/units";
import ls from 'lodash'

const {Search} = Input;

type APIPort = APIManager.Port;
type APISearchPort = APIManager.SearchPortParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchPort = {
    name: '',
    current: 1,
    pageSize: 20,
};

const PortListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        PortList, querySea, deleteSea, operateSea
    } = useModel('manager.port', (res: any) => ({
        PortList: res.PortList,
        querySea: res.querySea,
        deleteSea: res.deleteSea,
        operateSea: res.operateSea,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [PortListVO, setPortListVO] = useState<APIPort[]>(PortList || []);
    const [PortInfoVO, setPortInfoVO] = useState<any>({});
    const [portIndex, setPortIndex] = useState<number>(-2);
    const [tab, setTab] = useState('Sea');
    /**
     * @Description: TODO 获取单票数据集合
     * @author LLS
     * @date 2023/6/5
     * @param params    参数
     * @returns
     */
    async function handleGetPortList(params: APISearchPort) {
        setLoading(true);
        const result: API.Result = await querySea(params);
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
        let result: API.Result;
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        const newData = ls.cloneDeep(PortListVO);
        // TODO: 删除
        if (state === 'delete') {
            result = await deleteSea(params);
            // TODO: 过滤删除行
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateSea(params);
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
        newData.splice(portIndex, portIndex === -1 ? 0 : 1, record);
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
                        {/*<PortDrawerForm PortInfo={record} actionRef={ref}/>*/}
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

    const renderContent = () => {
        return <ProTable<APIPort>
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
            pagination={{showSizeChanger: true, pageSizeOptions: [20, 30, 50, 100]}}
            // @ts-ignore
            request={async (params) => handleGetPortList(params)}
        />
    }

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard
                tabs={{
                    activeKey: tab,
                    tabPosition: 'left',
                    onChange: (key) => setTab(key),
                    items: [
                        {
                            label: 'Sea',
                            key: 'Sea',
                            children: renderContent(),
                        },
                        {
                            label: 'Air',
                            key: 'Air',
                            children: renderContent(),
                        },
                        {
                            label: 'Land',
                            key: 'Land',
                            children: renderContent(),
                        },
                        {
                            label: 'Trade place',
                            key: 'TradePlace',
                            children: renderContent(),
                        },
                    ],
                }}
            />
            {open ? <PortDrawerForm
                handleSavePort={handleSavePort}
                open={open} PortInfo={PortInfoVO} setOpen={handleSetOpen}
            /> : null}
        </PageContainer>
    )
}
export default PortListIndex;