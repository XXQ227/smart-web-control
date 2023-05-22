import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Divider, Input} from 'antd'
import AccountDrawerForm from '@/pages/sys-manager/account/account-form'
import {getUserID} from '@/utils/auths'
import moment from 'moment'
import {ACCOUNT_PERIOD_ES_STATUS_ENUM, ACCOUNT_PERIOD_STATE_ENUM, ACCOUNT_PERIOD_TYPE_ENUM} from '@/utils/enum'
import {CustomizeIcon} from '@/utils/units'

const { Search } = Input;

type APIAccountList = APIManager.AccountList;
type APISearchAccount = APIManager.SearchAccountParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchAccount = {
    UserID: getUserID(),
    Year: moment(new Date()).year().toString(),
};

const AccountIndex: React.FC<RouteChildrenProps> = () => {

    const {
        getAPList, AccountList,
    } = useModel('manager.account', (res: any) => ({
        getAPList: res.getAPList,
        AccountList: res.AccountList,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [AccountListVO, setAccountListVO] = useState<APIAccountList[]>(AccountList || []);

    /**
     * @Description: TODO 获取账期集合
     * @author XXQ
     * @date 2023/5/10
     * @param params    参数
     * @returns
     */
    async function handleGetAccountList(params: APISearchAccount) {
        setLoading(true);
        const result: APIManager.AccountResult = await getAPList(params);
        setAccountListVO(result.data);
        setLoading(false);
        return result;
    }

    const columns: ProColumns<APIAccountList>[] = [
        {
            title: 'Year',
            dataIndex: 'FinaYear',
            disable: true,
            search: false,
            align: 'center',
        },
        {
            title: 'Month',
            dataIndex: 'FinaMonth',
            disable: true,
            search: false,
            align: 'center',
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            width: 100,
            disable: true,
            search: false,
            align: 'center',
            valueEnum: ACCOUNT_PERIOD_TYPE_ENUM,
        },
        {
            title: 'Code',
            dataIndex: 'PeriodCode',
            width: 160,
            disable: true,
            search: false,
            align: 'center',
        },
        {
            title: 'Start Date',
            dataIndex: 'StartDate',
            width: 100,
            disable: true,
            search: false,
            align: 'center',
        },
        {
            title: 'End Date',
            dataIndex: 'EndDate',
            width: 100,
            disable: true,
            search: false,
            align: 'center',
        },
        {
            title: 'Estimate',
            dataIndex: 'ESStatus',
            width: 100,
            disable: true,
            search: false,
            align: 'center',
            valueEnum: ACCOUNT_PERIOD_ES_STATUS_ENUM,
        },
        {
            title: 'State',
            dataIndex: 'State',
            width: 100,
            disable: true,
            search: false,
            align: 'center',
            valueEnum: ACCOUNT_PERIOD_STATE_ENUM,
        },
        {
            title: 'Action',
            width: 120,
            disable: true,
            search: false,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <AccountDrawerForm AccountPeriod={record}/>
                        {record.AccountState === 0 ?
                            <Fragment>
                                <Divider type='vertical'/>
                                <CustomizeIcon type={'icon-stop'} title={'Open'} />
                            </Fragment>
                            : record.AccountState === 1 ?
                                <Fragment>
                                    <Divider type='vertical'/>
                                    <CustomizeIcon type={'icon-switch'} title={'Closing'} />
                                    <Divider type='vertical'/>
                                    <CustomizeIcon type={record.IsPrepareClose ? 'icon-unlock-2' : 'icon-lock-2'} />
                                </Fragment>
                                : null
                        }
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
            <ProCard
                title={''}
                // extra={}
            >
                <ProTable<APIAccountList>
                    rowKey={'ID'}
                    options={false}
                    bordered={true}
                    search={false}
                    pagination={false}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={AccountListVO}
                    className={'antd-pro-table-port-list'}
                    headerTitle={
                        <Search
                            defaultValue={searchParams.Year} placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any)=> {
                                searchParams.Year = val;
                                await handleGetAccountList(searchParams);
                            }} />
                    }
                    toolbar={{actions: [<AccountDrawerForm key="primary" AccountPeriod={{}} isCreate={true} />]}}
                    // search={{
                    //     searchText: 'Search',
                    //     resetText: 'Reset',
                    // }}
                    // @ts-ignore
                    request={(params: APISearchAccount) => handleGetAccountList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default AccountIndex;