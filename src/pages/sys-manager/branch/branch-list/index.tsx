import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Divider, Popconfirm, Input, Button} from 'antd'
import {getUserID} from '@/utils/auths'
import {history} from '@@/core/history'

const {Search} = Input;

type APIBranch = APIManager.Branch;
type APISearchBranch = APIManager.SearchBranchParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchBranch = {
    Name: '',
    UserID: getUserID()
};

const BranchListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        BranchList, getBranchList
    } = useModel('manager.branch', (res: any) => ({
        BranchList: res.BranchList,
        getBranchList: res.getBranchList,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [BranchListVO, setBranchListVO] = useState<APIBranch[]>(BranchList || []);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetBranchList(params: APISearchBranch) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.PageNum = params.current || 1;
        // params.pageSize = params.PageSize || 15;
        // params.PageSize = params.PageSize || 15;
        const result: APIManager.BranchResult = await getBranchList(params);
        setBranchListVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param record    操作当前 行
     * @param state     操作状态
     * @returns
     */
    const handleOperateBranch = async (record: any, state: string = 'form') => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/branch/${state}/${btoa(record?.ID || 0)}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }


    const columns: ProColumns<APIBranch>[] = [
        {
            title: 'Name',
            dataIndex: 'name_full_en',
            align: 'left',
        },
        {
            title: 'Short Name',
            dataIndex: 'name_short_en',
            width: 200,
            align: 'center',
        },
        {
            title: 'Currency',
            dataIndex: 'func_currency_name',
            width: 100,
            align: 'center',
        },
        {
            title: 'Oracle ID',
            dataIndex: 'org_id',
            width: 150,
            align: 'center',
        },
        {
            title: 'Oracle ID',
            dataIndex: 'org_id',
            width: 150,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleOperateBranch(record)}/>
                        <Popconfirm
                            onConfirm={() => handleOperateBranch(record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <Divider type='vertical'/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-pro-table'}>
                <ProTable<APIBranch>
                    rowKey={'ID'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={BranchListVO}
                    className={'antd-pro-table-port-list'}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.Name = val;
                                await handleGetBranchList(searchParams);
                            }}/>
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={handleOperateBranch} type={'primary'} icon={<PlusOutlined/>}>
                                Add Branch
                            </Button>
                        ]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchBranch) => handleGetBranchList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default BranchListIndex;