import React, {useState, Fragment} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-table';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel, history} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Input, message, Popconfirm} from 'antd'
import DividerCustomize from "@/components/Divider";
import {CustomizeIcon} from "@/utils/units";
import ls from "lodash";

const {Search} = Input;

type APIProject = APIManager.Project;
type APISearchProject = APIManager.SearchProjectParams;

// TODO: 获取项目列表的请求参数
const initSearchParam = {code: '', currentPage: 1, pageSize: 20,};

const ProjectListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        ProjectList, queryProject, deleteProject, operateProject
    } = useModel('manager.project', (res: any) => ({
        ProjectList: res.ProjectList,
        queryProject: res.queryProject,
        deleteProject: res.deleteProject,
        operateProject: res.operateProject,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [ProjectListVO, setProjectListVO] = useState<APIProject[]>(ProjectList || []);
    const [searchParams, setSearchParams] = useState<APISearchProject>(initSearchParam);

    /**
     * @Description: TODO: 编辑 项目 信息
     * @author LLS
     * @date 2023/6/7
     * @param record    操作当前行
     * @returns
     */
    const handleEditProject = (record: APIProject) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/project/form/${btoa(record.id)}`;
        // TODO: 跳转页面<带参数>
        history.push({pathname: url})
    }

    /**
     * @Description: TODO:
     * @author LLS
     * @date 2023/6/8
     * @param index     编辑行的序号
     * @param record    当前行的数据
     * @param state     状态
     * @returns
     */
    const handleOperateProject = async (index: number, record: APIProject, state: string) => {
        setLoading(true);
        let result: API.Result;
        const params: any = {id: record.id};
        const newData: APIProject[] = ls.cloneDeep(ProjectListVO);
        if (state === 'freeze') {
            // TODO: 冻结取反上传数据
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateProject(params);
            // TODO: 并更新当前数据
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        } else {
            // TODO: 删除
            result = await deleteProject(params);
            // TODO: 删除当前行
            newData.splice(index, 1);
        }
        if (result.success) {
            message.success('Success');
            setProjectListVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }


    /**
     * @Description: TODO 获取单票数据集合
     * @author LLS
     * @date 2023/6/7
     * @param params    参数
     * @returns
     */
    async function handleQueryProject(params: APISearchProject) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.currentPage = params.current || 1;
        // params.pageSize = params.pageSize || 20;
        const result: API.Result = await queryProject(params);
        setProjectListVO(result.data || []);
        setLoading(false);
        return result;
    }

    const columns: ProColumns<APIProject>[] = [
        {
            title: 'Full Name',
            dataIndex: 'nameFull',
            ellipsis: true,
        },
        {
            title: 'Short Name',
            dataIndex: 'nameShort',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Industry',
            dataIndex: 'industryType',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Manager',
            dataIndex: 'managerId',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Oracle ID',
            dataIndex: 'oracleId',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditProject(record)}/>
                        <Popconfirm
                            onConfirm={() => handleOperateProject(index, record, 'freeze')}
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <DividerCustomize />
                            <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateProject(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize />
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        }
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
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={ProjectListVO}
                    locale={{ emptyText: 'No Data' }}
                    className={'antd-pro-table-port-sea ant-pro-table-search'}
                    rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.code = val;
                                await handleQueryProject(searchParams);
                            }}
                        />
                    }
                    toolbar={{
                        actions: [
                            // <PortDrawerForm key={'add'} PortInfo={{}} isCreate={true} actionRef={ref}/>
                            <Button key={'add'} onClick={()=> handleEditProject({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                                Add Project
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