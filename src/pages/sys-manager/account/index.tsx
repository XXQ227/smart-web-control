import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Divider, Input, message} from 'antd'
import {ACCOUNT_PERIOD_ES_STATUS_ENUM, ACCOUNT_PERIOD_STATE_ENUM, ACCOUNT_PERIOD_TYPE_ENUM} from '@/utils/enum'
import {IconFont} from '@/utils/units'
import moment from 'moment'
import AddAccountModal from "@/pages/sys-manager/account/AddAccountModal";
import {BRANCH_ID} from "@/utils/auths";

const { Search } = Input;

type APIAccountPeriod = APIManager.AccountPeriod;
type APISearchAccountParams = APIManager.SearchAccountParams;

// TODO: 获取账期列表的请求参数
const searchParams: APISearchAccountParams = {
    finaYear: moment(new Date()).year().toString(),
    branchId: BRANCH_ID(),
};

const AccountListIndex: React.FC<RouteChildrenProps> = () => {
    const {
        queryAccountPeriod, openAccountPeriod, startCloseAccountPeriod, endCloseAccountPeriod
    } = useModel('manager.account', (res: any) => ({
        queryAccountPeriod: res.queryAccountPeriod,
        openAccountPeriod: res.openAccountPeriod,
        startCloseAccountPeriod: res.startCloseAccountPeriod,
        endCloseAccountPeriod: res.endCloseAccountPeriod,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [AccountListVO, setAccountListVO] = useState<APIAccountPeriod[]>([]);

    /**
     * @Description: TODO 获取账期数据集合
     * @author XXQ
     * @date 2023/5/10
     * @param params    参数
     * @returns
     */
    async function handleGetAccountPeriod(params: APISearchAccountParams) {
        setLoading(true);
        const result: API.Result = await queryAccountPeriod(params);
        if (result.success) {
            setAccountListVO(result.data);
        } else {
            message.error(result.message);
        }
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 开启账期、开始关账、结束关账
     * @author XXQ
     * @date 2023/8/8
     * @param record
     * @param state
     * @returns
     */
    const handleAccountState = async (record: any, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        if (state === 'open') {
            result = await openAccountPeriod({id: record.id});
        } else if (state === 'startClose') {
            result = await startCloseAccountPeriod({id: record.id});
        } else if (state === 'endClose') {
            result = await endCloseAccountPeriod({id: record.id});
        }
        if (result?.success) {
            message.success('Process completed');
            await handleGetAccountPeriod(searchParams);
        } else {
            message.error(result?.message);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 添加，编辑账期数据后刷新列表数据
     * @author LLS
     * @date 2023/8/14
     * @returns
     */
    const handleChange = async () => {
        await handleGetAccountPeriod(searchParams);
    }

    const columns: ProColumns<APIAccountPeriod>[] = [
        {title: 'Year', dataIndex: 'finaYear', align: 'center', width: 100,},
        {title: 'Month', dataIndex: 'finaMonth', align: 'center', width: 100,},
        // TODO: 期间类型 1-正常账期 2-补录账期
        {title: 'Type', dataIndex: 'type', align: 'center', width: 110, valueEnum: ACCOUNT_PERIOD_TYPE_ENUM,},
        {title: 'Start Date', dataIndex: 'dateStart', align: 'center', width: 150,},
        {title: 'End Date', dataIndex: 'dateEnd', align: 'center', width: 150,},
        {
            title: 'Full Estimate', dataIndex: 'statusPredicted', align: 'center', width: 180,
            valueEnum: ACCOUNT_PERIOD_ES_STATUS_ENUM,
        },
        {title: 'State', dataIndex: 'state', align: 'center', width: 180, valueEnum: ACCOUNT_PERIOD_STATE_ENUM,},
        {
            title: 'Action', width: 100, align: 'center', className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <AddAccountModal
                            id={record.id}
                            state={record.state}
                            handleChange={handleChange}
                        />
                        {
                            record.state === 0 ?
                                <Fragment>
                                    <Divider type='vertical'/>
                                    <IconFont
                                        type={'icon-stop'} title={'Open'}
                                        onClick={()=> handleAccountState(record, 'open')}
                                    />
                                </Fragment>
                                : record.state === 1 ?
                                    <Fragment>
                                        <Divider type='vertical'/>
                                        <IconFont
                                            type={'icon-switch'} title={'Closing'}
                                            onClick={()=> handleAccountState(record, 'startClose')}
                                        />
                                    </Fragment>
                                    : record.state === 2 ?
                                        <Fragment>
                                            <Divider type='vertical'/>
                                            <IconFont
                                                type={'icon-end-close-Account'} title={'Closed'}
                                                onClick={()=> handleAccountState(record, 'endClose')}
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
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-pro-table'}>
                <ProTable<APIAccountPeriod>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={AccountListVO}
                    pagination={false}
                    className={'antd-pro-table-port-list'}
                    headerTitle={
                        <Search
                            placeholder=''
                            enterButton="Search"
                            loading={loading}
                            defaultValue={searchParams.finaYear}
                            onSearch={async (val: any)=> {
                                searchParams.finaYear = val;
                                await handleGetAccountPeriod(searchParams);
                            }}
                        />
                    }
                    toolbar={{
                        actions: [
                            <AddAccountModal
                                id={'0'}
                                isCreate
                                handleChange={handleChange}
                            />
                        ]
                    }}
                    // @ts-ignore
                    request={(params: APISearchAccountParams) => handleGetAccountPeriod(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default AccountListIndex;