import React, {Fragment, useState} from 'react';
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
import {Button, Form, message, Row, Col, Modal, Divider} from 'antd';
import {useModel} from 'umi';
import {history} from '@@/core/history'
import {EditOutlined, PlusCircleOutlined, SearchOutlined} from '@ant-design/icons'
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
    createTimeStart: '',
    createTimeEnd: '',
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
        queryBusinessUnitProperty,
    } = useModel('manager.business-unit', (res: any)=> ({
        queryBusinessUnitProperty: res.queryBusinessUnitProperty,
    }));

    const [relationShipVisible, setRelationShipVisible] = useState<boolean>(false);
    const [addCustomerVisible, setAddCustomerVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [PayerListVO, setPayerListVO] = useState<APIPayer[]>([]);
    const [CustomerListVO, setCustomerListVO] = useState<APIPayer[]>([]);
    const [searchParams, setSearchParams] = useState<APISearchBUParams>(searchLocation || searchQueryBUP);
    const [pagination, setPagination] = useState<any>(initPagination)

    const [highlightedRow, setHighlightedRow] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 200 });
    // const [fetching, setFetching] = useState(false);            // TODO: 搜索Customer Loading 状态
    // const [dataSourceList, setDataSourceList] = useState([]);   // TODO: 搜索Customer返回数据

    /**
     * @Description: TODO 获取 付款方 集合
     * @author LLS
     * @date 2023/7/19
     * @param params    参数
     * @returns
     */
    async function handleQueryPayer (params: APISearchBUParams){
        setLoading(true);
        const result: API.Result = await queryBusinessUnitProperty(params);
        if (result.success) {
            setPayerListVO(result.data);
            console.log(result.data)
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
     * @Description: TODO: 编辑 BUP 信息
     * @author LLS
     * @date 2023/7/26
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBUP = (record: APIPayer) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        // history.push({pathname: `/manager/business-unit/property/form/${btoa(record.id)}`});
        history.push({
            pathname: `/manager/business-unit/property/form/${btoa(record.id)}`,
            state: {
                searchParams: searchParams,
                payer: true,
            },
        });
    }

    const onFinish = async (val: APIPayer) => {
        console.log(searchParams)
        console.log(val)
        await handleQueryPayer(searchParams);
    }

    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    /**
     * @Description: TODO: 新增BUP弹框开启关闭
     * @author LLS
     * @date 2023/7/18
     * @returns
     */
    const handleModal = (val: number) => {
        if (val === 1) {
            setRelationShipVisible(!relationShipVisible);
        } else if (val === 2) {
            setAddCustomerVisible(!addCustomerVisible);
        }
    }

    const handleCustomizeIconClick = (record: any) => {
        // console.log(record.id)
        if (highlightedRow === record.id) {
            setHighlightedRow(null); // 如果当前行已经高亮，则取消高亮
        } else {
            setHighlightedRow(record.id); // 否则，高亮当前行
        }

        // 获取行在页面上的位置
        const rowElement = document.getElementById(`row-${record.id}`);
        console.log(rowElement)
        if (rowElement) {
            const rowRect = rowElement.getBoundingClientRect();
            console.log('Row Position:', rowRect);
            // console.log('Row Position+55:', rowRect.y+55);
            // setModalHeight(rowRect.y+55)

            const top = rowRect.top + 55; // Set the desired offset from the top
            setModalPosition({ top });
        }

        handleModal(1)
    };

    const columns: ProColumns<APIPayer>[] = [
        {
            title: 'Payer Identity',
            dataIndex: 'taxNum',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Payer Name',
            dataIndex: 'nameFullEn',
            // width: '20%',
        },
        {
            title: 'MDM Number',
            dataIndex: 'mdmCode',
            width: '15%',
            align: 'center',
        },
        {
            title: 'CV-Center Number',
            dataIndex: 'cvCenterNumber',
            width: '15%',
            align: 'center',
        },
        {
            title: 'OracleID(C)',
            dataIndex: 'oracleCustomerCode',
            width: '8%',
            align: 'center',
        },
        {
            title: 'OracleID(V)',
            dataIndex: 'oracleSupplierCode',
            width: '8%',
            align: 'center',
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
            width: 70,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditBUP(record)}/>
                        <DividerCustomize />
                        <CustomizeIcon
                            type={'icon-relationship'}
                            // onClick={() => handleModal(1)}
                            onClick={() => handleCustomizeIconClick(record)}
                            // highlighted={highlightedRow === record.id}
                        />
                    </Fragment>
                )
            }
        },
    ];

    const customerColumns: ProColumns<APIPayer>[] = [
        {
            title: 'Customer Identity',
            dataIndex: 'value',
            width: '25%',
            align: 'center',
        },
        {
            title: 'Customer Name',
            dataIndex: 'label',
            // width: '20%',
        },
        {
            title: 'Action',
            width: 70,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleEditBUP(record)}/>
                        <DividerCustomize />
                        <CustomizeIcon type={'icon-relationship'} onClick={() => handleModal(1)}/>
                    </Fragment>
                )
            }
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
                    // TODO: 设置默认值
                    // formKey={'business-unit-information'}
                    // TODO: 空间有改数据时触动
                    // onValuesChange={handleProFormValueChange}
                    // TODO: 提交数据
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Row gutter={rowGrid}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={16}>
                            <Row gutter={rowGrid}>
                                <Col xs={24} sm={24} md={12} lg={8} xl={10} xxl={13}>
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

    const rowClassName = (record: any) => {
        // console.log(record.id)
        // console.log(highlightedRow)
        return record.id === highlightedRow ? 'highlight-row' : '';
    };

    /**
     * @Description: TODO: change 事件
     * @author LLS
     * @date 2023/7/24
     * @param record
     * @returns
     */
    /*const handleChange = (record: any) => {
        console.log(record)
    }

    const addCustomerColumns: ProColumns<APIPayer>[] = [
        {
            title: 'Customer Identity',
            dataIndex: 'taxNum',
            width: '25%',
            align: 'center',
        },
        {
            title: 'Customer Name',
            dataIndex: 'nameFullEn',
            // width: '20%',
        },
    ];*/

    const handleOk = (val: any) => {
        handleModal(2);
        setCustomerListVO(val)
        console.log(CustomerListVO)
        console.log(val);
    };

    console.log(CustomerListVO)

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
                // rowClassName="editRow"
                rowClassName={rowClassName} // 设置每一行的类名，用于实现高亮效果
                onRow={(record) => ({
                    id: `row-${record.id}`, // 给每一行添加唯一的ref属性
                })}
                request={handleQueryPayer}
            />

            <Modal
                className={'ant-add-modal'}
                style={{ top: modalPosition.top }}
                // className={styles.addServiceModal}
                open={relationShipVisible}
                // open={true}
                // bodyStyle={{height: 170}}
                onOk={() => handleModal(1)}
                onCancel={() => handleModal(1)}
                // onOk={handleAddService}
                // onCancel={handleCancel}
                title={'RelationShip'}
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
                        htmlType={"submit"}
                        key="submit"
                        type="primary"
                        onClick={()=> handleEditBUP({id: '0'})}
                        // disabled={nextButtonDisabled}
                    >
                        Save
                    </Button>,
                ]}
                // footer={null}
            >

                <Divider />
                <ProTable<APIPayer>
                    rowKey={'id'}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={customerColumns}
                    dataSource={CustomerListVO}
                    search={false}
                />
            </Modal>

            {/*添加客户弹框*/}
            <AddCustomerModal
                open={addCustomerVisible}
                onOk={handleOk}
                onCancel={() => handleModal(2)}
            />
            {/*<Modal
                className={'ant-add-modal'}
                style={{ top: 550 }}
                open={addCustomerVisible}
                onOk={() => handleModal(2)}
                onCancel={() => handleModal(2)}
                title={'Add Customer'}
                width={800}
                footer={[
                    <Button htmlType={"button"} key="back" onClick={() => handleModal(2)}>
                        Cancel
                    </Button>,
                    <Button
                        htmlType={"submit"}
                        key="submit"
                        type="primary"
                        onClick={()=> handleEditBUP({id: '0'})}
                    >
                        Save
                    </Button>,
                ]}
            >
                <Divider />

                <Input
                    id={'search-input'}
                    autoComplete={'off'}
                    autoFocus={true}
                    // value={searchVal}
                    placeholder={'Search'}
                    // onChange={handleChangeInput}
                    // onKeyDown={handleKeyDown}
                    style={{borderRadius: '5px'}}
                    prefix={<IconFont type={'icon-search'} style={{marginRight: '8px'}}/>}
                />
                {
                    dataSourceList.length > 0 ?
                        <ProTable<APIPayer>
                            rowKey={'id'}
                            options={false}
                            bordered={true}
                            loading={loading}
                            pagination={false}
                            columns={addCustomerColumns}
                            dataSource={dataSourceList}
                            search={false}
                            showHeader={false}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        handleChange(record)
                                    },
                                }
                            }}
                        /> : null
                }
                <Table
                    className={'table modal-table'}
                    rowKey={'id'}
                    loading={fetching}
                    pagination={false}
                    dataSource={dataSourceList}
                    columns={addCustomerColumns}
                    showHeader={false}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                handleChange(record)
                            },
                        }
                    }}
                />

            </Modal>*/}
        </PageContainer>
    )
}
export default PayerListIndex;