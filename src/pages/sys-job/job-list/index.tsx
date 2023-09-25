import React, {Fragment, useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ActionType, ColumnsState, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components';
import {history, useModel} from 'umi';
import {IconFont} from '@/utils/units';
import {EditOutlined} from '@ant-design/icons';

type APICJobListItem = APIModel.CJobListItem;

// TODO: 获取单票集的请求参数
const cjobListParams: APIModel.SearchJobParams = {
    searchKey: '',
    customerOrCargoId: '',
    branchId: '1665596906844135426',
    currentPage: 1,
    pageSize: 20,
};

const columnsStateStr = '{"Code":{"fixed":"left"},"PrincipalNameEN":{"show":true},"MBOLNum":{"show":true},"OceanTransportType":{"show":true},"CreateDate":{"show":true},"option":{"show":true}}';

const JobList: React.FC<RouteChildrenProps> = () => {
    const {
        queryJobList,
    } = useModel('job.joblist', (res: any) => ({
        queryJobList: res.queryJobList,
    }));
    // const initInfo = useModel('@@initialState');
    // const initialState: any = initInfo?.initialState || {};

    const [loading, setLoading] = useState<boolean>(false);
    const [jobList, setJobList] = useState<APICJobListItem[]>([]);

    useEffect(()=> {

    }, []);

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
     * @returns
     */
    const handleQueryJobList = async (params: any) => {
        let result: APIModel.RuleCJobList = {};
        setLoading(true);
        // TODO: 分页查询【参数页】
        params.currentPage = params.current || 1;
        params.pageSize = params.pageSize || 20;
        result = await queryJobList(params as APIModel.SearchJobParams);
        setJobList(result.data || []);
        setLoading(false);
        return result;
    }

    // TODO: 单票显示列
    const columns: ProColumns<APICJobListItem>[] = [
        {title: 'Job Code', dataIndex: 'jobCode', width: '13%'},
        {title: 'Customer', dataIndex: 'customerNameEn'},
        {title: 'PO Num', dataIndex: 'MBOLNum', width: '13%', ellipsis: true},
        {title: 'Taking Date', dataIndex: 'orderTakingDate', valueType: "date", width: '13%', align: 'center'},
        {title: 'Complete Date', dataIndex: 'completionDate', valueType: "date", width: '13%', align: 'center'},
        {
            title: 'Action', valueType: 'option', align: 'center', key: 'option', width: 100,
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleOperateJob(1, record)} />
                        {/*<Divider type={'vertical'} />*/}
                        {/*<EditOutlined color={'#1765AE'} onClick={() => handleOperateJob(1, record)}/>*/}
                        {/*<Divider type={'vertical'} />*/}
                        {/*<EditOutlined color={'#1765AE'} onClick={() => handleOperateJob(1, record)}/>*/}
                        {/*<Divider type={'vertical'} />*/}
                        {/*<EditOutlined color={'#1765AE'} onClick={() => handleOperateJob(1, record)}/>*/}
                    </Fragment>
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
            <ProCard className={'ant-card-pro-table'}>
                <ProTable<APICJobListItem>
                    rowKey={'id'}
                    // search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    dataSource={jobList}
                    actionRef={actionRef}
                    params={cjobListParams}
                    locale={{emptyText: 'No Data'}}
                    className={'antd-pro-table-ant-space'}
                    request={(params) => handleQueryJobList(params)}
                    columnsState={{
                        value: columnsStateMap,
                        onChange: (str) => {
                            // console.log(JSON.stringify(str));
                            setColumnsStateMap(str);
                        },
                    }}
                />
            </ProCard>
        </PageContainer>
    )
}
export default JobList;
