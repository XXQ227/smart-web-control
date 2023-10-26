import React, {Fragment, useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Popconfirm, Input, Button, message} from 'antd'
import {history} from '@@/core/history'
import DividerCustomize from '@/components/Divider'
import {IconFont} from '@/utils/units'
import ls from 'lodash'

const {Search} = Input;

type APIBranch = APISystem.Branch;
type APISearchBranchParams = APISystem.SearchBranchParams;

export type LocationState = Record<string, unknown>;

// TODO: 获取公司列表的请求参数
const initSearchParam = {
    name: '',
    currentPage: 1,
    pageSize: 20
};

const initPagination = {
    current: 1,
    pageSize: 20,
    total: 0,
}

const BranchListIndex: React.FC<RouteChildrenProps> = (props) => {
    const searchQueryBranch = ls.cloneDeep(initSearchParam)
    const searchLocation = props.location.state ? (props.location.state as LocationState)?.searchParams : '';

    const {
        queryBranch, operateBranch, deleteBranch
    } = useModel('system.branch', (res: any) => ({
        queryBranch: res.queryBranch,
        operateBranch: res.operateBranch,
        deleteBranch: res.deleteBranch,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [BranchListVO, setBranchListVO] = useState<APIBranch[]>([]);
    const [searchParams, setSearchParams] = useState<APISearchBranchParams>(searchLocation || searchQueryBranch);
    const [searchValue, setSearchValue] = useState(searchParams.name);
    const [pagination, setPagination] = useState<any>(initPagination)

    // 当props.location.state有值，页面被刷新的时，重置跳传地址。为了清空原来的搜索参数
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (props.location.state) {
                history.push({pathname: '/system/branch'});
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [props.location.state]);

    /**
     * @Description: TODO 获取公司数据集合
     * @author LLS
     * @date 2023/7/5
     * @param params    参数
     * @returns
     */
    async function handleQueryBranch(params: APISearchBranchParams) {
        setLoading(true);
        const result: API.Result = await queryBranch(params);
        if (result.success) {
            setBranchListVO(result.data);
            setPagination({
                current: result.current,
                pageSize: result.size,
                total: result.total,
            });
        } else {
            message.error(result.message);
        }
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑 公司 信息
     * @author XXQ
     * @date 2023/5/5
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBranch = (record: APIBranch) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        history.push({
            pathname: `/system/branch/form/${btoa(record.id)}`,
            state: {
                searchParams: searchParams,
            },
        });
    }

    /**
     * @Description: TODO: 删除 / 冻结公司
     * @author XXQ
     * @date 2023/6/1
     * @param index     编辑行的序号
     * @param record    当前行的数据
     * @param state     状态
     * @returns
     */
    const handleOperateBranch = async (index: number, record: APIBranch, state: string) => {
        setLoading(true);
        let result: API.Result;
        const params: any = {id: record.id};
        const newData: APIBranch[] = ls.cloneDeep(BranchListVO);
        if (state === 'freeze') {
            // TODO: 冻结取反上传数据
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateBranch(params);
            // TODO: 并更新当前数据
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        } else {
            // TODO: 删除
            result = await deleteBranch(params);
            // TODO: 删除当前行
            newData.splice(index, 1);
        }
        if (result.success) {
            message.success('Success');
            setBranchListVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }

    const columns: ProColumns<APIBranch>[] = [
        {
            title: 'Name',
            dataIndex: 'nameFullEn',
            align: 'left',
        },
        {
            title: 'Short Name',
            dataIndex: 'nameShortEn',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Currency',
            dataIndex: 'funcCurrencyName',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Oracle ID',
            dataIndex: 'orgId',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Contact',
            dataIndex: 'contactName',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Action',
            width: 110,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} hidden={!!record.enableFlag} onClick={() => handleEditBranch(record)}/>
                        <DividerCustomize hidden={!!record.enableFlag}/>
                        <Popconfirm
                            onConfirm={() => handleOperateBranch(index, record, 'freeze')}
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <IconFont type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateBranch(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize />
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-pro-table'}>
                <ProTable<APIBranch>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={BranchListVO}
                    locale={{ emptyText: 'No Data' }}
                    className={'antd-pro-table-port-list'}
                    rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
                    headerTitle={
                        <Search
                            placeholder=''
                            enterButton="Search"
                            loading={loading}
                            defaultValue={searchValue}
                            onSearch={async (val: any) => {
                                setSearchValue(val);
                                searchParams.name = val;
                                await handleQueryBranch(searchParams);
                            }}
                        />
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={()=> handleEditBranch({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                                Add Branch
                            </Button>
                        ]
                    }}
                    pagination={{
                        showSizeChanger: true,
                        ...pagination,
                        pageSizeOptions: [20, 30, 50, 100],
                        onChange: (page, pageSize) => {
                            // searchParams.currentPage = page;
                            searchParams.pageSize = pageSize;
                            setSearchParams(searchParams);
                        },
                    }}
                    request={handleQueryBranch}
                />
            </ProCard>
        </PageContainer>
    )
}
export default BranchListIndex;