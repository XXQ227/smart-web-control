import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Divider, Input, message} from 'antd'
import AccountDrawerForm from '@/pages/sys-manager/account/account-form'
import {ACCOUNT_PERIOD_ES_STATUS_ENUM, ACCOUNT_PERIOD_STATE_ENUM, ACCOUNT_PERIOD_TYPE_ENUM} from '@/utils/enum'
import {CustomizeIcon} from '@/utils/units'
import moment from 'moment'

const { Search } = Input;

type APIAccountList = APIManager.AccountList;
type APISearchAccount = APIManager.SearchAccountParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchAccount = {
    finaYear: moment(new Date()).year().toString(),
    branchId: '0',
};

const AccountIndex: React.FC<RouteChildrenProps> = () => {
    const {
        queryAccountPeriod, openAccountPeriod, startCloseAccountPeriod
    } = useModel('manager.account', (res: any) => ({
        queryAccountPeriod: res.queryAccountPeriod,
        openAccountPeriod: res.openAccountPeriod,
        startCloseAccountPeriod: res.startCloseAccountPeriod,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [AccountListVO, setAccountListVO] = useState<APIAccountList[]>([]);

    /**
     * @Description: TODO 获取账期集合
     * @author XXQ
     * @date 2023/5/10
     * @param params    参数
     * @returns
     */
    async function handleGetAccountList(params: APISearchAccount) {
        setLoading(true);
        const result: API.Result = await queryAccountPeriod(params);
        if (result.success) {
            setAccountListVO(result.data);
            setLoading(false);
        } else {
            message.error(result.message);
            setLoading(false);
        }
        return result;
    }

    /**
     * @Description: TODO: 添加，编辑账期数据
     * @author XXQ
     * @date 2023/8/8
     * @param record
     * @param index
     * @param isCreate  是否是创建
     * @returns
     */
    const handleAddAccount = (record: any, index: number, isCreate: boolean) => {
        const accountArr: APIAccountList[] = AccountListVO.slice(0);
        accountArr.splice(index, isCreate ? 0 : 1, record);
        setAccountListVO(accountArr);
        console.log(accountArr);
    }

    const handleAccountState = async (record: any, state: string) => {
        console.log(record);
        setLoading(true);
        let result: API.Result = {success: false};
        if (state === 'open') {
            result = await openAccountPeriod({id: record.id});
            console.log(result);
            setLoading(false);
        } else if (state === 'startClose') {
            result = await startCloseAccountPeriod({id: record.id});
            setLoading(false);
            console.log(result);
        }
    }

    const columns: ProColumns<APIAccountList>[] = [
        {title: 'Year-Month', dataIndex: 'finaYearMonth', align: 'center', disable: true, search: false,},
        {
            title: 'Type', dataIndex: 'type', align: 'center', width: 100,
            disable: true, search: false, valueEnum: ACCOUNT_PERIOD_TYPE_ENUM,
        },
        {title: 'Code', dataIndex: 'code', align: 'center', width: 160, disable: true, search: false,},
        {title: 'Start Date', dataIndex: 'dateStart', align: 'center', width: 150, disable: true, search: false,},
        {title: 'End Date', dataIndex: 'dateEnd', align: 'center', width: 150, disable: true, search: false,},
        {
            title: 'Estimate', dataIndex: 'statusPredicted', align: 'center', width: 180,
            disable: true, search: false, valueEnum: ACCOUNT_PERIOD_ES_STATUS_ENUM,
        },
        {
            title: 'State', dataIndex: 'state', align: 'center', width: 180,
            disable: true, search: false, valueEnum: ACCOUNT_PERIOD_STATE_ENUM,
        },
        {title: 'Action', width: 140, disable: true, search: false, align: 'center',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <AccountDrawerForm AccountPeriod={record} index={index} handleAddAccount={handleAddAccount}/>
                        {record.state === 0 ?
                            <Fragment>
                                <Divider type='vertical'/>
                                <CustomizeIcon
                                    type={'icon-stop'} title={'Open'}
                                    onClick={()=> handleAccountState(record, 'open')}
                                />
                            </Fragment>
                            : record.state === 1 ?
                                <Fragment>
                                    <Divider type='vertical'/>
                                    <CustomizeIcon
                                        type={'icon-switch'} title={'Closing'}
                                        onClick={()=> handleAccountState(record, 'startClose')}
                                    />
                                    <Divider type='vertical'/>
                                    <CustomizeIcon
                                        type={record.IsPrepareClose ? 'icon-unlock-2' : 'icon-lock-2'}
                                    />
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
            header={{breadcrumb: {},}}
        >
            <ProCard title={''}>
                <ProTable<APIAccountList>
                    rowKey={'id'}
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
                            defaultValue={searchParams.finaYear} placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any)=> {
                                searchParams.finaYear = val;
                                await handleGetAccountList(searchParams);
                            }}
                        />
                    }
                    toolbar={{actions: [
                        <AccountDrawerForm
                            key="primary" AccountPeriod={{}} isCreate={true} index={0}
                            handleAddAccount={handleAddAccount}
                        />
                        ]
                    }}
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