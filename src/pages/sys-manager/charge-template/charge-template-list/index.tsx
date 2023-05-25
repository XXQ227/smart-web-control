import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined, CopyOutlined} from '@ant-design/icons'
import {Divider, message, Popconfirm, Input, Button} from 'antd'
import {getUserID} from '@/utils/auths'
import {history} from '@@/core/history'

const {Search} = Input;

type APICGTemp = APIManager.CGTemp;
type APISearchCGTemp = APIManager.SearchCGTempParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchCGTemp = {
    Name: '',
    UserID: getUserID()
};

const CGTempListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        CGTempList, getCGTempList, delTempByID
    } = useModel('manager.charge-template', (res: any) => ({
        CGTempList: res.CGTempList,
        getCGTempList: res.getCGTempList,
        delTempByID: res.delTempByID,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [CGTempListVO, setCGTempListVO] = useState<APICGTemp[]>(CGTempList || []);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetCGTempList(params: APISearchCGTemp) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.PageNum = params.current || 1;
        // params.pageSize = params.PageSize || 15;
        // params.PageSize = params.PageSize || 15;
        const result: APIManager.CGTempResult = await getCGTempList(params);
        setCGTempListVO(result.data);
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
    const handleOperateCGTemplate = async (record: any, state: string = 'form') => {
        if (state === 'delete') {
            setLoading(true);
            // TODO: 删除费用模板
            const result: any = await delTempByID({ID: record.ID});
            if (result.Result) {
                const newData: APICGTemp[] = CGTempListVO.filter((item: APICGTemp) => item.ID !== record.ID);
                setCGTempListVO(newData);
                message.success('Success!');
            } else {
                message.error(result.Content);
            }
            setLoading(false);
        } else {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            const url = `/manager/charge-template/${state}/${btoa(record?.ID || 0)}`;
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({pathname: url})
        }
    }


    const columns: ProColumns<APICGTemp>[] = [
        {
            title: 'Template Name',
            dataIndex: 'Name',
            align: 'left',
        },
        {
            title: 'Creator',
            dataIndex: 'CreatorName',
            width: 160,
            align: 'center',
        },
        {
            title: 'Create Date',
            dataIndex: 'CreateDate',
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
                        <EditOutlined color={'#1765AE'} onClick={() => handleOperateCGTemplate(record)}/>
                        <Divider type='vertical'/>
                        <CopyOutlined color={'#1765AE'} onClick={() => handleOperateCGTemplate(record, 'copy')}/>
                        <Divider type='vertical'/>
                        <Popconfirm
                            onConfirm={() => handleOperateCGTemplate(record, 'delete')}
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
                <ProTable<APICGTemp>
                    rowKey={'ID'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={CGTempListVO}
                    className={'antd-pro-table-port-list'}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async (val: any) => {
                                searchParams.Name = val;
                                await handleGetCGTempList(searchParams);
                            }}/>
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={handleOperateCGTemplate} type={'primary'} icon={<PlusOutlined/>}>
                                Add Charge Template
                            </Button>
                        ]
                    }}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchCGTemp) => handleGetCGTempList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default CGTempListIndex;