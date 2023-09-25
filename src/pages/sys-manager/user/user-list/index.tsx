import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Divider, Input, message, Popconfirm} from 'antd'
import {SALES_ENUM} from '@/utils/enum'
import {IconFont} from '@/utils/units'
import UserDrawerForm from '@/pages/sys-manager/user/user-drawer-form'
import {DeleteOutlined} from '@ant-design/icons'
import ls from 'lodash'

const {Search} = Input;

type APIUser = APIManager.User;
type APISearchUser = APIManager.SearchUserParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchUser = {
    name: '',
};

const UserListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        queryUser, deleteUser, operateUser
    } = useModel('manager.user', (res: any) => ({
        queryUser: res.queryUser,
        deleteUser: res.deleteUser,
        operateUser: res.operateUser,
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
        const result: API.Result = await queryUser(params);
        setLoading(false);
        if(result.success) {
            setUserListVO(result.data);
        } else {
            message.error(result.message);
        }
        return result;
    }

    /**
     * @Description: TODO: 冻结删除用户
     * @author XXQ
     * @date 2023/6/5
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @param state     lock：解锁、锁定用户；delete：删除
     * @returns
     */
    const handleOperateUser = async (record: APIUser, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const params: any = {id: record.id};
        const newData: APIUser[] = ls.cloneDeep(UserListVO);
        // TODO: 【删除】 操作
        if (state === 'delete') {
            result = await deleteUser(params);
            // TODO: 删除当前行，更新本地数据
            record.deleteFlag = record.deleteFlag ? 0 : 1;
            newData.splice(index, 1);
        }
        // TODO: 【锁定/解锁】 操作
        else if (state === 'lock') {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateUser(params);
            // TODO: 更新本地数据
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setLoading(false);
            setUserListVO(newData);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }

    /**
     * @Description: TODO: 编辑用户信息
     * @author XXQ
     * @date 2023/5/26
     * @param index     序号
     * @param record    user 信息
     * @param state     操作状态
     * @returns {}
     */
    const handleSaveUser = async (index: number, record: APIUser, state: string) => {
        const newData: APIUser[] = ls.cloneDeep(UserListVO);
        // TODO: 保存、添加
        newData.splice(index, state === 'add' ? 0 : 1, record);
        setUserListVO(newData);
    }


    const columns: ProColumns<APIUser>[] = [
        {title: 'Display Name', dataIndex: 'nameDisplay', disable: true, align: 'center',},
        {title: 'Login Name', dataIndex: 'nameLogin', disable: true, align: 'center',},
        {title: 'Email', dataIndex: 'email', width: 160, disable: true, ellipsis: true,},
        {title: 'Department', dataIndex: 'defaultDepartmentName', width: 150, disable: true, align: 'center',},
        {title: 'Sinotrans Code', dataIndex: 'codeSino', width: 160, disable: true, align: 'center',},
        {title: 'Sales', dataIndex: 'salesFlag', width: 160, disable: true, align: 'center', valueEnum: SALES_ENUM,},
        {title: 'Action', width: 110, disable: true, align: 'center', className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <UserDrawerForm UserInfo={record} handleSave={(val: any)=> handleSaveUser(index, val, 'edit')}/>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleOperateUser(record, index, 'lock')}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <Divider type='vertical'/>
                            <IconFont type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            title={`Are you sure to delete?`}
                            onConfirm={() => handleOperateUser(record, index, 'delete')}
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
                    rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
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
                        <UserDrawerForm
                            key={'edit'} isCreate={true} UserInfo={{}}
                            handleSave={(val: any)=> handleSaveUser(0, val, 'add')}
                        />]
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