import React, {useRef, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns, ActionType, ColumnsState} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {history, useModel} from 'umi';
import {useIntl} from '@@/plugin-locale/localeExports'
import {getTitleInfo} from '@/utils/units';
import {getUserID} from '@/utils/auths'
import {Button} from 'antd'

// TODO: 获取单票集的请求参数
const cjobListParams: API.GetCJobListInfo = {
    Key: '',
    TimeLimitType: 1,
    AuthorityType: 2,
    TabID: 1,
    UserID: getUserID(),
    IsClickSearch: true,
    PageSize: 20,
    PageNum: 1,
};

const operationList = [
    {key: 'edit', type: 1, label: '编辑'},
    {key: 'copy', type: 2, label: '复制'},
    {key: 'cancel', type: 3, label: '退关'}
];

const columnsStateStr = '{"POLETA":{"fixed":"left","order":2},"ETA":{"fixed":"left","order":1},"Code":{"order":0,"show":true},"PrincipalNameEN":{"order":3},"MBOLNum":{"order":4,"show":false},"OceanTransportType":{"order":5,"fixed":"left"},"FreighterEN":{"order":6},"option":{"order":7}}';

const JobList: React.FC<RouteChildrenProps> = () => {
    const joblist = useModel('joblist');

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    // TODO: 获取列名<Title>
    const title = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    /**
     * @Description: TODO 单票操作（编辑、复制、退关）
     * @author XXQ
     * @date 2023/2/13
     * @param type  操作类型【1：编辑；2：复制；3、退关】
     * @param id    被操作行的 ID
     * @returns
     */
    const handleOperateJob = (type: number, id: number) => {
        if (type === 1 || type === 2) {
            // TODO: 跳转页面<带参数>
            // @ts-ignore
            history.push({
                // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
                pathname: `/cargo/job/${btoa(id.toString())}`,
                // TODO: 不用 query 的原因：query 的参数会拼接到 url 地址栏上，用 params (可以是其他名<自定义>)，则可以隐藏
                // query: urlParams,
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
     * @returns
     */
    const getCJobList = async (params: any) => {
        // setLoading(true);
        // TODO: 分页查询【参数页】
        params.PageNum = params.current;
        const result: API.RuleCJobList = (await joblist.getCJobList(params as API.GetCJobListInfo)) || {};
        // setLoading(false);
        return result;
    }

    // TODO: 单票显示列
    const columns: ProColumns<API.CJobListItem>[] = [
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
            title: title('etd-pol', 'ETD POL'),
            dataIndex: 'POLETA',
            valueType: 'date',
            align: 'center',
            width: 90,
            render: (text, record)=> record.ETD || text
        },
        {
            title: title('eta-pod', 'ETA POD'),
            dataIndex: 'ETA',
            valueType: 'date',
            align: 'center',
            width: 90,
            render: (text, record)=> record.ATD || text,
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
            valueEnum: {
                '1': {text: 'FCL', status: 'FCL'},
                '2': {text: 'LCL', status: 'LCL'},
                '3': {text: 'BULK', status: 'BULK'},
            }
        },
        {
            title: title('carrier', '舱位公司'),
            dataIndex: 'FreighterEN',
            width: 260,
            ellipsis: true,
            tip: `${title('carrier', '舱位公司')}过长会自动收缩`,
        },
        {
            title: title('option', '操作'),
            valueType: 'option',
            align: 'center',
            key: 'option',
            disable: true,
            width: 120,
            render: (text, record) => {
                return operationList?.map(x=>
                    <a key={x.key} onClick={() => handleOperateJob(x.type, record.ID)}>
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
                <Button key={1} icon={'create'} />,

            ]}
        >
            <ProTable<API.CJobListItem>
                rowKey={'ID'}
                bordered={true}
                columns={columns}
                actionRef={actionRef}
                params={cjobListParams}
                request={getCJobList}
                columnsState={{
                    value: columnsStateMap,
                    onChange: setColumnsStateMap,
                }}
                className={'antd-pro-table-ant-space'}
             />
        </PageContainer>
    )
}
export default JobList;