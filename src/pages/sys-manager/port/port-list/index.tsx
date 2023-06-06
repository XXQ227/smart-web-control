import React, {Fragment, useState, useRef} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns, ActionType} from '@ant-design/pro-table';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined} from '@ant-design/icons'
import {Divider, Input, message} from 'antd'
import PortDrawerForm from '@/pages/sys-manager/port/port-drawer-form'
import styles from "@/pages/sys-manager/style.less";
import {CustomizeIcon} from "@/utils/units";

const {Search} = Input;

type APIPort = APIManager.Port;
type APISearchPort = APIManager.SearchPortParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchPort = {
    name: '',
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
    const [PortListVO, setPortListVO] = useState<APIPort[]>(PortList || []);
    const [tab, setTab] = useState('Sea');
    const ref = useRef<ActionType>();

    /**
     * @Description: TODO 获取单票数据集合
     * @author LLS
     * @date 2023/6/5
     * @param params    参数
     * @returns
     */
    async function handleGetPortList(params: APISearchPort) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        params.currentPage = params.current || 1;
        params.pageSize = params.pageSize || 20;
        const result: APIManager.PortResult = await querySea(params);
        setPortListVO(result.data || []);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO:  删除、冻结操作
     * @author LLS
     * @date 2023/6/6
     * @param record    当前行数据
     * @param state     操作状态：delete：删除；freeze：冻结
     * @returns
     */
    const handleDelFreezePort = async (record: APIPort, state: string) => {
        let result: API.Result;
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        // TODO: 删除
        if (state === 'delete') {
            result = await deleteSea(params);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateSea(params);
        }
        if (result.success) {
            message.success('Success');
            // 刷新
            ref.current?.reload();
        } else {
            message.error(result.message);
        }
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
            render: (text, record) => {
                return (
                    <Fragment>
                        <PortDrawerForm PortInfo={record} actionRef={ref}/>
                        <Divider type='vertical'/>
                        <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'} onClick={() => handleDelFreezePort(record, 'freeze')}/>
                        <Divider type='vertical'/>
                        <DeleteOutlined color={'red'} onClick={() => handleDelFreezePort(record, 'delete')}/>

                    </Fragment>
                )
            },
        },
    ];

    const renderContent = (key: string) => {
        return <ProTable<APIPort>
            rowKey={'ID'}
            actionRef={ref}
            search={false}
            options={false}
            bordered={true}
            loading={loading}
            columns={columns}
            params={searchParams}
            className={'antd-pro-table-port-list ant-pro-table-search'}
            headerTitle={
                <Search
                    placeholder='' enterButton="Search" loading={loading}
                    onSearch={async (val: any) => {
                        searchParams.name = val;
                        await handleGetPortList(searchParams);
                        // 刷新
                        ref.current?.reload();
                    }}
                />
            }
            rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
            toolbar={{actions: [<PortDrawerForm key={'add'} PortInfo={{}} isCreate={true} actionRef={ref}/>]}}
            pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
            request={handleGetPortList}
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
                    tabPosition: 'left',
                    activeKey: tab,
                    items: [
                        {
                            label: 'Sea',
                            key: 'Sea',
                            children: renderContent('Sea'),
                        },
                        {
                            label: 'Airport',
                            key: 'Airport',
                            children: renderContent('Airport'),
                        },
                        {
                            label: 'Land',
                            key: 'Land',
                            children: renderContent('Land'),
                        },
                        {
                            label: 'Trade place',
                            key: 'TradePlace',
                            children: renderContent('TradePlace'),
                        },
                    ],
                    onChange: (key) => {
                        setTab(key);
                    },
                }}
            />
        </PageContainer>
    )
}
export default PortListIndex;