import React, {useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProTable} from '@ant-design/pro-components';
import type { TabsProps} from 'antd';
import {Button, Tabs} from 'antd';
import {useModel} from 'umi';
import {USER_ID} from '@/utils/auths';
import {history} from '@@/core/history'
import {EditOutlined} from '@ant-design/icons'

type APIBU = APISystem.BU;
type APISearchBUParams = APISystem.SearchBUParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchBUParams = {
    OracleID: "",
    OracleIDSupplier: "",
    CustomerUBSID: "",
    SupplierUBSID: "",
    TaxNum: "",
    CTName: "",
    PageNum: 1,
    PageSize: 15,
    CTType: '10',
    UserID: USER_ID(),
};

const SettlementList: React.FC<RouteChildrenProps> = () => {

    const {
        CVInfoList, getGetCTPByStr
    } = useModel('system.business-unit', (res: any)=> ({
        CVInfoList: res.CVInfoList,
        getGetCTPByStr: res.getGetCTPByStr,
    }));
    const { initialState } = useModel('@@initialState');
    // TODO: 用户消息
    const userInfo: any = initialState?.userInfo || {};


    const [activeKey, setActiveKey] = useState<string>('10');
    const [loading, setLoading] = useState<boolean>(false);
    const [cvInfoList, setCVInfoList] = useState<APIBU[]>(CVInfoList);


    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetGetCTPByStr (params: APISearchBUParams){
        setLoading(true);
        params.CTName = params.NameFull;
        params.CTType = activeKey;
        // TODO: 分页查询【参数页】
        params.PageNum = params.current || 1;
        const result: APISystem.CVResultInfo = await getGetCTPByStr(params);
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
        const url = `/manager/cv-center/cv-approval/customer/form/${btoa(record?.CTPID)}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }

    const handleTabsChange = (key: string) => {
        setCVInfoList([]);
        setActiveKey(key);
    };

    const columns: ProColumns<APIBU>[] = [
        {
            title: 'CV Identity',
            dataIndex: 'InternalCompanyCode',
            width: 100,
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
            title: 'Action',
            width: 80,
            disable: true,
            align: 'center',
            render: (text, record) => {
                return (
                    <EditOutlined color={'#1765AE'} onClick={() => handleOperateJob(record)}/>
                )
            },
        },
    ];

    // TODO: 市场部显示 所属公司
    if (userInfo?.AuthIDList?.includes(87)) {
        columns.splice(-1, 0, {
            title: 'Branch',
            dataIndex: 'BranchName',
            width: 123,
            disable: true,
            align: 'center',
        });
    }

    const CVProTable = (key: string) => (
        <ProTable<APIBU>
            rowKey={'ID'}
            search={false}
            options={false}
            bordered={true}
            columns={columns}
            loading={loading}
            params={searchParams}
            dataSource={cvInfoList}
            // @ts-ignore
            request={(params: APISearchBUParams)=> activeKey === key ? handleGetGetCTPByStr(params) : null}
        />
    );

    const items: TabsProps['items'] = [
        {key: '10', label: 'Pending', children: CVProTable('10')},
        {key: '2', label: 'Approval', children: CVProTable('2')},
    ];


    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card ant-card-pro-table ant-tabs-style'}>
                <Tabs destroyInactiveTabPane={true} activeKey={activeKey} items={items} onChange={handleTabsChange} />
            </ProCard>
            <FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default SettlementList;