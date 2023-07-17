import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import type {TabsProps} from 'antd';
import {Divider, Input, message, Popconfirm, Tabs} from 'antd'
import {history} from '@@/core/history'
import {CustomizeIcon} from '@/utils/units'

const {Search} = Input;

type APICredit = APIManager.Credit;
type APISearchCredit = APIManager.SearchCreditParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchCredit = {
    type: '', currentPage: 1, pageSize: 20, ownershipEntityType: ''
};

const CreditIndex: React.FC<RouteChildrenProps> = () => {

    const {
        queryCreditControl, queryUnCreditControl, deleteCreditControl,
    } = useModel('manager.credit', (res: any) => ({
        queryCreditControl: res.queryCreditControl,
        queryUnCreditControl: res.queryUnCreditControl,
        deleteCreditControl: res.deleteCreditControl,
    }));


    const [loading, setLoading] = useState<boolean>(false);
    const [CreditListVO, setCreditListVO] = useState<APICredit[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param tabKey    当前所在的
     * @param params    参数
     * @returns
     */
    async function handleGetCreditList(tabKey: string = '1', params: APISearchCredit) {
        setLoading(true);
        let result: API.Result;
        if (tabKey === '1') {
            // TODO: 分页查询【参数页】
            result = await queryUnCreditControl(params);
            setCreditListVO(result.data);
        } else {
            // TODO: 分页查询【参数页】
            result = await queryCreditControl(params);
            setCreditListVO(result.data);
        }
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param tabKey    操作当前 行
     * @param record    操作当前 行
     * @param state     操作状态
     * @returns
     */
    const handleOperate = async (tabKey: string, record: any, state: string = 'form') => {
        if (state === 'delete') {
            setLoading(true);
            // TODO: 删除费用模板
            const result: any = await deleteCreditControl({id: record.id});
            if (result.Result) {
                const newData: APICredit[] = CreditListVO.filter((item: APICredit) => item.id !== record.id);
                setCreditListVO(newData);
                message.success('Success!');
            } else {
                message.error(result.Content);
            }
            setLoading(false);
        } else {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            let url = `/manager/credit/${state}`;
            // TODO: 未创建的信控列表，id = 客户 id
            if (tabKey === '1') {
                url += `/${btoa('0')}/${btoa(record?.id)}`;
            } else {
                url += `/${btoa(record?.id)}`;
            }
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({pathname: url});
        }
    }

    const onChange = (key: string) => {
        console.log(key);
    };

    const columnsFunc = (tabKey: string) => {
        const columns: ProColumns<APICredit>[] = [
            {title: 'Customer', dataIndex: 'customerName', align: 'left',},
            {title: 'Credit Line/10k', dataIndex: 'creditLine', width: 110, align: 'center',},
            {title: 'Credit Days', dataIndex: 'creditDays', width: 100, align: 'center',},
            {title: 'Expiration Date', dataIndex: 'expiryEndTime', width: 130, align: 'center',},
            {title: 'Credit Rating', dataIndex: 'creditLevel', width: 200, align: 'center',},
            {title: 'Applied by', dataIndex: 'applicantName', width: 160, align: 'center',},
            {title: 'Branch by', dataIndex: 'applicantBranchName', width: 110, align: 'center',},
            {
                title: 'Action',
                width: 100,
                align: 'center',
                render: (text, record) => {
                    return (
                        tabKey === '1' ?
                            <Fragment>
                                <EditOutlined color={'#1765AE'} onClick={() => handleOperate(tabKey, record)}/>
                                <Divider type='vertical'/>
                                <Popconfirm
                                    onConfirm={() => handleOperate(tabKey, record, 'delete')}
                                    title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                                >
                                    <DeleteOutlined color={'red'}/>
                                </Popconfirm>
                            </Fragment>
                            :
                            <Fragment>
                                <EditOutlined color={'#1765AE'} onClick={() => handleOperate(tabKey, record)}/>
                                <Divider type='vertical'/>
                                <CustomizeIcon
                                    type={'icon-approval'} color={'#1765AE'}
                                    onClick={() => handleOperate(tabKey, record, 'approval')}
                                />
                            </Fragment>
                    )
                },
            },
        ];
        return columns;
    }

    const creditTable = (tabKey: string) => {
        return (
            <ProTable<APICredit>
                rowKey={'id'}
                search={false}
                options={false}
                bordered={true}
                loading={loading}
                params={searchParams}
                dataSource={CreditListVO}
                columns={columnsFunc(tabKey)}
                locale={{emptyText: 'No Data'}}
                className={'antd-pro-table-port-list'}
                headerTitle={
                    <Search
                        placeholder='' enterButton="Search" loading={loading}
                        onSearch={async (val: any) => {
                            // searchParams.name = val;
                            await handleGetCreditList(tabKey, searchParams);
                        }}/>
                }
                pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                // @ts-ignore
                request={(params: APISearchCredit) => handleGetCreditList(tabKey, params)}
            />
        )
    }

    /*// TODO: 授信状态：
    // TODO: 1、Uncredited：已通过客户审核，但还未授信的客户。
    // TODO: 2、In Approval：正在授信审批的过程中，还未完成。
    // TODO: 3、Credited：完成授信，并且在正常的信控状态中。
    // TODO: 4、Insufficient：”授信额度“或”授信天数“超出的客户。
    // TODO: 5、Expired：超期失效的授信，因为太多，所以不显示数量*/
    const items: TabsProps['items'] = [
        {key: '1', label: `Pending creation`, children: creditTable('1'),},
        // TODO: 审批到自己的授信任务清单
        {key: '2', label: `Pending List`, children: creditTable('2'),},
        {key: '3', label: `Credit List`, children: creditTable('3'),},
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-pro-table'}>
                <Tabs defaultActiveKey='1' items={items} destroyInactiveTabPane={true} onChange={onChange}/>
            </ProCard>
        </PageContainer>
    )
}
export default CreditIndex;