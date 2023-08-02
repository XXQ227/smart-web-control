import React, {Fragment, useState, useEffect} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProTable,
    ProForm,
    ProFormText,
    ProFormDatePicker
} from '@ant-design/pro-components';
import {Button, Form, message, Row, Col, Modal, Divider, Popconfirm} from 'antd';
import {useModel} from 'umi';
import {history} from '@@/core/history'
import {DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined} from '@ant-design/icons'
import ls from "lodash";
import {CustomizeIcon, getFormErrorMsg, rowGrid} from "@/utils/units";
import DividerCustomize from "@/components/Divider";
import AddCustomerModal from "@/pages/sys-manager/business-unit/payer/AddCustomerModal";

export type LocationState = Record<string, unknown>;
type APIPayer = APIManager.BUP;
type APISearchBUParams = APIManager.SearchBUParams;

// TODO: 获取BUP列表的请求参数
const initSearchParam = {
    name: '',
    createTimeStart: null,
    createTimeEnd: null,
    taxNum: '',
    mdmCode: '',
    cvCenterNumber: '',
    oracleCustomerCode: '',
    oracleSupplierCode: '',
    payerFlag: 1,
    currentPage: 1,
    pageSize: 20,
};

const initPagination = {
    current: 1,
    pageSize: 20,
    total: 0,
}

const PayerListIndex: React.FC<RouteChildrenProps> = (props) => {
    const {location: {state}} = props;
    const [form] = Form.useForm();
    const searchQueryBUP = ls.cloneDeep(initSearchParam)
    const searchLocation = state ? (state as LocationState)?.searchParams : '';

    const {
        queryBusinessUnitProperty, queryPayCustomer, queryCustomerPayer, addPayCustomer, deletePayCustomer,
    } = useModel('manager.business-unit', (res: any)=> ({
        queryBusinessUnitProperty: res.queryBusinessUnitProperty,
        queryPayCustomer: res.queryPayCustomer,
        queryCustomerPayer: res.queryCustomerPayer,
        addPayCustomer: res.addPayCustomer,
        deletePayCustomer: res.deletePayCustomer,
    }));

    const [payerCustomerVisible, setPayerCustomerVisible] = useState<boolean>(false);    // Payer 与 Customer 的关系弹框
    const [addCustomerVisible, setAddCustomerVisible] = useState<boolean>(false);        // 添加客户弹框
    const [customerPayerVisible, setCustomerPayerVisible] = useState<boolean>(false);    // 查看 Customer 有哪些 Payer 弹框
    const [loading, setLoading] = useState<boolean>(false);
    const [payerCustomerLoading, setPayerCustomerLoading] = useState<boolean>(false);
    const [customerPayerLoading, setCustomerPayerLoading] = useState<boolean>(false);
    const [PayerListVO, setPayerListVO] = useState<APIPayer[]>([]);
    const [CustomerListVO, setCustomerListVO] = useState<APIPayer[]>([]);
    const [modalPayerListVO, setModalPayerListVO] = useState<APIPayer[]>([]);
    const [searchParams, setSearchParams] = useState<APISearchBUParams>(searchLocation || searchQueryBUP);
    const [pagination, setPagination] = useState<any>(initPagination)

    const [payerHighlightedRow, setPayerHighlightedRow] = useState(null);
    const [customerHighlightedRow, setCustomerHighlightedRow] = useState(null);
    const [payerCustomerModalPosition, setPayerCustomerModalPosition] = useState({ top: 100 });
    const [customerPayerModalPosition, setCustomerPayerModalPosition] = useState({ top: 100 });
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(CustomerListVO.length === 0);

    // 当state有值，页面被刷新的时，重置跳传地址。为了清空原来的搜索参数
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (state) {
                history.push({pathname: '/manager/business-unit/payer'});
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state]);

    useEffect(() => {
        const newData: APIPayer[] = ls.cloneDeep(CustomerListVO);
        // TODO: 过滤出没有添加过的客户列表
        const filteredCustomerIds: APIPayer[] = newData.filter(customer => customer?.isAdd === true)
        if (filteredCustomerIds.length === 0) {
            setSaveButtonDisabled(true)
        } else {
            // TODO：当有 没有添加过的客户 时，保存按钮可以使用
            setSaveButtonDisabled(false)
        }
    }, [CustomerListVO]);

    useEffect(() => {
        const fetchData = async () => {
            if (payerCustomerVisible && payerHighlightedRow !== null) {
                await handleQueryPayerCustomer();
            }
        };
        fetchData();
    }, [payerCustomerVisible, payerHighlightedRow]);

    useEffect(() => {
        const fetchData = async () => {
            if (customerPayerVisible && customerHighlightedRow !== null) {
                await handleQueryCustomerPayer();
            }
        };
        fetchData();
    }, [customerPayerVisible, customerHighlightedRow]);

    /**
     * @Description: TODO 获取 付款方 集合
     * @author LLS
     * @date 2023/7/28
     * @param params    参数
     * @returns
     */
    async function handleQueryPayer (params: APISearchBUParams){
        setLoading(true);
        const result: API.Result = await queryBusinessUnitProperty(params);
        if (result.success) {
            setPayerListVO(result.data);
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
     * @Description: TODO 查询付款方已关联客户信息
     * @author LLS
     * @date 2023/7/28
     * @returns
     */
    async function handleQueryPayerCustomer (){
        setPayerCustomerLoading(true);
        const result: API.Result = await queryPayCustomer({id: payerHighlightedRow});
        if (result.success) {
            setCustomerListVO(result.data);
        } else {
            message.error(result.message);
        }
        setPayerCustomerLoading(false);
        return result;
    }

    /**
     * @Description: TODO 查询客户已关联付款方信息
     * @author LLS
     * @date 2023/8/2
     * @returns
     */
    async function handleQueryCustomerPayer (){
        setCustomerPayerLoading(true);
        const result: API.Result = await queryCustomerPayer({id: customerHighlightedRow});
        if (result.success) {
            setModalPayerListVO(result.data);
        } else {
            message.error(result.message);
        }
        setCustomerPayerLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑 BUP 信息
     * @author LLS
     * @date 2023/7/26
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBUP = (record: APIPayer) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        history.push({
            pathname: `/manager/business-unit/property/form/${btoa(record.id)}`,
            state: {
                searchParams: searchParams,
                payer: true,
            },
        });
    }

    const onFinish = async (val: APISearchBUParams) => {
        const params: APISearchBUParams = {
            ...searchParams,
            ...val,
            createTimeStart: val.createTimeStart,
            createTimeEnd: val.createTimeEnd,
        };
        setSearchParams(params);
        await handleQueryPayer(params);
    }

    const onFinishFailed = (val: any) => {
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    /**
     * @Description: TODO: 弹框开启关闭
     * @author LLS
     * @date 2023/7/28
     * @param operationType   1: Payer 与 Customer 的关系弹框开启关闭 2: 添加客户弹框开启关闭 3: 查看 Customer 有哪些 Payer 弹框开启关闭
     * @param record          操作当前 行
     * @returns
     */
    const handleModal = (operationType: number, record?: any) => {
        if (operationType === 1) {
            // 1: Payer 与 Customer 的关系弹框开启关闭
            setPayerHighlightedRow(payerCustomerVisible ? null : record.id);  // 打开弹框，高亮当前行；否则，取消高亮
            if (!payerCustomerVisible) {
                // 获取行在页面上的位置
                const rowElement = document.getElementById(`row-${record.id}`);
                if (rowElement) {
                    const rowRect = rowElement.getBoundingClientRect();
                    let top = rowRect.top
                    if (rowRect.top > 630) {
                        top = top - 440;
                    } else {
                        top = top + 57;
                    }
                    setPayerCustomerModalPosition({ top });
                }
            }
            setPayerCustomerVisible(!payerCustomerVisible);
        } else if (operationType === 2) {
            // 2: 添加客户弹框开启关闭
            setAddCustomerVisible(!addCustomerVisible);
        } else {
            // 3: 查看 Customer 有哪些 Payer 弹框开启关闭
            setCustomerHighlightedRow(customerPayerVisible ? null : record.id);  // 打开弹框，高亮当前行；否则，取消高亮
            if (!customerPayerVisible) {
                // 获取行在页面上的位置
                const rowElement = document.getElementById(`row-${record.id}`);
                if (rowElement) {
                    const rowRect = rowElement.getBoundingClientRect();
                    let top = rowRect.top
                    if (rowRect.top < 500) {
                        top = top + 60;
                    } else {
                        top = 100;
                    }
                    setCustomerPayerModalPosition({ top });
                }
            }
            setCustomerPayerVisible(!customerPayerVisible);
        }
    };

    // 判断客户是否已经存在列表中
    const isDuplicate = (newData: APIPayer[], val: APIPayer): boolean => {
        return newData.some((item) => item.id === val.id);
    };

    // 关闭添加客户弹框，把客户行数据更新到 Payer 与 Customer 的关系弹框列表中
    const handleOk = (val: APIPayer) => {
        handleModal(2);
        const newData: APIPayer[] = ls.cloneDeep(CustomerListVO);
        if (isDuplicate(newData, val)) {
            message.error("This customer has already been added.");
        } else {
            const customerData: APIPayer = {
                id: val.id,
                taxNum: val.taxNum,
                nameFullEn: val.nameFullEn,
                isAdd: true,
            };
            newData.push(customerData);
            setCustomerListVO(newData);
        }
    };

    /**
     * @Description: TODO: 新增客户与付款方关联
     * @author LLS
     * @date 2023/7/28
     * @returns
     */
    const handleAddRelationShip = async () => {
        setPayerCustomerLoading(true);
        const newData: APIPayer[] = ls.cloneDeep(CustomerListVO);
        // 过滤出没有添加过的客户Id
        const filteredCustomerIds: string[] = newData
            .filter(customer => customer?.isAdd === true)
            .map(customer => customer.id);
        const param: any = {
            customerId: filteredCustomerIds,
            payerId: payerHighlightedRow,
        };
        const result: API.Result = await addPayCustomer(param);
        if (result.success) {
            const customersWithoutIsAdd: APIPayer[] = CustomerListVO.map(({ isAdd, ...rest }) => rest);
            setCustomerListVO(customersWithoutIsAdd)
            message.success('Success!');
        } else {
            message.error(result.message);
        }
        setPayerCustomerLoading(false);
    }

    /**
     * @Description: TODO: 删除 Customer 与 Payer 的关系
     * @author LLS
     * @date 2023/7/28
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @returns
     */
    const handleOperateCustomer = async (record: APIPayer, index: number) => {
        setPayerCustomerLoading(true);
        let result: API.Result = {success: false};
        const newData: APIPayer[] = ls.cloneDeep(CustomerListVO);
        // TODO: 【删除】 操作
        if (record?.isAdd) {
            result.success = true;
        } else {
            const param: any = {
                customerId: record.id,
                payerId: payerHighlightedRow,
            };
            result = await deletePayCustomer(param);
        }
        // TODO: 删除当前行，更新本地数据
        newData.splice(index, 1);
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setCustomerListVO(newData);
        } else {
            message.error(result.message);
        }
        setPayerCustomerLoading(false);
    }

    const columns: ProColumns<APIPayer>[] = [
        {
            title: 'Payer Identity',
            dataIndex: 'taxNum',
            width: '15%',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'Payer Name',
            dataIndex: 'nameFullEn',
            ellipsis: true,
        },
        {
            title: 'MDM Number',
            dataIndex: 'mdmCode',
            width: '15%',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'CV-Center Number',
            dataIndex: 'cvCenterNumber',
            width: '15%',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'OracleID(C)',
            dataIndex: 'oracleCustomerCode',
            width: '8%',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'OracleID(V)',
            dataIndex: 'oracleSupplierCode',
            width: '8%',
            align: 'center',
            ellipsis: true,
        },
        /*{
            title: 'Status',
            dataIndex: 'Freezen',
            width: 100,
            disable: true,
            align: 'center',
        },*/
        {
            title: 'Action',
            width: 75,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditBUP(record)}/>
                        <DividerCustomize hidden={!!record.enableFlag}/>
                        <CustomizeIcon
                            hidden={!!record.enableFlag}
                            type={'icon-relationship'}
                            onClick={() => handleModal(1, record)}
                        />
                    </Fragment>
                )
            }
        },
    ];

    const customerColumns: ProColumns<APIPayer>[] = [
        {
            title: 'Customer Identity',
            dataIndex: 'taxNum',
            width: '20%',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'Customer Name',
            dataIndex: 'nameFullEn',
            ellipsis: true,
        },
        {
            title: 'Action',
            width: 75,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <CustomizeIcon
                            hidden={record.isAdd}
                            type={'icon-payers'}
                            onClick={() => handleModal(3, record)}
                        />
                        <Popconfirm
                            onConfirm={() => handleOperateCustomer(record, index)}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize hidden={record.isAdd}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            }
        },
    ];

    const payerColumns: ProColumns<APIPayer>[] = [
        {
            title: 'Payer Identity',
            dataIndex: 'taxNum',
            width: '25%',
            align: 'center',
            ellipsis: true,
        },
        {
            title: 'Payer Name',
            dataIndex: 'nameFullEn',
            ellipsis: true,
        },
    ];

    const renderSearch = () => {
        return (
            <ProCard>
                <ProForm
                    form={form}
                    // TODO: 不显示提交、重置按键
                    submitter={false}
                    // TODO: 焦点给到第一个控件
                    autoFocusFirstInput
                    initialValues={searchParams}
                    // TODO: 提交数据
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={16}>
                            <Row gutter={rowGrid}>
                                <Col xs={24} sm={24} md={12} lg={16} xl={10} xxl={13}>
                                    <ProFormText
                                        name='name'
                                        placeholder=''
                                        label='Payer Name'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={16} xl={10} xxl={11}>
                                    <Row>
                                        <label style={{ marginBottom: 8 }}>Create Time</label>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <ProFormDatePicker
                                                placeholder=''
                                                name="createTimeStart"
                                            />
                                        </Col>
                                        <Col>
                                            <span className={'ant-space-span'}/>
                                        </Col>
                                        <Col>
                                            <ProFormDatePicker
                                                placeholder=''
                                                name="createTimeEnd"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={rowGrid}>
                                <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                                    <ProFormText
                                        name='taxNum'
                                        placeholder=''
                                        label='Payer Identity'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={4}>
                                    <ProFormText
                                        name='mdmCode'
                                        placeholder=''
                                        label='MDM Number'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={5}>
                                    <ProFormText
                                        name='cvCenterNumber'
                                        placeholder=''
                                        label='CV-Center Number'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={5}>
                                    <ProFormText
                                        name='oracleCustomerCode'
                                        placeholder=''
                                        label='Oracle ID (Customer)'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={5}>
                                    <ProFormText
                                        name='oracleSupplierCode'
                                        placeholder=''
                                        label='Oracle ID (Vendor)'
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={2} className={'ant-search-button'}>
                            <Button key={'submit'} type={'primary'} htmlType={'submit'} icon={<SearchOutlined />}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={0}>
                            <Button key={'submit'} type={'primary'} htmlType={'submit'} style={{float: "right"}} icon={<SearchOutlined />}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
        )
    }

    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
            {renderSearch()}

            <ProTable<APIPayer>
                rowKey={'id'}
                options={false}
                bordered={true}
                loading={loading}
                columns={columns}
                params={searchParams}
                dataSource={PayerListVO}
                search={false}
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
                rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : record.id === payerHighlightedRow ? 'ant-table-row-highlight-row' : ''}
                onRow={(record) => ({
                    id: `row-${record.id}`, // 给每一行添加唯一的ref属性
                })}
                request={handleQueryPayer}
            />

            {/* TODO: Payer 与 Customer 的关系弹框 */}
            <Modal
                className={'ant-add-modal'}
                style={{ top: payerCustomerModalPosition.top }}
                open={payerCustomerVisible}
                onOk={() => handleModal(1)}
                onCancel={() => handleModal(1)}
                title={'RelationShip'}
                bodyStyle={{height: 275}}
                width={900}
                footer={[
                    <Button
                        icon={<PlusCircleOutlined />}
                        className={'ant-modal-relationship-add-customer'}
                        onClick={() => handleModal(2)}
                    >
                        Add Customer
                    </Button>,
                    <Button htmlType={"button"} key="back" onClick={() => handleModal(1)}>
                        Cancel
                    </Button>,
                    <Button
                        disabled={saveButtonDisabled}
                        htmlType={"submit"}
                        key="submit"
                        type="primary"
                        onClick={handleAddRelationShip}
                    >
                        Save
                    </Button>,
                ]}
            >
                <Divider />
                <ProTable<APIPayer>
                    className={'antd-pro-table-port-list'}
                    // 最多显示五行，超过就出现滑条
                    scroll={{ y: 195 }}
                    rowKey={'id'}
                    options={false}
                    bordered={true}
                    loading={payerCustomerLoading}
                    pagination={false}
                    rowClassName={(record)=> record.id === customerHighlightedRow ? 'ant-table-row-highlight-row' : ''}
                    onRow={(record) => ({
                        id: `row-${record.id}`, // 给每一行添加唯一的ref属性
                    })}
                    columns={customerColumns}
                    dataSource={CustomerListVO}
                    search={false}
                    request={handleQueryPayerCustomer}
                />
            </Modal>

            {/* TODO: 添加客户弹框 */}
            <AddCustomerModal
                open={addCustomerVisible}
                onOk={handleOk}
                onCancel={() => handleModal(2)}
            />

            {/* TODO: 查看 Customer 有哪些 Payer 弹框 */}
            <Modal
                className={'ant-add-modal ant-modal-customer-payer'}
                style={{ top: customerPayerModalPosition.top }}
                open={customerPayerVisible}
                onCancel={() => handleModal(3)}
                title={' '}
                bodyStyle={{height: 243}}
                width={760}
                closable={false}
                footer={[
                    <div key="footer-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            htmlType={"button"}
                            key="back"
                            type="primary"
                            onClick={() => handleModal(3)}
                        >
                            Close
                        </Button>
                    </div>
                ]}
            >
                <ProTable<APIPayer>
                    className={'antd-pro-table-port-list'}
                    // 最多显示五行，超过就出现滑条
                    scroll={{ y: 195 }}
                    rowKey={'id'}
                    options={false}
                    bordered={true}
                    loading={customerPayerLoading}
                    pagination={false}
                    columns={payerColumns}
                    dataSource={modalPayerListVO}
                    search={false}
                    request={handleQueryCustomerPayer}
                />
            </Modal>
        </PageContainer>
    )
}
export default PayerListIndex;