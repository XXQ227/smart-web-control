import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import {Divider} from 'antd'
import PortDrawerForm from '@/pages/sys-manager/port/port-drawer-form'
import {getUserID} from '@/utils/auths'
import {history} from '@@/core/history'

type APICGTemp = APIManager.CGTemp;
type APISearchCGTemp = APIManager.SearchCGTempParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchCGTemp = {
    Name: '',
    UserID: getUserID()
};

const CGTempListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        CGTempList, getCGTempList, DelTempByID
    } = useModel('manager.charge-template', (res: any) => ({
        CGTempList: res.CGTempList,
        getCGTempList: res.getCGTempList,
        DelTempByID: res.DelTempByID,
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
    const handleOperateCGTemplate = async (record: any, state?: string) => {
        if (state) {
            // TODO: 删除费用模板
            const result: any = await DelTempByID({ID: getUserID()});
            if (result.Result) {

            }
        } else {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            const url = `/manager/charge-template/form/${btoa(record?.ID)}`;
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
                        <DeleteOutlined color={'red'} onClick={() => handleOperateCGTemplate(record, 'delete')}/>
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
            extra={<PortDrawerForm PortInfo={{}} isCreate={true}/>}
        >
            <ProCard>
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
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchCGTemp) => handleGetCGTempList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default CGTempListIndex;