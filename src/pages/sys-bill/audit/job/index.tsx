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
import {Button, Col, Form, message, Row} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {history} from 'umi'
import SettlementInvoiceModal from '@/pages/sys-bill/settlement/components/settlement-invoice-modal'
import ExecutionConditions from '@/pages/sys-bill/bill/components/execution-conditions/ExecutionConditions'

const initSearchData: any = {
    invoiceNum: "",
    settlementPartyId: null,
    jobCode: "",
    branchId: '1665596906844135426',
    queryType: 1,
    type: 1,
    state: 1,
};

// TODO: 默认为 true；当首次加载数据后，改为 【false】
let initLoading = true;

const JobAudit: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const {location} = history;

    initSearchData.state = location?.pathname?.indexOf('/outstanding') > -1 ? 1 : 2;

    const {
        queryUnWriteOffInvoice,
    } = useModel('accounting.settlement', (res: any) => ({
        queryUnWriteOffInvoice: res.queryUnWriteOffInvoice,
    }));

    const [loading, setLoading] = useState(false);


    const [dataSource, setDataSource] = useState<any[]>([]);

    const [searchInfo, setSearchInfo] = useState<any>(initSearchData);
    // TODO: 核销发票类型；默认 【AR：1】
    const [type, setType] = useState<number>(1);

    // TODO: 核销列表数据
    const [settleChargeList, setSettleChargeList] = useState<any[]>([]);
    // TODO: 选中行数据
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    // TODO: 核销验证信息
    const [settleInfo, setSettleInfo] = useState<any>({});

    useEffect(() => {

    }, [])

    /**
     * @Description: TODO: 搜索订单数据
     * @author XXQ
     * @date 2023/8/29
     * @param val   搜索条件，内容
     * @returns
     */
    async function handleQuerySeaExportInfo(val?: any) {
        if (!loading) setLoading(true);
        if (initLoading) initLoading = false;
        try {
            const params: any = {...initSearchData, ...JSON.parse(JSON.stringify(val))};
            if (val.invoiceIssueDate?.length > 0) {
                params.invoiceIssueDateStart = val.invoiceIssueDate[0];
                params.invoiceIssueDateEnd = val.invoiceIssueDate[1];
                delete params.invoiceIssueDate;
            }
            // TODO: 查所有币种时，把 ['ALL'] 改成所有 币种的集合
            // if (params.jobBusinessLine === 0) params.jobBusinessLine = [];
            // if (params.billCurrencyName[0] === 'All') params.billCurrencyName = currencyList;

            const result: API.Result = await queryUnWriteOffInvoice(params);
            if (result.success) {
                setDataSource(result.data);
            } else {
                if (result.message) message.error(result.message);
            }
            setSearchInfo(val);
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
                settleChargeArr.push(...(item.unWriteOffCharges || []));
            });
            setSettleChargeList(settleChargeArr);
        }
        setSettleInfo({
            // TODO: 客户、账单币种是否相同
            businessNameState, billCurrencyNameState,
            // TODO: 选中行的客户、账单币种
            businessId: selectRow.businessId || 0, businessName: selectRow.businessName,
            billCurrencyName: selectRow.billCurrencyName
        });
    }
    /**
     * @Description: TODO: 搜索核销列表数据
     * @author XXQ
     * @date 2023/9/13
     * @param val   搜索参数
     * @returns
     */
    const handleFinish = async (val: any) => {
        try {
            await handleQuerySeaExportInfo(val);
        } catch (e) {
            message.error(e);
        }
    };


    const columns: ProColumns[] = [
        {title: 'Type', dataIndex: 'type', width: 60, align: 'center',},
        {title: 'B-Line', dataIndex: 'bline', width: 60, align: 'center',},
        {title: 'Invoice No.', dataIndex: 'num', width: 180, align: 'center',},
        {title: 'Job No.', dataIndex: 'jobCodes', key: 'jobCode', width: 150, align: 'center',},
        {title: type === 1 ? 'Payer' : 'Vendor', dataIndex: 'businessName',},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 90, align: 'center'},
        // TODO: valueType 数据显示格式，
        //  详情见 https://procomponents.ant.design/components/schema#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype
        {title: 'Bill Amount', dataIndex: 'unWriteOffBillInTaxAmount', width: 120, align: 'center',},
        {title: 'Issue By', dataIndex: 'createUserName', width: 150, align: 'center'},
        {title: 'Issue Date', dataIndex: 'createTime', width: 100, align: 'center', valueType: 'date'},
        // {title: 'Completion Date', dataIndex: 'completionDate', width: 100, align: 'center', valueType: 'date'},
    ];

    const rowSelection: any = {
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        columnWidth: 26,
        selectedRowKeys: selectedKeys,
        onChange: handleTableRowChange,
    };

    return (
        <PageContainer
            header={{breadcrumb: {}}}
        >
            <ProForm
                form={form}
                omitNil={false}
                layout={"vertical"}
                params={searchInfo}
                onFinish={handleFinish}
                name={'form-search-info'}
                initialValues={initSearchData}
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
                request={async (params: any) => initLoading ? handleQuerySeaExportInfo(params) : {}}
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
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="invoiceNum" label="Invoice No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="jobCode" label="Job No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={8}>
                                    <ProFormDateRangePicker
                                        placeholder={''}
                                        name="invoiceIssueDate" label="Invoice Issue Date"
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={3} className={'ant-row-search-btn'}>
                            <Button icon={<SearchOutlined/>} htmlType={'submit'}>Search</Button>
                        </Col>
                    </Row>
                </ProCard>
                <ProCard>
                    <Row gutter={24}>
                        <Col span={12}/>
                        <Col span={12}>
                            <ExecutionConditions
                                validateData={settleInfo}
                                hiddenState={{hiddenBusinessLine: true, hiddenExRate: true}}
                            />
                        </Col>
                    </Row>
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
                        rowSelection={rowSelection}
                        locale={{emptyText: 'No Data'}}
                        className={'antd-pro-table-expandable'}
                    />
                </ProCard>
            </ProForm>
        </PageContainer>
    )
}
export default JobAudit;