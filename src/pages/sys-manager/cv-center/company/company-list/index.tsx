import React, {useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProTable} from '@ant-design/pro-components';
import {Button,} from 'antd';
import {useModel} from 'umi';
import {getUserID} from '@/utils/auths';
import {history} from '@@/core/history'
import {EditOutlined} from '@ant-design/icons'

type APICVInfo = APIManager.CVInfo;
type APICVSearchParams = APIManager.CVSearchParams;

// TODO: 获取单票集的请求参数
const searchParams: APICVSearchParams = {
    OracleID: "",
    OracleIDSupplier: "",
    CustomerUBSID: "",
    SupplierUBSID: "",
    TaxNum: "",
    CTName: "",
    PageNum: 1,
    PageSize: 15,
    CTType: 1,
    UserID: getUserID(),
};

const CVCenterList: React.FC<RouteChildrenProps> = () => {

    const {
        CVInfoList, getGetCTPByStr
    } = useModel('manager.cv-center', (res: any)=> ({
        CVInfoList: res.CVInfoList,
        getGetCTPByStr: res.getGetCTPByStr,
    }));


    const [loading, setLoading] = useState<boolean>(false);
    const [cvInfoList, setCVInfoList] = useState<APICVInfo[]>(CVInfoList);


    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetGetCTPByStr (params: APICVSearchParams){
        setLoading(true);
        params.CTName = params.NameFull;
        // TODO: 分页查询【参数页】
        params.PageNum = params.current || 1;
        const result: APIManager.CVResultInfo = await getGetCTPByStr(params);
        setCVInfoList(result.data);
        setLoading(false);
        return result;
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
        const url = `/manager/cv-center/company/form/${btoa(record?.CTPID)}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }

    const columns: ProColumns<APICVInfo>[] = [
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
            hideInSearch: true,
        },
        {
            title: 'CV Center Number',
            dataIndex: 'CustSupCode',
            width: 140,
            disable: true,
            align: 'center',
            hideInSearch: true,
        },
        {
            title: 'OracleID(C)',
            dataIndex: 'OracleID',
            width: 100,
            disable: true,
            align: 'center',
            hideInSearch: true,
        },
        {
            title: 'OracleID(V)',
            dataIndex: 'OracleIDSupplier',
            width: 100,
            disable: true,
            align: 'center',
            hideInSearch: true,
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
        >
            <ProCard className={'ant-card ant-card-pro-table'}>
                <ProTable<APICVInfo>
                    rowKey={'ID'}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={cvInfoList}
                    search={{
                        layout: 'vertical',
                        defaultCollapsed: false,
                        // hiddenNum: 1,
                    }}
                    // @ts-ignore
                    request={(params: APICVSearchParams)=> handleGetGetCTPByStr(params)}
                />
            </ProCard>
            <FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default CVCenterList;