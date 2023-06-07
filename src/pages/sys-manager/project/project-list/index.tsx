import React, {useState, useRef} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns, ActionType} from '@ant-design/pro-table';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {PlusOutlined} from '@ant-design/icons'
import {Button, Input} from 'antd'

const {Search} = Input;

type APIProject = APIManager.Project;
type APISearchProject = APIManager.SearchProjectParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchProject = {
    // name: '',
};

const ProjectListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        PortList, querySea,
    } = useModel('manager.port', (res: any) => ({
        PortList: res.PortList,
        querySea: res.querySea,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    // const [PortListVO, setPortListVO] = useState<APIProject[]>(PortList || []);
    const ref = useRef<ActionType>();
    /**
     * @Description: TODO 获取单票数据集合
     * @author LLS
     * @date 2023/6/5
     * @param params    参数
     * @returns
     */
    async function handleQueryProject(params: APISearchProject) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.currentPage = params.current || 1;
        // params.pageSize = params.pageSize || 20;
        const result: APIManager.PortResult = await querySea(params);
        // setPortListVO(result.data || []);
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
    /*const handleDelFreezePort = async (record: APIProject, state: string) => {
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
    }*/

    const columns: ProColumns<APIProject>[] = [
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
        },/*
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
        },*/
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            {/*<ProCard
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
            />*/}
            <ProCard className={'ant-card-pro-table'}>
                <ProTable<APIProject>
                    rowKey={'ID'}
                    actionRef={ref}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    // dataSource={BranchListVO}
                    locale={{ emptyText: 'No Data' }}
                    // className={'antd-pro-table-port-sea ant-pro-table-search'}
                    // rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                // searchParams.name = val;
                                await handleQueryProject(searchParams);
                                // 刷新
                                // ref.current?.reload();
                            }}
                        />
                    }
                    toolbar={{
                        actions: [
                            // <PortDrawerForm key={'add'} PortInfo={{}} isCreate={true} actionRef={ref}/>
                            <Button key={'add'}
                                    // onClick={()=> handleEditBranch({id: '0'})}
                                    type={'primary'} icon={<PlusOutlined/>}>
                                Add Branch
                            </Button>
                        ]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    request={handleQueryProject}
                />
                {/*<ProTable<APIBranch>
                    rowKey={'ID'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={BranchListVO}
                    locale={{ emptyText: 'No Data' }}
                    className={'antd-pro-table-port-sea'}
                    rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.name = val;
                                await handleQueryBranch(searchParams);
                            }}/>
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={()=> handleEditBranch({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                                Add Branch
                            </Button>
                        ]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchBranch) => handleQueryBranch(params)}
                />*/}
            </ProCard>
        </PageContainer>
    )
}
export default ProjectListIndex;