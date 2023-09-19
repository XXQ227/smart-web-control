import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProForm, ProFormSelect, ProFormText} from '@ant-design/pro-components'
import '@/global.less'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from '@/components/SearchProFormSelect'
import {useModel} from '@@/plugin-model/useModel'
import {BUSINESS_LINE_ENUM} from '@/utils/enum'
import {history} from 'umi'
import {BUSINESS_LINE} from '@/utils/common-data'

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
            val.type = type;
            // TODO: 查所有币种时，把 ['ALL'] 改成所有 币种的集合
            if (val.jobBusinessLine === 0) val.jobBusinessLine = [];
            if (val.billCurrencyName[0] === 'All') val.billCurrencyName = currencyList;
            const result: API.Result = await queryPendingInvoicingCharges(val);
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
                                        options={[{label: 'All', value: 0}, ...BUSINESS_LINE]}
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
                        </Col>
                    </Row>
                </ProCard>
            </ProForm>
        </PageContainer>
    )
}
export default Billing;