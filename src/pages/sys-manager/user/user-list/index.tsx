import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined} from '@ant-design/icons'
import {Divider, Input} from 'antd'

const {Search} = Input;

type APIUser = APIManager.User;
type APISearchUser = APIManager.SearchUserParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchUser = {
    name: '',
};

const UserListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        queryUserList
    } = useModel('manager.user', (res: any) => ({
        queryUserList: res.queryUserList,
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
        const result: APIManager.UserResult = await queryUserList(params);
        setLoading(false);
        console.log(result);
        setUserListVO(result.data);
        return result;
    }

    const columns: ProColumns<APIUser>[] = [
        {
            title: 'Code',
            dataIndex: 'Code',
            width: 123,
            disable: true,
            align: 'center',
        },
        {
            title: 'User',
            dataIndex: 'Name',
            disable: true,
            align: 'center',
        },
        {
            title: 'City',
            dataIndex: 'CityName',
            width: 160,
            disable: true,
        },
        {
            title: 'Country',
            dataIndex: 'CountryName',
            width: 160,
            disable: true,
            align: 'center',
        },
        {
            title: 'Country',
            dataIndex: 'CountryName',
            width: 160,
            disable: true,
            align: 'center',
        },
        {
            title: 'Type',
            dataIndex: 'TransUserTypeName',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            disable: true,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        {/*<UserDrawerForm UserInfo={record}/>*/}
                        <Divider type='vertical'/>
                        <DeleteOutlined color={'red'}/>
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
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchUser) => handleGetUserList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default UserListIndex;