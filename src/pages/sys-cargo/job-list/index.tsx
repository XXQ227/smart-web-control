import React, {useEffect, useRef, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns, ActionType, ColumnsState} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {history, useModel} from 'umi';
import {useIntl} from '@@/plugin-locale/localeExports';
import {getTitleInfo, IconFont} from '@/utils/units';
import {getUserID} from '@/utils/auths';
import {OceanTransportTypeEnum} from '@/utils/enum'

type APICJobListItem = APIModel.CJobListItem;

// TODO: 获取单票集的请求参数
const cjobListParams: APIModel.GetCJobListInfo = {
    Key: '',
    TimeLimitType: 1,
    AuthorityType: 2,
    TabID: 1,
    UserID: getUserID(),
    IsClickSearch: false,
    PageSize: 20,
    PageNum: 1,
};

const operationList = [
    {key: 'edit', type: 1, label: '编辑'},
    {key: 'charge', type: 4, label: '费用'},
    {key: 'copy', type: 2, label: '复制'},
    {key: 'cancel', type: 3, label: '退关'}
];

const columnsStateStr = '{"Code":{"fixed":"left"},"PrincipalNameEN":{"show":true},"MBOLNum":{"show":true},"OceanTransportType":{"show":true},"CreateDate":{"show":true},"option":{"show":true}}';

const JobList: React.FC<RouteChildrenProps> = () => {
    const joblist = useModel('cargo.joblist');
    const initInfo = useModel('@@initialState');
    const initialState: any = initInfo?.initialState || {};
    // 拿到所选的分组信息
    const groupInfo: {id: any, name: string} = initialState?.groupInfo || {};

    const [loading, setLoading] = useState<boolean>(false);
    const [groupId, setGroupID] = useState(null);
    const [jobList, setJobList] = useState<APICJobListItem[]>([]);

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    useEffect(()=> {
        if (groupInfo.id && groupInfo.id !== groupId) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            getCJobList(cjobListParams, groupInfo.id !== groupId).then()
            setGroupID(groupInfo.id);
        }
    }, [groupId, groupInfo]);

    // TODO: 获取列名<Title>
    const title = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

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
            const url = `/cargo/job/job-${type === 4 ? 'charge' : 'info'}/${btoa(record?.ID)}/${btoa(record?.BizType4ID)}`;
            // const url = `/cargo/job/${btoa(record?.ID)}/${btoa(record?.BizType4ID)}`;
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({
                pathname: url,
                // TODO: 不用 query 的原因：query 的参数会拼接到 url 地址栏上，用 params (可以是其他名<自定义>)，则可以隐藏
                // pathname: `/cargo/job/job-info`,
                // query: {
                //     id: btoa(record?.ID),
                //     bizType4ID: record?.BizType4ID,
                // },
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
            console.log(params);
            // TODO: 分页查询【参数页】
            params.PageNum = params.current || 1;
            result = (await joblist.getCJobList(params as APIModel.GetCJobListInfo)) || {};
            setJobList(result.data || []);
        }
        setLoading(false);
        return result;
    }

    // TODO: 单票显示列
    const columns: ProColumns<APICJobListItem>[] = [
        // 序列
        // {
        //     dataIndex: 'index',
        //     valueType: 'indexBorder',
        //     width: 48,
        // },
        {
            title: title('code', '业务编号'),
            dataIndex: 'Code',
            width: 140,
            disable: true,
        },
        {
            title: title('customer', '客户'),
            dataIndex: 'PrincipalNameEN',
            disable: true,
        },
        {
            title: title('mbl', '提单号'),
            dataIndex: 'MBOLNum',
            width: 120,
            ellipsis: true,
        },
        {dataIndex: 'HBOLNum', hideInTable: true,},
        {
            title: title('cargo-type', '货物类型'),
            dataIndex: 'OceanTransportType',
            align: 'center',
            search: false,
            width: 80,
            valueEnum: OceanTransportTypeEnum
        },
        {
            title: title('create-date', '创建时间'),
            dataIndex: 'CreateDate',
            valueType: 'date',
            align: 'center',
            width: 90,
            render: (text, record)=> record.ETD || text
        },
        {
            title: title('option', '操作'),
            valueType: 'option',
            align: 'center',
            key: 'option',
            disable: true,
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
                <IconFont key={1} type={'icon-create'} onClick={()=> {console.log(123456)}} />,
            ]}
        >
            <ProTable<APICJobListItem>
                rowKey={'ID'}
                bordered={true}
                columns={columns}
                dataSource={jobList}
                actionRef={actionRef}
                params={cjobListParams}
                loading={loading}
                request={(params)=> getCJobList(params, !!groupInfo.id)}
                columnsState={{
                    value: columnsStateMap,
                    onChange: (str) => {
                        // console.log(JSON.stringify(str));
                        setColumnsStateMap(str);
                    },
                }}
                className={'antd-pro-table-ant-space'}
             />
        </PageContainer>
    )
}
export default JobList;