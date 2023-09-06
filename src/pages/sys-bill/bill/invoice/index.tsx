import React, {Fragment, useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProForm, ProFormSelect, ProFormText, ProTable} from '@ant-design/pro-components'
import '@/global.less'
import {Button, Col, Divider, Form, message, Popconfirm, Row} from 'antd'
import {CloseOutlined, DeleteOutlined, SaveOutlined, SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg, IconFont} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {BUSINESS_LINE_ENUM} from '@/utils/enum'

const initSearchData: any = {
    invoiceType: [1],
    invoiceNum: "",
    jobNumber: "",
    issuedId: '',
    jobBusinessLine: [],
    customerOrPayingAgentId: "",
    billCurrencyName: ["All"],
};

const PrintInvoice: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const chargeTypeList: any[] = [
        {label: 'AR', value: 1},
        {label: 'AP', value: 2},
        {label: 'Re-AR', value: 3},
        {label: 'Re-AP', value: 4},
        {label: 'Refund-AR', value: 5},
        {label: 'Refund-AP', value: 6},
    ];

    const {
        queryInvoices, queryInvoiceDetailById, cancelInvoice
    } = useModel('accounting.invoice', (res: any) => ({
        queryInvoices: res.queryInvoices,
        queryInvoiceDetailById: res.queryInvoiceDetailById,
        cancelInvoice: res.cancelInvoice,
    }));

    const [loading, setLoading] = useState(false);

    const [searchInfo, setSearchInfo] = useState<any>(initSearchData);

    const [invoiceList, setInvoiceList] = useState<any[]>([]);


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
    async function handleQueryInvoices(val?: any) {
        if (!loading) setLoading(true);

        try {
            const params: any = JSON.parse(JSON.stringify(val));
            // TODO: 查所有币种时，把 ['ALL'] 改成所有 币种的集合
            // if (params.jobBusinessLine === 0) params.jobBusinessLine = [];
            params.jobBusinessLine = [];
            if (params.billCurrencyName[0] === 'All') params.billCurrencyName = currencyList;

            const result: API.Result = await queryInvoices(params);
            if (result.success) {
                setInvoiceList(result.data);
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
     * @Description: TODO: 查询单票详情
     * @author XXQ
     * @date 2023/9/6
     * @param record    发票行
     * @returns
     */
    const handleQueryInvoiceDetailById = async (record: any) => {
        console.log(record);
    }

    /**
     * @Description: TODO: 打印发票
     * @author XXQ
     * @date 2023/9/6
     * @param record    发票行
     * @returns
     */
    const handlePrint = async (record: any) => {
        console.log(record);
    }


    /**
     * @Description: TODO: 作废发票
     * @author XXQ
     * @date 2023/9/6
     * @param record    发票行
     * @returns
     */
    const handleCancelInvoice = async (record: any) => {
        console.log(record);
    }

    const handleFinish = async (val: any) => {
        try {
            await handleQueryInvoices(val);
        } catch (e) {
            message.error(e);
        }
    };


    const columns: ProColumns[] = [
        {title: 'B-Line', dataIndex: 'businessLine', width: 60, align: 'center', valueEnum: BUSINESS_LINE_ENUM},
        {title: 'Job No.', dataIndex: 'jobCode', width: 150},
        {title: 'Invoice No.', dataIndex: 'invoiceNum', width: 150},
        {title: 'Payer / Vendor', dataIndex: 'customerNameEn',},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 120, align: 'center'},
        // TODO: valueType 数据显示格式，
        //  详情见 https://procomponents.ant.design/components/schema#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype
        {title: 'Bill Amount', dataIndex: 'billAmount', width: 120, align: 'center',},
        {title: 'Creator', dataIndex: 'creator', width: 150, align: 'center'},
        {title: 'Sales', dataIndex: 'salesName', width: 150, align: 'center'},
        {title: 'Action', width: 100,
            render: (text, record, index) =>
                <Fragment>
                    <IconFont type={'icon-details'} onClick={() => handleQueryInvoiceDetailById(record)}/>
                    <Divider type="vertical" style={{ height: '100%' }} />
                    <IconFont type={'icon-details'} onClick={() => handlePrint(record)}/>
                    <Divider type="vertical" style={{ height: '100%' }} />
                    <Popconfirm
                        okText={'Yes'} cancelText={'No'}
                        title={`Are you sure to delete?`}
                        onConfirm={() => handleCancelInvoice(record)}
                    >
                        <CloseOutlined />
                    </Popconfirm>
                </Fragment>
        },
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
                params={searchInfo}
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
                {/* 搜索 */}
                <ProCard>
                    <Row gutter={24} className={'ant-row-search'}>
                        <Col span={21}>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name="invoiceType"
                                        label="Invoice Type"
                                        style={{minWidth: 150}}
                                        options={[...chargeTypeList]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={5}>
                                    <ProFormText name="invoiceNum" label="Invoice No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <ProFormText name="jobNumber" label="Job No." placeholder=""/>
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
                    <ProTable<any>
                        bordered
                        rowKey={'id'}
                        size="middle"
                        search={false}
                        options={false}
                        columns={columns}
                        loading={loading}
                        dateFormatter="string"
                        tableAlertRender={false}
                        dataSource={invoiceList || []}
                        locale={{emptyText: 'No Data'}}
                        className={'antd-pro-table-expandable'}
                    />
                </ProCard>
            </ProForm>
        </PageContainer>
    )
}
export default PrintInvoice;