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
import type { TabsProps} from 'antd';
import {Button, Col, Form, message, Row, Spin, Tabs} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import {useModel} from '@@/plugin-model/useModel'
import {history} from 'umi'
import {BUSINESS_LINE} from '@/utils/common-data'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {BRANCH_ID} from '@/utils/auths'

const initSearchData: any = {
    businessType: "",
    customerId: null,
    jobCode: "",
    branchId: BRANCH_ID(),
    bmsUploadStatus: 1,
};

// TODO: 默认为 true；当首次加载数据后，改为 【false】
let initLoading = true;

const JobAudit: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const {
        queryAuditJob, auditJob
    } = useModel('accounting.audit', (res: any) => ({
        queryAuditJob: res.queryAuditJob,
        auditJob: res.auditJob,
    }));

    const {
        queryAccountPeriodCommon, AccountPeriodList
    } = useModel('common', (res: any)=> ({
        queryAccountPeriodCommon: res.queryAccountPeriodCommon,
        AccountPeriodList: res.AccountPeriodList,
    }))

    const [loading, setLoading] = useState(false);

    const [activeKey, setActiveKey] = useState<string>('1');

    const [dataSource, setDataSource] = useState<any[]>([]);

    const [searchInfo, setSearchInfo] = useState<any>(initSearchData);

    // TODO: 选中行数据
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

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
    async function handleQueryAuditJob(val?: any, tabKey?: string) {
        if (!loading) setLoading(true);
        if (initLoading) initLoading = false;
        try {

            // TODO: 没有账期时，获取账期数据账期
            if (AccountPeriodList?.length === 0) await queryAccountPeriodCommon({branchId: BRANCH_ID(), name: ''});

            if (val.invoiceIssueDate?.length > 0) {
                val.invoiceIssueStartDate = val.invoiceIssueDate[0];
                val.invoiceIssueEndDate = val.invoiceIssueDate[1];
            }

            const params: any = {...initSearchData, ...JSON.parse(JSON.stringify(val))};

            const result: API.Result = await queryAuditJob(params);
            if (result.success) {
                setDataSource(result.data);
            } else {
                if (result.message) message.error(result.message);
            }
            // TODO: 当 tabKey 有值时，才做更新操作
            if (tabKey) setActiveKey(tabKey);
            // TODO: 当搜索内容没有改变时，不做更新操作
            if (JSON.stringify(val) !== JSON.stringify(searchInfo)) setSearchInfo(val);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        return val;
    }

    /**
     * @Description: TODO: 核销单票
     * @author XXQ
     * @date 2023/9/19
     * @returns
     */
    async function handleAuditJob() {
        setLoading(true);
        try {
            const result: API.Result = await auditJob({jobIdList: selectedKeys});
            if (result.success) {
                message.success('success!');
                await handleQueryAuditJob(searchInfo);
            } else {
                if (result.message) message.error(result.message);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
    }

    async function handleChangeTabs(keys: string) {
        await handleQueryAuditJob(searchInfo, keys)
    }


    const columns: ProColumns[] = [
        {title: 'B-Line', dataIndex: 'businessLine', width: 60, align: 'center',},
        {title: 'Job No.', dataIndex: 'jobCode', width: 150, align: 'center',},
        {title: 'Customer', dataIndex: 'customerName',},
        {title: 'Taking Date', dataIndex: 'takingDate', width: 100, align: 'center', valueType: 'date'},
        {title: 'Complete Date', dataIndex: 'completeDate', width: 110, align: 'center', valueType: 'date'},
        {title: 'Sales', dataIndex: 'sales', width: 90, align: 'center'},
        {title: 'Creator', dataIndex: 'creator', width: 90, align: 'center'},
        {title: 'BMS Volume', dataIndex: 'bmsVolume', width: 90, align: 'center'},
        {title: 'AR in HKD', dataIndex: 'arLocal', width: 90, align: 'center'},
        {title: 'AP in HKD', dataIndex: 'apLocal', width: 90, align: 'center'},
        {title: 'Profit Ratio', dataIndex: 'profitRatio', width: 90, align: 'center'},
        {title: 'Status', dataIndex: 'status', width: 90, align: 'center', },
    ];

    const rowSelection: any = {
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        columnWidth: 26,
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys: React.Key[]) => setSelectedKeys(selectedRowKeys),
    };

    const tabItemChildren = (
        <ProTable<any>
            bordered
            rowKey={'id'}
            size="middle"
            search={false}
            options={false}
            columns={columns}
            dateFormatter="string"
            dataSource={dataSource}
            tableAlertRender={false}
            rowSelection={rowSelection}
            locale={{emptyText: 'No Data'}}
            className={'antd-pro-table-expandable'}
        />
    );

    const items: TabsProps['items'] = [
        {key: '1', label: 'Outstanding', children: tabItemChildren,},
        {key: '2', label: 'Processing', children: tabItemChildren,},
        {key: '3', label: 'BMS Error', children: tabItemChildren,},
        {key: '4', label: 'Oracle Error', children: tabItemChildren,},
    ];


    return (
        <PageContainer header={{breadcrumb: {}}}>
            <ProForm
                form={form}
                omitNil={false}
                layout={"vertical"}
                params={searchInfo}
                name={'form-search-info'}
                onFinish={handleQueryAuditJob}
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
                                <Button
                                    disabled={selectedKeys?.length === 0}
                                    type={'primary'} onClick={handleAuditJob} loading={loading}
                                >
                                    Audit
                                </Button>
                            </FooterToolbar>
                        );
                    },
                }}
                request={async (params: any) => initLoading ? handleQueryAuditJob(params) : {}}
            >
                {/* 搜索 */}
                <ProCard className={'ant-pro-card-search'}>
                    <Row gutter={24} className={'ant-row-search'}>
                        <Col span={21}>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormSelect
                                        placeholder={''}
                                        name={"businessType"}
                                        label={"Business Line"}
                                        style={{minWidth: 150}}
                                        options={[{label: 'All', value: 0}, ...BUSINESS_LINE]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        placeholder={''}
                                        name="billingMonth"
                                        label="Billing Month"
                                        options={AccountPeriodList}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={10}>
                                    <SearchProFormSelect
                                        qty={5}
                                        isShowLabel={true}
                                        id={'customerId'}
                                        name={'customerId'}
                                        label={"Customer or Paying Agent"}
                                        filedValue={'id'} filedLabel={'nameFullEn'}
                                        query={{branchId: BRANCH_ID(), buType: 1}}
                                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={5} xxl={4}>
                                    <ProFormText name="jobCode" label="Job No." placeholder=""/>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        label="Department"
                                        name="departmentId"
                                        placeholder={''}
                                        options={[]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={4} xxl={4}>
                                    <ProFormSelect
                                        label="Sales"
                                        name="salesId"
                                        placeholder={''}
                                        options={[]}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <ProFormDateRangePicker
                                        placeholder={''}
                                        name="invoiceIssueDate" label="Complete Date (Time-Span)"
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={3} className={'ant-row-search-btn'}>
                            <Button icon={<SearchOutlined/>} htmlType={'submit'} loading={loading}>Search</Button>
                        </Col>
                    </Row>
                </ProCard>
                <ProCard className={'ant-tabs-style'}>
                    <Spin spinning={loading}>
                        <Tabs
                            type="card"
                            items={items}
                            activeKey={activeKey}
                            destroyInactiveTabPane={true}
                            onChange={handleChangeTabs}
                        />
                    </Spin>
                </ProCard>
            </ProForm>
        </PageContainer>
    )
}
export default JobAudit;