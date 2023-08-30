import React, {useEffect, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProForm, ProFormSelect, ProFormText} from '@ant-design/pro-components'
import '@/global.less'
import ExpandTable from '@/components/ExpandTable'
import {Button, Col, Form, message, Row, Space} from 'antd'
import ExecutionConditions from '@/pages/sys-bill/bill/components/execution-conditions/ExecutionConditions'
import {SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'

const initSearchData: any = {
    jobNumber: "",
    jobBusinessLine:[],
    chargeType: [1,3,5],
    chargeDescription: "",
    customerOrPayingAgentName: "",
    Department: "",
    sales: "",
    billCurrencyName: ["HKD"],
    type:"1"
};

const BillingAP: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [searchInfo, setSearchInfo] = useState<any>(initSearchData);

    // TODO: 父数据列数据
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectRows, setSelectRows] = useState<any[]>([]);
    // TODO: 子单选中列数据
    const [selectedChildKeys, setSelectedChildKeys] = useState<React.Key[]>([]);
    const [selectChildRows, setSelectChildRows] = useState<any[]>([]);
    const [aList, setAPList] = useState<any[]>([]);
    const [validateData, setValidateData] = useState<any>({
        businessLine: false, customer: false, exRate: false, billCurrencyName: false
    });

    const currencyList = ['CNY', 'HKD', 'USD'];

    useEffect(()=> {
        if (aList?.length === 0) {
            const data: any[] = [];
            for (let i = 0; i < 3; i++) {
                const target: any = {
                    id: i, businessLine: 'FF', customerNameEn: 'China Duty Free INT\'LTD', jobCode: 'HKSE2212000' + i,
                    orderTakingDate: '2023-08-12', completionDate: '2023-08-12', creator: 'Vicky Lau',
                    salesName: 'Vincent Lam',
                    child: [],
                }
                for (let j = 0; j < 3; j++) {
                    const cgObj: any = {
                        id: `${i}-${j}`,
                        payerNameEn: 'China Duty Free INT\'LTD',
                        businessLine: j+1,
                        description: 'Freight Charge',
                        amount: 680,
                        currencyName: j < 2 ? 'HKD' : j > 4 ? 'USD' : 'CNY',
                        aBillCurrencyName: j <= 2 ? 'HKD' : j >= 4 ? 'USD' : 'CNY',
                        exRate: 1,
                        ABillAmount: 680,
                    }
                    target.child.push(cgObj);
                }
                data.push(target);
            }
            setAPList(data);
        }
    }, [aList?.length])

    /**
     * @Description: TODO: 搜索订单数据
     * @author XXQ
     * @date 2023/8/29
     * @param val   搜索条件，内容
     * @returns
     */
    async function handleQuerySeaExportInfo(val?: any) {
        console.log(val);
        return {};
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
                } else {
                    if (obj.selectRows) setSelectRows(obj.selectRows);
                    if (obj.selectedKeys) setSelectedKeys(obj.selectedKeys);
                }
            }
        }
    }

    async function handlePrintInvoice() {
        console.log(selectChildRows, selectedChildKeys);
    }

    const handleFinish = async (values: any) => {
        try {
            console.log(values);
        } catch {
            // console.log
        }
    };


    const columns: ProColumns[] = [
        {title: 'B-Line', dataIndex: 'businessLine', key: 'businessLine', width: 60, align: 'center'},
        {title: 'Job No.', dataIndex: 'jobCode', key: 'jobCode', width: 150},
        {title: 'Customer', dataIndex: 'customerNameEn', key: 'customerNameEn',},
        {title: 'Taking Date', dataIndex: 'orderTakingDate', key: 'orderTakingDate', width: 120, align: 'center'},
        {title: 'Completion', dataIndex: 'completionDate', key: 'completionDate', width: 120, align: 'center'},
        {title: 'Creator', dataIndex: 'creator', key: 'creator', width: 150, align: 'center'},
        {title: 'Sales', dataIndex: 'salesName', key: 'salesName', width: 150, align: 'center'},
        {title: 'Action', key: 'action', width: 100},
    ];

    const expandedColumns: ProColumns[] = [
        {title: 'Payer', dataIndex: 'payerNameEn', key: 'payerNameEn', align: 'left'},
        {title: 'Description', dataIndex: 'description', key: 'description', width: 200, align: 'left' },
        {title: 'Amount', dataIndex: 'amount', key: 'orderTakingDate', width: 120, align: 'center'},
        {title: 'CURR', dataIndex: 'currencyName', key: 'completionDate', width: 80, align: 'center'},
        {title: 'Bill CURR', dataIndex: 'aBillCurrencyName', key: 'creator', width: 80, align: 'center'},
        {title: 'Ex Rate', dataIndex: 'exRate', key: 'salesName', width: 100, align: 'center'},
        {title: 'Bill Amount', dataIndex: 'ABillAmount', key: 'salesName', width: 150, align: 'center'},
        {title: 'Action', key: 'action', width: 100},
    ];


    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>
                <ProForm
                    form={form}
                    omitNil={false}
                    submitter={false}
                    params={searchInfo}
                    layout={"vertical"}
                    onFinish={handleFinish}
                    name={'form-search-info'}
                    initialValues={searchInfo}
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
                    <Row gutter={24}>
                        <Col span={22}>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="jobNumber" label="Job No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
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
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormSelect
                                        name="chargeType"
                                        label="Charge Type"
                                        style={{minWidth: 150}}
                                        options={[
                                            {label: 'Normal', value: 1},
                                            {label: 'Reimbursement', value: 3},
                                            {label: 'Refund-AR', value: 4},
                                            {label: 'All', value: 0},
                                        ]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormSelect
                                        name="billCurrencyName"
                                        label="Bill Currency"
                                        style={{minWidth: 150}}
                                        options={['All', ...currencyList]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="description" label="Charge Description" placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <SearchProFormSelect
                                        qty={5}
                                        id={'payerId'}
                                        name={'payerId'}
                                        isShowLabel={true}
                                        label="Customer or Paying Agent"
                                        filedValue={'id'} filedLabel={'nameFullEn'}
                                        query={{branchId: '1665596906844135426', buType: 1}}
                                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="jobCode" label="JOb No." placeholder=""/>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={2}>
                            <Button icon={<SearchOutlined/>} onClick={handlePrintInvoice}>Search</Button>
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
            <ProCard>
                <Row gutter={24}>
                    <Col span={12}>
                        <Space>
                            <Button type="primary" onClick={handlePrintInvoice}>Print Invoice</Button>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <ExecutionConditions validateData={validateData}/>
                    </Col>
                </Row>
                <ExpandTable
                    loading={loading}
                    columns={columns}
                    dataSource={aList}
                    expandedColumns={expandedColumns}
                    handleSetSelectVal={handleSetSelectVal}
                />
            </ProCard>
        </PageContainer>
    )
}
export default BillingAP;