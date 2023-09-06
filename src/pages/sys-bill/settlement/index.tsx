import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProForm, ProFormSelect, ProFormText} from '@ant-design/pro-components'
import '@/global.less'
import ExpandTable from '@/components/ExpandTable'
import {Button, Col, Form, message, Row, Space} from 'antd'
import ExecutionConditions from '@/pages/sys-bill/bill/components/execution-conditions/ExecutionConditions'
import {SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {BUSINESS_LINE_ENUM} from '@/utils/enum'
import {history} from 'umi'

const initSearchData: any = {
    jobNumber: "",
    jobBusinessLine: 0,
    chargeType: [1],
    chargeDescription: "",
    customerOrPayingAgentId: "",
    department: '',
    sales: "",
    billCurrencyName: ["All"],
};

const Settlement: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const {location} = history;
    const type = location?.pathname?.indexOf('/ar') > -1 ? 1 : 2;
    let chargeTypeList: any[] = [
        {label: 'Normal', value: 1},
        {label: 'Reimbursement', value: 3},
        {label: 'Refund-AR', value: 5},
    ];
    if (type === 2) {
        initSearchData.chargeType = [2];
        chargeTypeList = [
            {label: 'Normal', value: 2},
            {label: 'Reimbursement', value: 4},
            {label: 'Refund-AP', value: 6},
        ];
    }

    const {
        SalesList, queryUserCommon
    } = useModel('manager.user', (res: any) => ({
        SalesList: res.SalesList,
        queryUserCommon: res.queryUserCommon,
    }));

    const {
        queryPendingInvoicingCharges,
    } = useModel('accounting.invoice', (res: any) => ({
        queryPendingInvoicingCharges: res.queryPendingInvoicingCharges,
    }));

    const [loading, setLoading] = useState(false);


    const [apList, setAPList] = useState<any[]>([]);

    // TODO: 父数据列数据
    // const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    // const [selectRows, setSelectRows] = useState<any[]>([]);
    // TODO: 子单选中列数据
    const [selectedChildKeys, setSelectedChildKeys] = useState<React.Key[]>([]);
    const [selectChildRows, setSelectChildRows] = useState<any[]>([]);
    const [validateData, setValidateData] = useState<any>({
        businessLine: false, customer: false, exRate: false, billCurrencyName: false
    });

    const currencyList = ['CNY', 'HKD', 'USD'];

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

        try {
            // TODO: 获取用户数据
            if (SalesList?.length === 0) await queryUserCommon({branchId: '0'});
            const params: any = JSON.parse(JSON.stringify(val));
            params.type = type;
            // TODO: 查所有币种时，把 ['ALL'] 改成所有 币种的集合
            if (params.jobBusinessLine === 0) params.jobBusinessLine = [];
            if (params.billCurrencyName[0] === 'All') params.billCurrencyName = currencyList;
            const result: API.Result = await queryPendingInvoicingCharges(params);
            if (result.success) {
                setAPList(result.data);
            } else {
                if (result.message) message.error(result.message);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        return val;
    }

    /**
     * @Description: TODO: table 复选框数据处理方法
     * @author XXQ
     * @date 2023/8/25
     * @param params    选中的费用数据
     * @returns
     */
    function handleSetSelectVal(params: any) {
        for (const key in params) {
            // 防止遍历到原型链上的属性
            if (params.hasOwnProperty(key)) {
                const obj: any = params[key] || {};
                if (key === 'child') {
                    if (obj.selectChildRows) {
                        setSelectChildRows(obj.selectChildRows);
                        // TODO: 定义变量，是否有不同的业务线、客户、汇率、币种【不同为：true】
                        let businessLine = false, customer = false,
                            exRate = false, billCurrencyName = false;
                        if (obj.selectChildRows?.length > 0) {
                            // TODO: 它会创建一个存储唯一值的集合。Set 允许你存储各种类型的值（基本数据类型和引用数据类型），
                            //  并确保每个值在集合中只存在一次，即不会重复。
                            const uniqueBusinessLine = new Set(),
                                uniquePayerNameEns = new Set(),
                                uniqueExRates = new Set(),
                                uniqueABillCurrencyNames = new Set();
                            for (const item of obj.selectChildRows) {
                                uniqueBusinessLine.add(item.businessLine);
                                uniquePayerNameEns.add(item.payerNameEn);
                                uniqueExRates.add(item.exRate);
                                uniqueABillCurrencyNames.add(item.currencyName);
                            }
                            // TODO: 【.size】获取这个 Set 中不同值的数量
                            businessLine = uniqueBusinessLine.size > 1;
                            customer = uniquePayerNameEns.size > 1;
                            exRate = uniqueExRates.size > 1;
                            billCurrencyName = uniqueABillCurrencyNames.size > 1;
                        }
                        setValidateData({businessLine, customer, exRate, billCurrencyName});
                    }
                    if (obj.selectedChildKeys) setSelectedChildKeys(obj.selectedChildKeys);
                // } else {
                    // if (obj.selectRows) setSelectRows(obj.selectRows);
                    // if (obj.selectedKeys) setSelectedKeys(obj.selectedKeys);
                }
            }
        }
    }

    async function handlePrintInvoice() {
        console.log(selectChildRows, selectedChildKeys);
    }

    const handleFinish = async (val: any) => {
        try {
            console.log(val);
            await handleQuerySeaExportInfo(val);
        } catch (e) {
            message.error(e);
        }
    };


    const columns: ProColumns[] = [
        {title: 'B-Line', dataIndex: 'businessLine', width: 60, align: 'center', valueEnum: BUSINESS_LINE_ENUM},
        {title: 'Job No.', dataIndex: 'jobCode', key: 'jobCode', width: 150},
        {title: 'Customer', dataIndex: 'customerNameEn', key: 'customerNameEn',},
        {title: 'Taking Date', dataIndex: 'orderTakingDate', width: 120, align: 'center'},
        // TODO: valueType 数据显示格式，
        //  详情见 https://procomponents.ant.design/components/schema#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype
        {title: 'Completion', dataIndex: 'completionDate', width: 120, align: 'center', valueType: 'date',},
        {title: 'Creator', dataIndex: 'creator', key: 'creator', width: 150, align: 'center'},
        {title: 'Sales', dataIndex: 'salesName', key: 'salesName', width: 150, align: 'center'},
        {title: 'Action', key: 'action', width: 100},
    ];

    const expandedColumns: ProColumns[] = [
        {title: 'Payer', dataIndex: 'businessNameFullEn', align: 'left'},
        {title: 'Description', dataIndex: 'itemName', width: 200, align: 'left' },
        {title: 'Amount', dataIndex: 'orgAmount', width: 120, align: 'center'},
        {title: 'CURR', dataIndex: 'orgCurrencyName', width: 80, align: 'center'},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 80, align: 'center'},
        {title: 'Ex Rate', dataIndex: 'orgBillExrate', width: 100, align: 'center'},
        {title: 'Bill Amount', dataIndex: 'billInTaxAmount', width: 150, align: 'center'},
        {title: 'Action', key: 'action', width: 100},
    ];

    return (
        <PageContainer
            // loading={loading}
            header={{breadcrumb: {}}}
        >
            <ProForm
                form={form}
                omitNil={false}
                submitter={false}
                layout={"vertical"}
                params={initSearchData}
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
                // @ts-ignore
                request={async (params: any) => handleQuerySeaExportInfo(params)}
            >
                {/* 搜索 */}
                <ProCard>
                    <Row gutter={24} className={'ant-row-search'}>
                        <Col span={21}>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={5}>
                                    <ProFormText name="jobNumber" label="Job No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={5}>
                                    <ProFormSelect
                                        name="jobBusinessLine"
                                        label="Business Line"
                                        style={{minWidth: 150}}
                                        options={[
                                            {label: 'All', value: 0},
                                            {label: 'Freight Forwarding', value: 1},
                                            {label: 'Project Logistics', value: 2},
                                            {label: 'Contract Logistics', value: 3},
                                            {label: 'E-Commercial', value: 4},
                                            // {label: 'Shipping Agency', value: 5},
                                            // {label: 'Shipping Booking', value: 6},
                                            // {label: 'Shipping Container', value: 7},
                                        ]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name="chargeType"
                                        label="Charge Type"
                                        style={{minWidth: 150}}
                                        options={[...chargeTypeList]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <ProFormSelect
                                        name="department"
                                        label="Department"
                                        style={{minWidth: 150}}
                                        options={[
                                            {label: 'All', value: 0},
                                        ]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name="sales"
                                        label="Sales"
                                        style={{minWidth: 150}}
                                        options={SalesList || []}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={4}>
                                    <SearchProFormSelect
                                        qty={5}
                                        isShowLabel={true}
                                        id={'customerOrPayingAgentId'}
                                        name={'customerOrPayingAgentId'}
                                        label={"Customer or Paying Agent"}
                                        filedValue={'id'} filedLabel={'nameFullEn'}
                                        query={{branchId: '1665596906844135426', buType: 1}}
                                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={4}>
                                    <ProFormText name="chargeDescription" label="Charge Description" placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name="billCurrencyName"
                                        label="Bill Currency"
                                        style={{minWidth: 150}}
                                        options={['All', ...currencyList]}
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
                        <Col span={12}>
                            <Space>
                                <Button
                                    disabled={selectedChildKeys?.length === 0}
                                    type="primary" onClick={handlePrintInvoice}
                                >Print Invoice</Button>
                            </Space>
                        </Col>
                        <Col span={12}>
                            <ExecutionConditions validateData={validateData}/>
                        </Col>
                    </Row>
                    <ExpandTable
                        loading={loading}
                        columns={columns}
                        dataSource={apList}
                        expandedColumns={expandedColumns}
                        handleSetSelectVal={handleSetSelectVal}
                    />
                </ProCard>
            </ProForm>
        </PageContainer>
    )
}
export default Settlement;