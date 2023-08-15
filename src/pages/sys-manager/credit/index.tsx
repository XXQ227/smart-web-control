import React, {Fragment, useMemo, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProForm, ProFormCheckbox,
    ProFormText,
    ProTable
} from '@ant-design/pro-components';
import {useModel} from 'umi';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import type {TabsProps} from 'antd';
import {Col, Divider, Input, message, Row, Tabs} from 'antd';
import {history} from '@@/core/history';
import {CustomizeIcon, formatNumToMoney, rowGrid} from '@/utils/units';
import ls, {debounce} from "lodash";

const {Search} = Input;

type APICredit = APIManager.Credit;
type APISearchCreditParams = APIManager.SearchCreditParams;

export type LocationState = Record<string, unknown>;

// TODO: 获取信控列表的请求参数
const initSearchParam= {
    customerName: '',
    applicantId: '',
    creditStatusTypeList: [],
    currentPage: 1,
    pageSize: 20,
};

const initPagination = {
    current: 1,
    pageSize: 20,
    total: 0,
}

const CreditListIndex: React.FC<RouteChildrenProps> = () => {
    const searchQueryCredit = ls.cloneDeep(initSearchParam)

    const {
        queryUnCreditControl, queryCreditControl, deleteCreditControl,
    } = useModel('manager.credit', (res: any) => ({
        queryUnCreditControl: res.queryUnCreditControl,
        queryCreditControl: res.queryCreditControl,
        deleteCreditControl: res.deleteCreditControl,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [CreditListVO, setCreditListVO] = useState<APICredit[]>([]);
    const [searchParams, setSearchParams] = useState<APISearchCreditParams>(searchQueryCredit);
    const [pagination, setPagination] = useState<any>(initPagination);

    /**
     * @Description: TODO 获取 信控 列表
     * @author XXQ
     * @date 2023/2/13
     * @param tabKey    当前所在的tab
     * @param params    参数
     * @returns
     */
    async function handleQueryCredit(tabKey: string = '1', params: APISearchCreditParams) {
        setLoading(true);
        let result: API.Result;
        if (tabKey === '1') {
            // TODO: 获取 未做信控客户 列表
            result = await queryUnCreditControl(params);
        } else {
            // TODO: 获取 信控 列表
            result = await queryCreditControl(params);
        }
        if (result.success) {
            setCreditListVO(result.data);
            console.log(result.data)
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
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param tabKey    操作当前 行
     * @param record    操作当前 行
     * @param state     操作状态
     * @returns
     */
    const handleOperate = async (tabKey: string, record: any, state: string = 'form') => {
        if (state === 'delete') {
            setLoading(true);
            // TODO: 删除费用模板
            const result: any = await deleteCreditControl({id: record.id});
            if (result.Result) {
                const newData: APICredit[] = CreditListVO.filter((item: APICredit) => item.id !== record.id);
                setCreditListVO(newData);
                message.success('Success!');
            } else {
                message.error(result.Content);
            }
            setLoading(false);
        } else {
            // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
            let url = `/manager/credit/${state}`;
            // TODO: 未创建的信控列表，id = 客户 id
            if (tabKey === '1') {
                url += `/${btoa('0')}/${btoa(record?.id)}`;
            } else {
                url += `/${btoa(record?.id)}`;
            }
            // TODO: 跳转页面<带参数>
            history.push({
                pathname: url,
                /*state: {
                    searchParams: searchParams,
                },*/
            });
        }
    }

    const onChange = (key: string) => {
        if (key === '3') {
            searchParams.creditStatusTypeList= [1, 2, 3, 4, 5];
            setSearchParams(searchParams);
        } else {
            setSearchParams(searchQueryCredit);
        }
    };

    const debounceFetcher = useMemo(() => {
        const loadOptions = async () => {
            await handleQueryCredit('3', searchParams);
        };
        // TODO: 返回数据，做防抖动设置
        return debounce(loadOptions, 2000);
    }, []);

    /**
     * @Description: TODO: 当 ProForm 表单修改时，调用此方法
     * @author LLS
     * @date 2023/8/10
     * @param changeValues   ProForm 表单修改的参数
     * @returns
     */
    const handleProFormValueChange = (changeValues: any) => {
        Object.keys(changeValues).map((item: any) => {
            // TODO: 客户名称
            if (item === 'customerName') {
                searchParams.customerName = changeValues[item];
            }
            // TODO: 人+公司
            else if (item === 'applicantId') {
                searchParams.applicantId = changeValues[item];
            }
            // TODO: 供应商类型
            else if (item === 'creditStatusTypeList') {
                searchParams.creditStatusTypeList = changeValues[item];
            }
        })
        // TODO: 返回数据，做防抖动设置
        debounceFetcher();
    }

    const columnsFunc = (tabKey: string) => {
        const createColumns: ProColumns<APICredit>[] = [
            {title: 'Customer Name', dataIndex: 'customerName', align: 'left',},
            {
                title: 'Action',
                width: 80,
                align: 'center',
                render: (text, record) => {
                    return (
                        <Fragment>
                            <PlusOutlined color={'#1765AE'} onClick={() => handleOperate(tabKey, record)}/>
                        </Fragment>
                    )
                },
            },
        ];
        const columns: ProColumns<APICredit>[] = [
            {title: 'Customer Name', dataIndex: 'customerName', align: 'left',},
            {
                title: 'Credit Line', dataIndex: 'creditLine', width: '10%', align: 'right',
                render: (text) => {return formatNumToMoney(text)},
            },
            {title: 'Credit Days', dataIndex: 'creditDays', width: '9%', align: 'center',},
            {title: 'Expiration Date', dataIndex: 'creditExpiryEndTime', width: '12%', valueType: 'date', align: 'center',},
            {title: 'Credit Rating', dataIndex: 'creditLevel', width: '10%', align: 'center',},
            {title: 'Applied by', dataIndex: 'applicantBy', width: '15%', align: 'center',},
            {
                title: 'Action',
                width: 80,
                align: 'center',
                render: (text, record) => {
                    return (
                        <Fragment>
                            <EditOutlined color={'#1765AE'} onClick={() => handleOperate(tabKey, record)}/>
                            <Divider type='vertical'/>
                            <CustomizeIcon
                                type={'icon-approval'} color={'#1765AE'}
                                onClick={() => handleOperate(tabKey, record, 'approval')}
                            />
                        </Fragment>
                    )
                },
            },
        ];
        return tabKey === '1' ? createColumns : columns;
    }

    const creditTable = (tabKey: string) => {
        return (
            <>
                {
                    tabKey === '3' ?
                        <ProForm
                            // TODO: 不显示提交、重置按键
                            submitter={false}
                            // TODO: 焦点给到第一个控件
                            autoFocusFirstInput
                            initialValues={searchParams}
                            // TODO: 设置默认值
                            // formKey={'business-unit-information'}
                            // TODO: 空间有改数据时触动
                            onValuesChange={handleProFormValueChange}
                        >
                            <Row gutter={rowGrid} style={{marginBottom: 10}}>
                                <Col xs={24} sm={24} md={20} lg={16} xl={8} xxl={9}>
                                    <ProFormText
                                        name='customerName'
                                        placeholder=''
                                        label='Customer Name'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={5}>
                                    <ProFormText
                                        name='applicantId'
                                        placeholder=''
                                        label='Applied by'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={18} lg={23} xl={12} xxl={8}>
                                    <ProFormCheckbox.Group
                                        placeholder=''
                                        name='creditStatusTypeList'
                                        label='Status'
                                        options={[
                                            {label: 'Uncredited', value: 1,},
                                            {label: 'In Approval', value: 2,},
                                            {label: 'Credited', value: 3,},
                                            {label: 'Insufficient', value: 4,},
                                            {label: 'Expired', value: 5,},
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </ProForm> : null
                }
                <ProTable<APICredit>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columnsFunc(tabKey)}
                    params={searchParams}
                    dataSource={CreditListVO}
                    locale={{emptyText: 'No Data'}}
                    headerTitle={
                        tabKey === '1' ?
                            <Search
                                placeholder=''
                                enterButton="Search"
                                loading={loading}
                                // defaultValue={searchValue}
                                onSearch={async (val: any) => {
                                    // setSearchValue(val);
                                    searchParams.customerName = val;
                                    await handleQueryCredit(tabKey, searchParams);
                                }}
                            /> : null
                    }
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
                    request={(params: APISearchCreditParams) => handleQueryCredit(tabKey, params)}
                />
            </>
        )
    }

    /*// TODO: 授信状态：
    // TODO: 1、Uncredited：已通过客户审核，但还未授信的客户。
    // TODO: 2、In Approval：正在授信审批的过程中，还未完成。
    // TODO: 3、Credited：完成授信，并且在正常的信控状态中。
    // TODO: 4、Insufficient：”授信额度“或”授信天数“超出的客户。
    // TODO: 5、Expired：超期失效的授信，因为太多，所以不显示数量*/
    const items: TabsProps['items'] = [
        {key: '1', label: `Pending Creation`, children: creditTable('1'),},
        // TODO: 审批到自己的授信任务清单
        {key: '2', label: `Pending List`, children: creditTable('2'),},
        {key: '3', label: `Credit List`, children: creditTable('3'),},
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-pro-table'}>
                <Tabs defaultActiveKey='1' items={items} destroyInactiveTabPane={true} onChange={onChange}/>
            </ProCard>
        </PageContainer>
    )
}
export default CreditListIndex;