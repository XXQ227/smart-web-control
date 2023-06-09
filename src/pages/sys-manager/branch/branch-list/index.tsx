import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Popconfirm, Input, Button, message} from 'antd'
import {history} from '@@/core/history'
import DividerCustomize from '@/components/Divider'
import {CustomizeIcon} from '@/utils/units'
import ls from 'lodash'

const {Search} = Input;

type APIBranch = APIManager.Branch;
type APISearchBranch = APIManager.SearchBranchParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchBranch = {
    name: '',
};

const BranchListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        BranchList, queryBranch, operateBranch, deleteBranch
    } = useModel('manager.branch', (res: any) => ({
        BranchList: res.BranchList,
        queryBranch: res.queryBranch,
        operateBranch: res.operateBranch,
        deleteBranch: res.deleteBranch,
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
    async function handleQueryBranch(params: APISearchBranch) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.PageNum = params.current || 1;
        // params.pageSize = params.PageSize || 15;
        // params.PageSize = params.PageSize || 15;
        const result: APIManager.BranchResult = await queryBranch(params);
        setBranchListVO(result.data);
        setLoading(false);
        return [];
    }

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBranch = (record: APIBranch) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/branch/form/${btoa(record.id)}`;
        // TODO: 跳转页面<带参数>
        history.push({pathname: url})
    }

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/6/1
     * @param index     编辑行的序号
     * @param record    当前行的数据
     * @param state     状态
     * @returns
     */
    const handleOperateBranch = async (index: number, record: APIBranch, state: string) => {
        let result: API.Result;
        const params: any = {id: record.id};
        const newData: APIBranch[] = ls.cloneDeep(BranchListVO);
        if (state === 'freezen') {
            // TODO: 冻结取反上传数据
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateBranch(params);
            // TODO: 并更新当前数据
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        } else {
            // TODO: 删除
            params.id = Number(params.id);
            result = await deleteBranch(params);
            // TODO: 删除当前行
            newData.splice(index, 1);
        }
        // TODO:
        if (result.success) {
            message.success('success!');
            setBranchListVO(newData);
        } else {
            message.error(result.message);
        }
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
            width: 200,
            align: 'center',
        },
        {
            title: 'Currency',
            dataIndex: 'funcCurrencyName',
            width: 100,
            align: 'center',
        },
        {
            title: 'Oracle ID',
            dataIndex: 'orgId',
            width: 150,
            align: 'center',
        },
        {
            title: 'Contact',
            dataIndex: 'contactName',
            width: 150,
            align: 'center',
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditBranch(record)}/>
                        <Popconfirm
                            onConfirm={() => handleOperateBranch(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize />
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateBranch(index, record, 'freezen')}
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <DividerCustomize />
                            <CustomizeIcon type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
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
                />
            </ProCard>
        </PageContainer>
    )
}
export default BranchListIndex;