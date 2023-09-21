import React, {Fragment, useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProForm, ProFormSelect, ProFormText, ProTable} from '@ant-design/pro-components'
import '@/global.less'
import {Button, Col, Divider, Form, message, Popconfirm, Row} from 'antd'
import {CloseOutlined, PrinterOutlined, SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg, IconFont} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {BUSINESS_LINE_ENUM} from '@/utils/enum'
import InvoiceDetails from '@/pages/sys-bill/bill/components/invoice-details'

const initSearchData: any = {
    invoiceType: [1],
    invoiceNum: "",
    jobNumber: "",
    issuedId: '',
    jobBusinessLine: [],
    customerOrPayingAgentId: "",
    billCurrencyName: ["All"],
};

// TODO: 默认为 true；当首次加载数据后，改为 【false】
let initLoading = true;

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
        queryInvoices, queryInvoiceDetailById, cancelInvoice, editInvoice
    } = useModel('accounting.invoice', (res: any) => ({
        queryInvoices: res.queryInvoices,
        queryInvoiceDetailById: res.queryInvoiceDetailById,
        cancelInvoice: res.cancelInvoice,
        editInvoice: res.editInvoice,
    }));

    const [loading, setLoading] = useState(false);

    // TODO: 搜索状态
    const [searchInfo, setSearchInfo] = useState<any>(initSearchData);

    // TODO: 发票
    const [invoiceList, setInvoiceList] = useState<any[]>([]);

    //region TODO: 发票详情
    const [open, setOpen] = useState<boolean>(false);
    const [invoiceDetail, setInvoiceDetail] = useState<any>({});
    //endregion

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
        console.log(val);
        if (!loading) setLoading(true);

        try {
            const params: any = JSON.parse(JSON.stringify(val));
            // TODO: 查所有币种时，把 ['ALL'] 改成所有 币种的集合
            // if (params.jobBusinessLine === 0) params.jobBusinessLine = [];
            params.jobBusinessLine = [];
            if (typeof params.invoiceType === 'number') params.invoiceType = [val.invoiceType];
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
        if (initLoading) initLoading = false;
        return val;
    }


    /**
     * @Description: TODO: 查询单票详情
     * @author XXQ
     * @date 2023/9/6
     * @param record    发票行
     * @param index     序号
     * @returns
     */
    const handleQueryInvoiceDetailById = async (record: any, index: number) => {
        try {
            const result: API.Result = await queryInvoiceDetailById({id: record.id});
            if (result.success) {
                setOpen(true);
                setInvoiceDetail({...record, index, invoiceDetailList: result.data || []});
            } else {
                if (result.message) message.error(result.message);
            }
        } catch (e) {
            message.error(e);
        }
    }

    /**
     * @Description: TODO: 关闭弹框（保存备注）
     * @author XXQ
     * @date 2023/9/7
     * @param state
     * @param remark
     * @returns
     */
    const handleModalOperate = async (state: string, remark: string) => {
        if (state === 'ok') {
            setLoading(true);
            try {
                const result: API.Result = await editInvoice({id: invoiceDetail.id, remark});
                if (result.success) {
                    message.success('Success!');
                    const newData = invoiceList.slice(0);
                    const target: any = newData.find((item: any) => item.id === invoiceDetail.id);
                    newData.splice(invoiceDetail.index, 1, target);
                    setInvoiceList(newData);
                } else {
                    if (result.message) message.error(result.message);
                }
                setOpen(false);
                setLoading(false);
                setInvoiceDetail({});
            } catch (e) {
                message.error(e);
            }
        } else {
            setOpen(false);
            setInvoiceDetail({});
        }
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
        try {
            const result: API.Result = await cancelInvoice({id: record.id});
            if (result.success) {
                message.success('Success');
                // TODO: 删除成功后，过滤当前费发票。不再显示
                const invoiceArr: any[] = invoiceList.filter((item: any) => item.id !== record.id);
                setInvoiceList(invoiceArr);
            } else {
                if (result.message) message.error(result.message);
            }
        } catch (e) {
            message.error(e);
        }
    }

    const handleFinish = async (val: any) => {
        try {
            await handleQueryInvoices(val);
        } catch (e) {
            message.error(e);
        }
    };


    const columns: ProColumns[] = [
        {title: 'Type', dataIndex: 'type', width: 60, align: 'center'},
        {title: 'B-Line', dataIndex: 'jobBusinessLine', width: 60, align: 'center', valueEnum: BUSINESS_LINE_ENUM},
        {title: 'Invoice No.', dataIndex: 'invoiceNum', width: 90},
        {title: 'Job No.', dataIndex: 'jobsNumber', width: 150},
        {title: 'Payer / Vendor', dataIndex: 'customerOrPayingAgentName',},
        {title: 'Bill CURR', dataIndex: 'billCurrencyName', width: 100, align: 'center'},
        // TODO: valueType 数据显示格式，
        //  详情见 https://procomponents.ant.design/components/schema#%E8%87%AA%E5%AE%9A%E4%B9%89-valuetype
        {title: 'Bill Amount', dataIndex: 'billAmount', width: 120, align: 'center',},
        {title: 'Issue Date', dataIndex: 'issueDate', width: 100, align: 'center', valueType: 'date'},
        {title: 'Issue by', dataIndex: 'issueName', width: 130, align: 'center'},
        {
            title: 'Action', width: 100,
            render: (text, record, index) =>
                <Fragment>
                    <IconFont
                        color={'#1890ff'} type={'icon-detail'}
                        onClick={() => handleQueryInvoiceDetailById(record,index)}
                    />
                    <Divider type="vertical" style={{height: '100%'}}/>
                    <PrinterOutlined color={'#1890ff'} onClick={() => handlePrint(record)}/>
                    <Divider type="vertical" style={{height: '100%'}}/>
                    <Popconfirm
                        okText={'Yes'} cancelText={'No'}
                        title={`Are you sure to delete?`}
                        onConfirm={() => handleCancelInvoice(record)}
                    >
                        <CloseOutlined color={'#D39E59'} />
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
                request={async (params: any) => initLoading ? handleQueryInvoices(params) : {}}
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

                {!open ? null :
                    <InvoiceDetails
                        open={open}
                        invoiceDetail={invoiceDetail}
                        handleModalOperate={handleModalOperate}
                    />
                }
            </ProForm>
        </PageContainer>
    )
}
export default PrintInvoice;