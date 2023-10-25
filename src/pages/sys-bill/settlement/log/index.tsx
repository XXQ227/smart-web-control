import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormText, ProTable
} from '@ant-design/pro-components'
import '@/global.less'
import {Button, Col, Form, message, Row} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {BUSINESS_LINE} from '@/utils/common-data'
import {BRANCH_ID} from '@/utils/auths'

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

const Billing: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

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


    const [dataSource, setDataSource] = useState<any[]>([]);


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
            // TODO: 查所有币种时，把 ['ALL'] 改成所有 币种的集合
            if (val.jobBusinessLine === 0) val.jobBusinessLine = [];
            if (val.billCurrencyName[0] === 'All') val.billCurrencyName = currencyList;
            const result: API.Result = await queryPendingInvoicingCharges(val);
            if (result.success) {
                setDataSource(result.data);
            } else {
                message.error(result.message);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        return val;
    }


    const columns: ProColumns[] = [
        {title: 'Type', dataIndex: 'type', width: 60, align: 'center',},
        {title: 'B-Line', dataIndex: 'bline', width: 60, align: 'center',},
        {title: 'Invoice No.', dataIndex: 'num', width: 180, align: 'center',},
        {title: 'Job No.', dataIndex: 'jobCodes', key: 'jobCode', width: 150, align: 'center', },
        {title: 'Customer', dataIndex: 'Customer',},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 90, align: 'center'},
        // TODO: valueType 数据显示格式，
        //  详情见 https://procomponents.ant.design/components/schema#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype
        {title: 'Bill AMT', dataIndex: 'unWriteOffBillInTaxAmount', width: 100, align: 'center',},
        {title: 'Issue By', dataIndex: 'createUserName', width: 150, align: 'center'},
        {title: 'Issue Date', dataIndex: 'createTime', width: 100, align: 'center', valueType: 'date'},
        // {title: 'Completion Date', dataIndex: 'completionDate', width: 100, align: 'center', valueType: 'date'},
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
                name={'form-search-info'}
                initialValues={initSearchData}
                onFinish={handleQuerySeaExportInfo}
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
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={5}>
                                    <ProFormSelect
                                        name="jobBusinessLine"
                                        label="Business Line"
                                        style={{minWidth: 150}}
                                        options={[{label: 'All', value: 0}, ...BUSINESS_LINE]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name="settleType"
                                        label="Settle Type"
                                        options={[
                                            {label: 'All', value: 0},
                                            {label: 'AR', value: 1},
                                            {label: 'AP', value: 2}
                                        ]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={10}>
                                    <SearchProFormSelect
                                        qty={5}
                                        isShowLabel={true}
                                        id={'customerOrPayingAgentId'}
                                        name={'customerOrPayingAgentId'}
                                        label={"Customer or Paying Agent"}
                                        filedValue={'id'} filedLabel={'nameFullEn'}
                                        query={{branchId: BRANCH_ID(), buType: 1}}
                                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormText name="serialNum" label="Transaction Ref No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormText name="invoiceNum" label="Invoice No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={10}>
                                    <ProFormDateRangePicker
                                        placeholder={''}
                                        name="invoiceIssueDate" label="Invoice Issue Date"
                                    />
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
            </ProForm>
            <ProCard>
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
                />
            </ProCard>
        </PageContainer>
    )
}
export default Billing;