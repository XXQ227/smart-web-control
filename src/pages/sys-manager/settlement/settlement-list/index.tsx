import React, {useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProTable} from '@ant-design/pro-components';
import {Button,} from 'antd';
import {useModel} from 'umi';
import {getUserID} from '@/utils/auths';

type APICVInfoList = APIModel.CVInfoList;
type APICVSearchParams = APIModel.CVSearchParams;

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

const SettlementList: React.FC<RouteChildrenProps> = () => {

    const {
        CVInfoList, getGetCTPByStr
    } = useModel('manager.settlement', (res: any)=> ({
        CVInfoList: res.CVInfoList,
        getGetCTPByStr: res.getGetCTPByStr,
    }));


    const [loading, setLoading] = useState<boolean>(false);
    const [cvInfoList, setCVInfoList] = useState<APICVInfoList[]>(CVInfoList);


    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @param isLoading 是否调用接口
     * @returns
     */
    async function handleGetGetCTPByStr (params: APICVSearchParams, isLoading: boolean = false){
        setLoading(true);
        console.log(params);
        // TODO: 分页查询【参数页】
        params.PageNum = params.current || 1;
        const result: APIModel.RuleCJobList = await getGetCTPByStr(params);
        setCVInfoList(result.data || []);
        setLoading(false);
        return result;
    }

    const columns: ProColumns<APIModel.CVInfoList>[] = [
        {
            title: 'CV Type',
            dataIndex: 'Code',
            width: 80,
            disable: true,
            align: 'center',
        },
        {
            title: 'CV Identity',
            dataIndex: 'TaxNum',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'CV Name',
            dataIndex: 'TaxNum',
            disable: true,
        },
        {
            title: 'MDM Number',
            dataIndex: 'TaxNum',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'CV Center Number',
            dataIndex: 'TaxNum',
            width: 140,
            disable: true,
            align: 'center',
        },
        {
            title: 'OracleID(C)',
            dataIndex: 'TaxNum',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'OracleID(V)',
            dataIndex: 'TaxNum',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'TaxNum',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            disable: true,
            align: 'center',
        },
    ];


    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card ant-card-pro-table'}>
                <ProTable<APIModel.CVInfoList>
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
                        hiddenNum: 1,
                    }}
                    request={(params: APICVSearchParams)=> handleGetGetCTPByStr(params)}
                />
            </ProCard>
            <FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default SettlementList;