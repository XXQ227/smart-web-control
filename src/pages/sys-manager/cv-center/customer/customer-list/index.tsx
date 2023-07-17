import React, {useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProTable} from '@ant-design/pro-components';
import {Button, message,} from 'antd';
import {useModel} from 'umi';
import {getUserID} from '@/utils/auths';
import {history} from '@@/core/history'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import ls from "lodash";

export type LocationState = Record<string, unknown>;
type APIBUPInfo = APIManager.BUPInfo;
type APIBUSearchParams = APIManager.BUSearchParams;

// TODO: 获取BUP列表的请求参数
const initSearchParam: APIBUSearchParams = {
    currentPage: 1,
    pageSize: 20,
    OracleID: "",
    OracleIDSupplier: "",
    CustomerUBSID: "",
    SupplierUBSID: "",
    TaxNum: "",
    CTName: "",
    NameFull: "",
    CTType: 1,
    UserID: getUserID(),
};

const initPagination = {
    current: 1,
    pageSize: 20,
    total: 0,
}

const CVCenterList: React.FC<RouteChildrenProps> = (props) => {
    const searchQueryBranch = ls.cloneDeep(initSearchParam)
    const searchLocation = props.location.state ? (props.location.state as LocationState)?.searchParams : '';

    const {
        CVInfoList, getGetCTPByStr
    } = useModel('manager.cv-center', (res: any)=> ({
        CVInfoList: res.CVInfoList,
        getGetCTPByStr: res.getGetCTPByStr,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [cvInfoList, setCVInfoList] = useState<APIBUPInfo[]>(CVInfoList);
    const [searchParams, setSearchParams] = useState<APIBUSearchParams>(searchLocation || searchQueryBranch);
    const [pagination, setPagination] = useState<any>(initPagination)

    /**
     * @Description: TODO 获取单票数据集合
     * @author LLS
     * @date 2023/7/13
     * @param params    参数
     * @returns
     */
    async function handleGetGetCTPByStr (params: APIBUSearchParams){
        setLoading(true);
        params.CTName = params.NameFull;
        const result: API.Result = await getGetCTPByStr(params);
        // const result: APIManager.CVResultInfo = await getGetCTPByStr(params);
        if (result.success) {
            setCVInfoList(result.data);
            setPagination({
                current: result.current,
                pageSize: result.size,
                total: result.total,
            });
        } else {
            message.error(result.message);
        }
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑 BU 信息
     * @author LLS
     * @date 2023/7/12
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBUP = (record: APIBUPInfo) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        history.push({
            pathname: `/manager/cv-center/customer/form/${btoa(record.id)}`,
            state: {
                searchParams: searchParams,
            },
        });
    }

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param record    操作当前 行
     * @returns
     */
    const handleOperateJob = (record: any) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/cv-center/customer/form/${btoa(record?.CTPID || 0)}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }

    const columns: ProColumns<APIBUPInfo>[] = [
        {
            title: 'CV Type',
            dataIndex: 'CTTypeItem',
            width: 123,
            disable: true,
            align: 'center',
        },
        {
            title: 'CV Identity',
            dataIndex: 'TaxCode',
            width: 180,
            disable: true,
            align: 'center',
        },
        {
            title: 'CV Name',
            dataIndex: 'NameFull',
            disable: true,
        },
        {
            title: 'MDM Number',
            dataIndex: 'CDHCode',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'CV Center Number',
            dataIndex: 'CustSupCode',
            width: 140,
            disable: true,
            align: 'center',
        },
        {
            title: 'OracleID(C)',
            dataIndex: 'OracleID',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'OracleID(V)',
            dataIndex: 'OracleIDSupplier',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'Freezen',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            disable: true,
            align: 'center',
            render: (text, record) =>
                <EditOutlined color={'#1765AE'} onClick={() => handleOperateJob(record)}/>,
        },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
            /*extra={
                <Button key={'add'} onClick={handleOperateJob} type={'primary'} icon={<PlusOutlined/>}>
                    Add Customer
                </Button>
            }*/
        >
            {/*<ProCard className={'ant-card ant-card-pro-table'}>*/}
                <ProTable<APIBUPInfo>
                    rowKey={'ID'}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={cvInfoList}
                    /*search={{
                        layout: 'vertical',
                        defaultCollapsed: false,
                        // hiddenNum: 1,
                    }}*/
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={()=> handleEditBUP({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                                Add
                            </Button>
                        ]
                    }}
                    pagination={{
                        showSizeChanger: true,
                        ...pagination,
                        pageSizeOptions: [20, 30, 50, 100],
                        onChange: (page, pageSize) => {
                            // searchParams.currentPage = page;
                            searchParams.pageSize = pageSize;
                            setSearchParams(searchParams);
                        },
                    }}
                    // @ts-ignore
                    // request={(params: APIBUSearchParams)=> handleGetGetCTPByStr(params)}
                    request={handleGetGetCTPByStr}
                />
            {/*</ProCard>*/}
            {/*<FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>*/}
        </PageContainer>
    )
}
export default CVCenterList;