import React, {useEffect, useRef, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns, ActionType} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {history, useModel} from 'umi';
import {useIntl} from '@@/plugin-locale/localeExports'
import {getTitleInfo} from '@/utils/units';
import {getUserID} from '@/utils/auths'

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
}

const JobList: React.FC<RouteChildrenProps> = () => {
    const [loading, setLoading] = useState(true);
    const joblist = useModel('joblist');

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    useEffect(()=>{
        if (loading) {
            setTimeout(()=> setLoading(!loading), 1500)
        }
    }, [loading]);

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
            // @ts-ignore
            history.push({
                pathname: '/cargo/ticket',
                query: {id},
            });
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
        // TODO: 分页查询【参数页】
        params.PageNum = params.current;
        const result: API.RuleCJobList = (await joblist.getCJobList(params as API.GetCJobListInfo)) || {};
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
        },
        {
            title: title('etd-pol', 'ETD POL'),
            dataIndex: 'POLETA',
            align: 'center',
            width: 90,
            render: (text, record)=> record.ETD || text
        },
        {
            title: title('eta-pod', 'ETA POD'),
            dataIndex: 'ETA',
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
        {
            title: title('cargo-type', '货物类型'),
            dataIndex: 'OceanTransportType',
            width: 80,
            align: 'center',
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
            width: 120,
            render: (text, record) => {
                return [
                    <a
                        key="editable"
                        onClick={() => handleOperateJob(1, record.ID)}
                    >
                        编辑
                    </a>,
                    <a
                        key="copy"
                        onClick={() => handleOperateJob(2, record.ID)}
                    >
                        复制
                    </a>,
                    <a
                        key="cancel"
                        onClick={() => handleOperateJob(3, record.ID)}
                    >
                        退关
                    </a>,
                ]
            },
        },
    ];

    const actionRef = useRef<ActionType>();


    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProTable<API.CJobListItem>
                rowKey={'ID'}
                bordered={true}
                columns={columns}
                actionRef={actionRef}
                params={cjobListParams}
                request={getCJobList}
                className={'antd-pro-table-ant-space'}
             />
        </PageContainer>
    )
}
export default JobList;