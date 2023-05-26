import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Divider, Input, message, Popconfirm} from 'antd'
import {SALES_ENUM} from '@/utils/enum'
import {CustomizeIcon} from '@/utils/units'
import {getUserID} from '@/utils/auths'
import UserDrawerForm from '@/pages/sys-manager/user/user-drawer-form'
import {DeleteOutlined} from '@ant-design/icons'

const {Search} = Input;

type APIUser = APIManager.User;
type APISearchUser = APIManager.SearchUserParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchUser = {
    name: '',
};

const UserListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        queryUserList, freezenUser
    } = useModel('manager.user', (res: any) => ({
        queryUserList: res.queryUserList,
        freezenUser: res.freezenUser,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [UserListVO, setUserListVO] = useState<APIUser[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetUserList(params: APISearchUser) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryUserList(params);
        setLoading(false);
        console.log(result.data);
        if(result.success) {
            setUserListVO(result.data);
        } else {
            message.error(result.message);
        }
        return result;
    }

    /**
     * @Description: TODO: 冻结部门
     * @author XXQ
     * @date 2023/5/15
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @param state     lock：解锁、锁定用户；delete：删除
     * @returns
     */
    const handleOperateUser = async (record: APIUser, index: number, state: string) => {
        setLoading(true);
        const params: any = {
            UserID: getUserID(),
            id: record.id,
        }
        // TODO: 【删除】 操作
        if (state === 'delete') {
            params.delete_flag = record.delete_flag
        }
        // TODO: 【锁定】 操作
        else if (state === 'lock') {
            params.enable_flag = record.enable_flag;
        }
        const result: any = await freezenUser(params);
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            // handleDeptChange(index, record.id, 'enable_flag', !record.enable_flag);
            setLoading(false);
        } else {
            message.error(result.Content);
            setLoading(false);
        }
    }

    /**
     * @Description: TODO: 编辑用户信息
     * @author XXQ
     * @date 2023/5/26
     * @param record
     * @returns
     */
    const handleEditUser = (record: APIUser) => {

    }


    const columns: ProColumns<APIUser>[] = [
        {
            title: 'Display Name',
            dataIndex: 'nameDisplay',
            disable: true,
            align: 'center',
        },
        {
            title: 'Login Name',
            dataIndex: 'nameLogin',
            disable: true,
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 160,
            disable: true,
            ellipsis: true,
        },
        {
            title: 'Department',
            dataIndex: 'departmentId',
            width: 150,
            disable: true,
            align: 'center',
        },
        {
            title: 'Sinotrans Code',
            dataIndex: 'codeSino',
            width: 160,
            disable: true,
            align: 'center',
        },
        {
            title: 'Sales',
            dataIndex: 'saleFlag',
            width: 160,
            disable: true,
            align: 'center',
            valueEnum: SALES_ENUM,
        },
        {
            title: 'Action',
            width: 100,
            disable: true,
            align: 'center',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <UserDrawerForm UserInfo={record} handleSave={handleEditUser}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleOperateUser(record, index, 'lock')}
                            title={`Are you sure to ${record.enable_flag ? 'unlock' : 'lock'}?`}
                        >
                            <Divider type='vertical'/>
                            <CustomizeIcon
                                hidden={!(typeof record.id === 'number')}
                                type={record.enable_flag ? 'icon-unlock-2' : 'icon-lock-2'}
                            />
                        </Popconfirm>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleOperateUser(record, index, 'delete')}
                            title={`Are you sure to delete?`}
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
                <ProTable<APIUser>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={UserListVO}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.name = val;
                                await handleGetUserList(searchParams);
                            }}
                        />
                    }
                    toolbar={{actions: [
                        <UserDrawerForm key={'edit'} isCreate={true} UserInfo={{}} handleSave={handleEditUser}/>]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchUser) => handleGetUserList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default UserListIndex;