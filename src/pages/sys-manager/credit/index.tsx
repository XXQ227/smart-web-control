import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import {Divider, message, Popconfirm, Input, Button} from 'antd'
import {history} from '@@/core/history'

const {Search} = Input;

type APICredit = APIManager.Credit;
type APISearchCredit = APIManager.SearchCreditParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchCredit = {
    type: '', currentPage: 1, pageSize: 20, ownershipEntityType: ''
};

const CreditIndex: React.FC<RouteChildrenProps> = () => {

    const {
        queryCreditControl, deleteCreditControl,
    } = useModel('manager.credit', (res: any) => ({
        queryCreditControl: res.queryCreditControl,
        deleteCreditControl: res.deleteCreditControl,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [CreditListVO, setCreditListVO] = useState<APICredit[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetCreditList(params: APISearchCredit) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryCreditControl(params);
        setCreditListVO(result.data);
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
    const handleOperate = async (record: any, state: string = 'form') => {
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
            const url = `/manager/credit/${state}/${btoa(record?.id || 0)}`;
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({pathname: url});
        }
    }


    const columns: ProColumns<APICredit>[] = [
        {
            title: 'Customer',
            dataIndex: 'settlementPartyName',
            align: 'left',
        },
        {
            title: 'Credit Line',
            dataIndex: 'creditLine',
            width: 200,
            align: 'center',
        },
        {
            title: 'Credit Days',
            dataIndex: 'creditDays',
            width: 200,
            align: 'center',
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expiryEndTime',
            width: 200,
            align: 'center',
        },
        {
            title: 'Credit Rating',
            dataIndex: 'creditLevel',
            width: 200,
            align: 'center',
        },
        {
            title: 'Applied by',
            dataIndex: 'createUserName',
            width: 200,
            align: 'center',
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleOperate(record)}/>
                        <Divider type='vertical'/>
                        <Popconfirm
                            onConfirm={() => handleOperate(record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
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
                <ProTable<APICredit>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={CreditListVO}
                    locale={{emptyText: 'No Data'}}
                    className={'antd-pro-table-port-list'}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                // searchParams.name = val;
                                await handleGetCreditList(searchParams);
                            }}/>
                    }
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchCredit) => handleGetCreditList(params)}
                />
                <Button onClick={handleOperate}>aa</Button>
            </ProCard>
        </PageContainer>
    )
}
export default CreditIndex;