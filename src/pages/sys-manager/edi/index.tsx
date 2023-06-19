import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined, CopyOutlined} from '@ant-design/icons'
import {Divider, message, Popconfirm, Input, Button} from 'antd'
import {history} from '@@/core/history'

const {Search} = Input;

type APIEDI = APIManager.EDI;
type APISearchEDI = APIManager.SearchEDIParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchEDI = {
    name: '', branchId: '0', currentPage: 1, pageSize: 20
};

const EDIConfigIndex: React.FC<RouteChildrenProps> = () => {

    const {
        queryEDI, deleteEDI,
    } = useModel('manager.edi', (res: any) => ({
        queryEDI: res.queryEDI,
        deleteEDI: res.deleteEDI,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [EDIListVO, setEDIListVO] = useState<APIEDI[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetEDIList(params: APISearchEDI) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryEDI(params);
        setEDIListVO(result.data);
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
            const result: any = await deleteEDI({id: record.id});
            if (result.success) {
                const newData: APIEDI[] = EDIListVO.filter((item: APIEDI) => item.id !== record.id);
                setEDIListVO(newData);
                message.success('Success!');
            } else {
                message.error(result.Content);
            }
            setLoading(false);
        } else {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            const url = `/manager/edi/${state}/${btoa(record?.id || 0)}`;
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({pathname: url})
        }
    }


    const columns: ProColumns<APIEDI>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            align: 'left',
        },
        {
            title: 'Receiver',
            dataIndex: 'receiverName',
            width: 300,
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'Sender Code',
            dataIndex: 'senderCode',
            width: 100,
            align: 'center',
        },
        {
            title: 'Receiver Code',
            dataIndex: 'receiverCode',
            width: 100,
            align: 'center',
        },
        {
            title: 'Signer Code',
            dataIndex: 'signerCode',
            width: 100,
            align: 'center',
        },
        {
            title: 'Booking No.',
            dataIndex: 'bookingNoPrefixes',
            width: 100,
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
                        <CopyOutlined color={'#1765AE'} onClick={() => handleOperate(record, 'copy')}/>
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
                <ProTable<APIEDI>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={EDIListVO}
                    className={'antd-pro-table-port-list'}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.name = val;
                                await handleGetEDIList(searchParams);
                            }}/>
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={handleOperate} type={'primary'} icon={<PlusOutlined/>}>
                                Add EDI
                            </Button>
                        ]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchEDI) => handleGetEDIList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default EDIConfigIndex;