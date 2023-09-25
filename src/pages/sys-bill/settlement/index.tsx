import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormText,
    ProTable
} from '@ant-design/pro-components'
import '@/global.less'
import type {TabsProps} from 'antd';
import {Button, Col, Divider, Form, message, Popconfirm, Row, Spin, Tabs} from 'antd'
import {DeleteOutlined, FormOutlined, SearchOutlined} from '@ant-design/icons'
import {formatNumToMoney, getFormErrorMsg, keepDecimal} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {history} from 'umi'
import SettlementInvoiceModal from '@/pages/sys-bill/settlement/components/settlement-invoice-modal'
import ExecutionConditions from '@/pages/sys-bill/bill/components/execution-conditions/ExecutionConditions'
import SettledDetailModal from '@/pages/sys-bill/settlement/components/settled-detail-modal'

const initSearchData: any = {
    invoiceNum: "",
    settlementPartyId: null,
    jobCode: "",
    branchId: '1665596906844135426',
    queryType: 1,
    type: 1,
    state: '1',       // TODO: 状态: 1-未核销 2-部分核销 3-全部核销
};

// TODO: 默认为 true；当首次加载数据后，改为 【false】
let initLoading = true;

const Settlement: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const {
        queryUnWriteOffInvoice, deleteWriteOff, queryWriteOff
    } = useModel('accounting.settlement', (res: any) => ({
        queryUnWriteOffInvoice: res.queryUnWriteOffInvoice,
        deleteWriteOff: res.deleteWriteOff,
        queryWriteOff: res.queryWriteOff,
    }));

    const [loading, setLoading] = useState(false);

    const [dataSource, setDataSource] = useState<any[]>([]);

    // TODO: 搜索条件
    const [searchInfo, setSearchInfo] = useState<any>(initSearchData);
    // TODO: 核销发票类型；默认 【AR：1】
    const [type, setType] = useState<number>(1);

    // TODO: 核销列表数据
    const [settleChargeList, setSettleChargeList] = useState<any[]>([]);
    // TODO: 选中行数据
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    // TODO: 核销验证信息
    const [settleInfo, setSettleInfo] = useState<any>({});

    const [settleId, setSettleId] = useState<string>('');
    const [settleOpen, setSettleOpen] = useState<boolean>(false);

    useEffect(() => {

    }, [])

    /**
     * @Description: TODO: 搜索订单数据
     * @author XXQ
     * @date 2023/8/29
     * @param val   搜索条件，内容
     * @param tabKey    tab 切换的 key 值；可以为空
     * @returns
     */
    async function handleQueryUnWriteOffInvoice(val?: any, tabKey?: string) {
        if (!loading) setLoading(true);
        if (initLoading) initLoading = false;
        try {
            val.state = tabKey || searchInfo.state;
            const params: any = {...initSearchData, ...val};
            if (val.invoiceIssueDate?.length > 0) {
                params.invoiceIssueDateStart = val.invoiceIssueDate[0];
                params.invoiceIssueDateEnd = val.invoiceIssueDate[1];
            }
            delete params.invoiceIssueDate;
            // TODO: 调接口获取数据
            let result: API.Result;
            if (val.state === '3') {
                result = await queryWriteOff(params);
            } else {
                result = await queryUnWriteOffInvoice(params);
            }
            if (result.success) {
                // TODO: 成功时更新表格数据
                if (result.data?.length > 0) {
                    result.data = result.data.map((item: any) => ({
                        ...item, ratio: keepDecimal((item.billInTaxAmount - item.unWriteOffBillInTaxAmount)/item.billInTaxAmount) + '%'
                    }))
                }
                setDataSource(result.data);
            } else {
                if (result.message) message.error(result.message);
            }
            // TODO: 清空复选框数据
            if (selectedKeys?.length > 0) setSelectedKeys([]);
            // TODO: 当搜索内容没有改变时，不做更新操作
            if (val && JSON.stringify(val) !== JSON.stringify(searchInfo)) setSearchInfo(val);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        return val;
    }

    /**
     * @Description: TODO: 表格复选框方法
     * @author XXQ
     * @date 2023/9/14
     * @param selectedRowKeys
     * @param selectedRows
     * @returns
     */
    function handleTableRowChange(selectedRowKeys: React.Key[], selectedRows: any[]) {
        setSelectedKeys(selectedRowKeys);
        let selectRow: any = {}, businessNameState: boolean = false, billCurrencyNameState: boolean = false;
        if (selectedRows?.length) {
            selectRow = selectedRows[0];
            // TODO: 它会创建一个存储唯一值的集合。Set 允许你存储各种类型的值（基本数据类型和引用数据类型），
            //  并确保每个值在集合中只存在一次，即不会重复。
            const uniqueBusinessName = new Set(),
                uniqueBillCurrencyName = new Set();
            for (const item of selectedRows) {
                uniqueBusinessName.add(item.businessName);
                uniqueBillCurrencyName.add(item.billCurrencyName);
            }
            // TODO: 验证结算对象、账单币种必须一样
            businessNameState = uniqueBusinessName.size > 1;
            billCurrencyNameState = uniqueBillCurrencyName.size > 1;

            // TODO: 选中行下的发票详情信息
            const settleChargeArr: any[] = [];
            selectedRows.map((item: any)=> {
                if (item.unWriteOffCharges?.length > 0) {
                    const amount: number = keepDecimal(item.billInTaxAmount - item.unWriteOffBillInTaxAmount);
                    // TODO: 整理核销弹框显示的费用行数据
                    item.unWriteOffCharges = item.unWriteOffCharges.map((cg: any) =>
                        ({
                            ...cg, invoiceNum: item.num,
                            amount, amountStr: formatNumToMoney(amount),
                            unWriteOffBillInTaxAmount: item.unWriteOffBillInTaxAmount,
                            ratio: keepDecimal(amount / item.billInTaxAmount) + '%',
                        })
                    );
                }
                settleChargeArr.push(...(item.unWriteOffCharges || []));
            });
            setSettleChargeList(settleChargeArr);
        }
        setSettleInfo({
            // TODO: 客户、账单币种是否相同
            businessNameState, billCurrencyNameState,
            // TODO: 选中行的客户、账单币种
            businessId: selectRow.businessId, businessName: selectRow.businessName,
            billCurrencyName: selectRow.billCurrencyName
        });
    }

    async function handleChangeTabs(keys: string) {
        await handleQueryUnWriteOffInvoice(searchInfo, keys);
    }


    /**
     * @Description: TODO: 删除核销记录
     * @author XXQ
     * @date 2023/9/20
     * @param       record
     * @param       index
     * @returns
     */
    async function handleDeleteSettle(record: any, index: number) {
        try {
            // TODO: 调接口获取数据
            const result: API.Result = await deleteWriteOff({id: record.id});
            if (result.success) {
                message.success('success!');
                const newData: any[] = dataSource.slice(0).splice(index, 1);
                setDataSource(newData);
            } else {
                if (result.message) message.error(result.message);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
    }

    let columns: ProColumns[] = [
        {title: 'Type', dataIndex: 'type', width: 60, align: 'center',},
        {title: 'B-Line', dataIndex: 'bline', width: 60, align: 'center',},
        {title: 'Invoice No.', dataIndex: 'num', width: 170, align: 'center',},
        {title: 'Job No.', dataIndex: 'jobCodes', key: 'jobCode', width: 120, align: 'center',},
        {title: 'Payer / Vendor', dataIndex: 'businessName',},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 90, align: 'center'},
        // TODO: valueType 数据显示格式，
        //  详情见 https://procomponents.ant.design/components/schema#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype
        {title: 'Bill AMT', dataIndex: 'billInTaxAmount', width: 100, align: 'center',},
        {title: 'Issue By', dataIndex: 'createUserName', width: 150, align: 'center'},
        {title: 'Issue Date', dataIndex: 'createTime', width: 90, align: 'center', valueType: 'date'},
        // {title: 'Completion Date', dataIndex: 'completionDate', width: 100, align: 'center', valueType: 'date'},
    ];

    // TODO: 部分核销、核销记录显示列略有不同
    let addItem: any[] = [];
    if (searchInfo.state === '2') {
        addItem = [
            {
                title: 'Unsettled AMT', dataIndex: 'unWriteOffBillInTaxAmount',
                width: 110, align: 'center', className: 'ant-table-col-yellow'
            },
            {
                title: 'Ratio', dataIndex: 'ratio', tooltip: 'The ratio of Settled',
                width: 70, align: 'center', className: 'ant-table-col-yellow'
            },
        ];
        columns.splice(7, 0, ...addItem);
    } else if (searchInfo.state === '3') {
        columns = [
            {title: 'Type', dataIndex: 'type', width: 60, align: 'center',},
            {title: 'B-Line', dataIndex: 'bline', width: 60, align: 'center',},
            {title: 'Transaction Ref Number', dataIndex: 'num', width: 170, align: 'center',},
            {title: 'Invoice No.', dataIndex: 'invoiceNums', width: 170, align: 'center',},
            {title: 'Payer / Vendor', dataIndex: 'settlementPartyName',},
            {title: 'Bill AMT', dataIndex: 'invoiceAmount', width: 100, align: 'center',},
            {title: 'Invoice AMT', dataIndex: 'unWriteOffBillInTaxAmount', width: 100, align: 'center',},
            {
                title: 'Settled AMT', dataIndex: 'settledAmount', width: 100,
                align: 'center', className: 'ant-table-col-yellow'
            },
            {title: 'Settled', dataIndex: 'settleState', width: 90, align: 'center',},
            {title: 'Settle by', dataIndex: 'settleBy', width: 150, align: 'center'},
            {title: 'Settle Date', dataIndex: 'settleTime', width: 100, align: 'center', valueType: 'date'},
            {
                title: 'Action', align: 'center', width: 60,
                render: (_: any, record: any, index: number) =>
                    <>
                        <FormOutlined
                            color={'#1765AE'}
                            onClick={() => {
                                setSettleId(record.id);
                                setSettleOpen(true)
                            }}
                        />
                        <Popconfirm
                            placement={'topRight'}
                            onConfirm={() => handleDeleteSettle(record, index)}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <Divider type='vertical'/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </>
            },
        ];
    }

    const rowSelection: any = {
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        columnWidth: 26,
        selectedRowKeys: selectedKeys,
        onChange: handleTableRowChange,
    };

    const tabItemChildren= (keys?: string) => (
        <ProTable<any>
            bordered
            rowKey={'id'}
            size="middle"
            search={false}
            options={false}
            columns={columns}
            loading={loading}
            dateFormatter="string"
            dataSource={dataSource}
            tableAlertRender={false}
            locale={{emptyText: 'No Data'}}
            className={'antd-pro-table-expandable'}
            rowSelection={keys === '3' ? false : rowSelection}
        />
    );

    const items: TabsProps['items'] = [
        {key: '1', label: 'Outstanding', children: tabItemChildren(),},
        {key: '2', label: 'Partial Settle', children: tabItemChildren(),},
        {key: '3', label: 'Settle Log', children: tabItemChildren('3'),},
    ];

    return (
        <PageContainer
            header={{breadcrumb: {}}}
        >
            <ProForm
                form={form}
                omitNil={false}
                layout={"vertical"}
                params={searchInfo}
                name={'form-search-info'}
                initialValues={initSearchData}
                onFinish={handleQueryUnWriteOffInvoice}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
                            <FooterToolbar extra={<Button onClick={() => history.goBack()}>Back</Button>}>
                                <SettlementInvoiceModal
                                    type={type}
                                    settleInfo={settleInfo}
                                    settleChargeList={settleChargeList}
                                />
                            </FooterToolbar>
                        );
                    },
                }}
                request={async (params: any) => initLoading ? handleQueryUnWriteOffInvoice(params) : {}}
            >
                {/* 搜索 */}
                <ProCard className={'ant-pro-card-search'}>
                    <Row gutter={24} className={'ant-row-search'}>
                        <Col span={21}>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name="type"
                                        label="Cettle Type"
                                        style={{minWidth: 150}}
                                        options={[{label: 'AR', value: 1}, {label: 'AP', value: 2}]}
                                        fieldProps={{
                                            onChange: (val: any) => setType(val),
                                        }}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={10}>
                                    <SearchProFormSelect
                                        qty={5}
                                        isShowLabel={true}
                                        id={'settlementPartyId'}
                                        name={'settlementPartyId'}
                                        label={"Customer or Paying Agent"}
                                        filedValue={'id'} filedLabel={'nameFullEn'}
                                        query={{branchId: '1665596906844135426', buType: 1}}
                                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    {
                                        searchInfo.state === '3' ?
                                            <ProFormText name="serialNum" label="Transaction Ref No." placeholder=""/>
                                            :
                                            <ProFormText name="jobCode" label="Job No." placeholder=""/>
                                    }
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="invoiceNum" label="Invoice No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={8}>
                                    {
                                        searchInfo.state === '3' ?
                                            <ProFormDateRangePicker
                                                placeholder={''}
                                                name="invoiceIssueDate" label="Invoice Issue Date"
                                            />
                                            :
                                            <ProFormDateRangePicker
                                                placeholder={''}
                                                name="invoiceIssueDate" label="Invoice Settle Date"
                                            />
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col span={3} className={'ant-row-search-btn'}>
                            <Button icon={<SearchOutlined/>} htmlType={'submit'}>Search</Button>
                        </Col>
                    </Row>
                </ProCard>
            </ProForm>
            <ProCard className={'ant-tabs-style'}>
                <Spin spinning={loading}>
                    <Tabs
                        type="card"
                        items={items}
                        onChange={handleChangeTabs}
                        activeKey={searchInfo.state}
                        destroyInactiveTabPane={true}
                        tabBarExtraContent={
                            // TODO: 验证规则：只能同【结算对象、同账单币种】
                            <ExecutionConditions
                                validateData={settleInfo} hidden={searchInfo.state === '3'}
                                hiddenState={{hiddenBusinessLine: true, hiddenExRate: true}}
                            />
                        }
                    />
                </Spin>

                {settleOpen ? <SettledDetailModal
                    id={settleId} open={settleOpen} settleOpen={()=> setSettleOpen(false)}
                /> : null}

            </ProCard>
        </PageContainer>
    )
}
export default Settlement;