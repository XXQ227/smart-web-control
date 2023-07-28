import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ActionType, ColumnsState, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {history, useModel} from 'umi';
import {IconFont} from '@/utils/units';
import {getUserID} from '@/utils/auths';

type APICJobListItem = APIModel.CJobListItem;

// TODO: 获取单票集的请求参数
const cjobListParams: APIModel.SearchJobParams = {
    searchKey: '',
    customerOrCargoId: '',
    branchId: '0',
    currentPage: 1,
    pageSize: 20,
};

const operationList = [
    {key: 'edit', type: 1, label: '编辑'},
    {key: 'charge', type: 4, label: '费用'},
    {key: 'copy', type: 2, label: '复制'},
    {key: 'cancel', type: 3, label: '退关'}
];

const columnsStateStr = '{"Code":{"fixed":"left"},"PrincipalNameEN":{"show":true},"MBOLNum":{"show":true},"OceanTransportType":{"show":true},"CreateDate":{"show":true},"option":{"show":true}}';

const JobList: React.FC<RouteChildrenProps> = () => {
    const {
        queryJobList,
    } = useModel('job.joblist', (res: any) => ({
        queryJobList: res.queryJobList,
    }));
    const initInfo = useModel('@@initialState');
    const initialState: any = initInfo?.initialState || {};
    // 拿到所选的分组信息
    const groupInfo: {id: any, name: string} = initialState?.groupInfo || {};

    const [loading, setLoading] = useState<boolean>(false);
    const [groupId, setGroupID] = useState(null);
    const [jobList, setJobList] = useState<APICJobListItem[]>([]);

    useEffect(()=> {
        if (groupInfo.id && groupInfo.id !== groupId) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            getCJobList(cjobListParams, groupInfo.id !== groupId).then()
            setGroupID(groupInfo.id);
        }
    }, [groupId, groupInfo]);

    /**
     * @Description: TODO 单票操作（编辑、复制、退关）
     * @author XXQ
     * @date 2023/2/13
     * @param type      操作类型【1：编辑；2：复制；3、退关】
     * @param record    被操作单票行
     * @returns
     */
    const handleOperateJob = (type: number, record: any) => {
        if (type === 1 || type === 2 || type === 4) {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            const url = `/job/job-info/${type === 4 ? 'charge' : 'form'}/${btoa(record?.id || '0')}`;
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({
                pathname: url,
                // TODO: 不用 query 的原因：query 的参数会拼接到 url 地址栏上，用 params (可以是其他名<自定义>)，则可以隐藏
                // pathname: `/job/job-info`,
                /*query: {
                    id: btoa(record?.id || '0'),
                    bizType4ID: btoa(record?.BizType4ID || '0'),
                },*/
            })
        } else if (type === 3) {
            console.log('此处调用退关方法');
        }
    }

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @param isLoading 是否调用接口
     * @returns
     */
    const getCJobList = async (params: any, isLoading: boolean = false) => {
        let result: APIModel.RuleCJobList = {};
        setLoading(true);
        if (isLoading) {
            // TODO: 分页查询【参数页】
            params.PageNum = params.current || 1;
            result = (await queryJobList(params as APIModel.SearchJobParams)) || {};
            setJobList(result.data || []);
        }
        setLoading(false);
        return result;
    }

    // TODO: 单票显示列
    const columns: ProColumns<APICJobListItem>[] = [
        {
            title: 'Job Code',
            dataIndex: 'Code',
            width: 140,
        },
        {
            title: 'Customer',
            dataIndex: 'PrincipalNameEN',
        },
        {
            title: 'PO Num',
            dataIndex: 'MBOLNum',
            width: 130,
            ellipsis: true,
        },
        {
            title: 'Taking Date',
            dataIndex: 'CreateDate',
            valueType: "date",
            width: 110,
            align: 'center',
        },
        {
            title: 'Complete Date',
            dataIndex: 'LockDate',
            valueType: "date",
            width: 110,
            align: 'center',
        },
        {
            title: 'Action',
            valueType: 'option',
            align: 'center',
            key: 'option',
            width: 160,
            render: (text, record) => {
                return operationList?.map(x=>
                    <a key={x.key} onClick={() => handleOperateJob(x.type, record)}>
                        {x.label}
                    </a>
                )
            },
        },
    ];

    const actionRef = useRef<ActionType>();

    // TODO: 调整 ProTable 显示的列宽
    const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>(JSON.parse(columnsStateStr) || {});

    return (
        <PageContainer
            header={{breadcrumb: {}}}
            extra={[
                <IconFont key={1} type={'icon-create'} style={{fontSize: 24}} onClick={()=> handleOperateJob(1, {})} />,
            ]}
        >
            <ProTable className={'ant-card-pro-table'}>
                <ProTable<APICJobListItem>
                    rowKey={'ID'}
                    search={false}
                    options={false}
                    bordered={true}
                    columns={columns}
                    dataSource={jobList}
                    actionRef={actionRef}
                    params={cjobListParams}
                    loading={loading}
                    locale={{emptyText: 'No Data'}}
                    className={'ant-pro-table-edit antd-pro-table-ant-space'}
                    request={(params) => getCJobList(params, !!groupInfo.id)}
                    columnsState={{
                        value: columnsStateMap,
                        onChange: (str) => {
                            // console.log(JSON.stringify(str));
                            setColumnsStateMap(str);
                        },
                    }}
                />
            </ProTable>
        </PageContainer>
    )
}
export default JobList;
