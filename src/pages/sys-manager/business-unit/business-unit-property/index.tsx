import React, {useEffect, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProTable,
    ProForm,
    ProFormText,
    ProFormSelect, ProFormDatePicker
} from '@ant-design/pro-components';
import {Button, Divider, Form, message, Modal, Row, Col} from 'antd';
import {useModel} from 'umi';
import {history} from '@@/core/history'
import {EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons'
import ls from "lodash";
import SearchProFormSelect from "@/components/SearchProFormSelect";
import {getFormErrorMsg, rowGrid} from "@/utils/units";

export type LocationState = Record<string, unknown>;
type APIBUP = APIManager.BUP;
type APISearchBUParams = APIManager.SearchBUParams;

// TODO: 获取BUP列表的请求参数
const initSearchParam = {
    bupType: 0,
    name: '',
    createTimeStart: null,
    createTimeEnd: null,
    taxNum: '',
    mdmCode: '',
    cvCenterNumber: '',
    oracleCustomerCode: '',
    oracleSupplierCode: '',
    currentPage: 1,
    pageSize: 20,
};

const initPagination = {
    current: 1,
    pageSize: 20,
    total: 0,
}

const BusinessUnitPropertyListIndex: React.FC<RouteChildrenProps> = (props) => {
    const {location: {state}} = props;
    const [form] = Form.useForm();
    // const FormItem = Form.Item;
    const searchQueryBUP = ls.cloneDeep(initSearchParam)
    const searchLocation = state ? (state as LocationState)?.searchParams : '';

    const {
        queryBusinessUnitProperty,
    } = useModel('manager.business-unit', (res: any)=> ({
        queryBusinessUnitProperty: res.queryBusinessUnitProperty,
    }));

    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [BUPListVO, setBUPListVO] = useState<APIBUP[]>([]);
    const [searchParams, setSearchParams] = useState<APISearchBUParams>(searchLocation || searchQueryBUP);
    const [pagination, setPagination] = useState<any>(initPagination)
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    const [BUParams, setBUParams] = useState(null);    // TODO: 所选的业务单位属性

    // 当state有值，页面被刷新的时，重置跳传地址。为了清空原来的搜索参数
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (state) {
                history.push({pathname: '/manager/business-unit/property'});
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state]);

    /**
     * @Description: TODO 获取 业务单位属性 集合
     * @author LLS
     * @date 2023/7/19
     * @param params    参数
     * @returns
     */
    async function handleQueryBUP (params: APISearchBUParams){
        setLoading(true);
        const result: API.Result = await queryBusinessUnitProperty(params);
        if (result.success) {
            setBUPListVO(result.data);
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
     * @date 2023/7/12
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBUP = (record: APIBUP) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/business-unit/property/form/${btoa(record.id)}`;
        if (record.id === '0') {
            console.log(BUParams)
            history.push({
                pathname: url,
                state: {
                    BUParams: BUParams,
                },
            })
        } else {
            history.push({
                pathname: url,
                state: {
                    searchParams: searchParams,
                },
            });
        }
    }

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param record    操作当前 行
     * @returns
     */
    /*const handleOperateJob = (record: any) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/business-unit/property/form/${btoa(record?.CTPID || 0)}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }*/

    /**
     * @Description: TODO: 新增BUP弹框开启关闭
     * @author LLS
     * @date 2023/7/18
     * @returns
     */
    const handleModal = () => {
        setVisible(!visible);
    }

    /*const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setNextButtonDisabled(value === ''); // Disable the button if the input value is empty
    };*/

    const onFinish = async (val: APISearchBUParams) => {
        console.log(searchParams);
        console.log(val);
        const params: APISearchBUParams = {
            ...searchParams,
            ...val,
            bupType: val.bupType,
            createTimeStart: val.createTimeStart,
            createTimeEnd: val.createTimeEnd,
        };
        console.log(params);
        setSearchParams(params);
        await handleQueryBUP(params);
    }

    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    const handleChange = (val: any, option?: any) => {
        console.log(val)
        console.log(option)
        setBUParams(option.data)
        setNextButtonDisabled(false)
    }

    const columns: ProColumns<APIBUP>[] = [
        {
            title: 'BUP Type',
            dataIndex: 'bupType',
            width: '13%',
            align: 'center',
        },
        {
            title: 'BUP Identity',
            dataIndex: 'taxNum',
            width: '16%',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'BUP Name',
            dataIndex: 'nameFullEn',
            ellipsis: true,
        },
        {
            title: 'MDM Number',
            dataIndex: 'mdmNumber',
            width: '11%',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'CV-Center Number',
            dataIndex: 'cvCenterNumber',
            width: '14%',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'OracleID(C)',
            dataIndex: 'oracleCustomerCode',
            width: '8%',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'OracleID(V)',
            dataIndex: 'oracleSupplierCode',
            width: '8%',
            ellipsis: true,
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
            render: (text, record) =>
                <EditOutlined color={'#1765AE'} onClick={() => handleEditBUP(record)}/>,
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
                                <Col xs={24} sm={24} md={12} lg={8} xl={4} xxl={4}>
                                    <ProFormSelect
                                        name='bupType'
                                        label='BUP Type'
                                        placeholder=''
                                        // initialValue={{value: 0}}
                                        options={[
                                            {label: 'ALL', value: 0},
                                            {label: 'Customer', value: 1},
                                            {label: 'Vendor', value: 2},
                                        ]}
                                        // fieldProps={{ onChange: (e) => searchParams.bupType = e }}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={20} lg={16} xl={10} xxl={9}>
                                    <ProFormText
                                        name='name'
                                        placeholder=''
                                        label='BUP Name'
                                        fieldProps={{
                                            onChange: (e) => {
                                                // console.log(e.target.value)
                                                // searchParams.name = e
                                            }
                                        }}
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
                                                dataFormat="YYYY-MM-DD"
                                            />
                                        </Col>
                                        <Col>
                                            <span className={'ant-space-span'}/>
                                        </Col>
                                        <Col>
                                            <ProFormDatePicker
                                                placeholder=''
                                                name="createTimeEnd"
                                                dataFormat="YYYY-MM-DD"
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
                                        label='BUP Identity'
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
                        <Col span={12}>
                            <Button key={'add'} onClick={handleModal} type={'primary'} icon={<PlusOutlined />}>
                                Add
                            </Button>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={0}>
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
            /*extra={
                <Button key={'add'} onClick={handleOperateJob} type={'primary'} icon={<PlusOutlined/>}>
                    Add Customer
                </Button>
            }*/
        >
            {/*<ProCard className={'ant-card ant-card-pro-table'}>*/}
                {renderSearch()}

                <ProTable<APIBUP>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={BUPListVO}
                    /*search={{
                        layout: 'vertical',
                        defaultCollapsed: false,
                        span: 6,
                        // hiddenNum: 1,
                    }}*/
                    // toolbar={{actions: [renderSearch()]}}
                    rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
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
                    // request={(params: APISearchBUParams)=> handleQueryBUP(params)}
                    request={handleQueryBUP}
                />
            {/*</ProCard>*/}
            {/*<FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>*/}

            <Modal
                className={'ant-add-modal'}
                open={visible}
                bodyStyle={{height: 170}}
                onOk={handleModal}
                onCancel={handleModal}
                title={'Add Business Unit Property'}
                width={540}
                footer={[
                    <Button htmlType={"button"} key="back" onClick={handleModal}>
                        Cancel
                    </Button>,
                    <Button
                        htmlType={"submit"}
                        key="submit"
                        type="primary"
                        onClick={()=> handleEditBUP({id: '0'})}
                        disabled={nextButtonDisabled}
                    >
                        Next
                    </Button>,
                ]}
            >
                {/*<ProForm
                    form={form}
                    // TODO: 不显示提交、重置按键
                    submitter={false}
                    // TODO: 焦点给到第一个控件
                    autoFocusFirstInput
                    // TODO: 设置默认值
                    formKey={'business-unit-information'}
                    // TODO: 空间有改数据时触动
                    // onValuesChange={handleProFormValueChange}
                    // TODO: 提交数据
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    // TODO: 向后台请求数据
                    // request={async () => handleGetCTPByID()}
                    layout={"horizontal"}
                >*/}
                    {/*<FormItem
                        name={'parentCompanyId'}
                        // initialValue={record.CGItemID}
                        // rules={[{required: true, message: `请输入${CGType === 1 ? 'Payer' : 'Vendor'}`}]}
                    >*/}
                <Row gutter={rowGrid}>
                    <Col span={24} className={'ant-add-divider'}>
                        <Divider />
                    </Col>
                    <Col span={23}>
                        <SearchProFormSelect
                            required
                            qty={10}
                            allowClear={false}
                            isShowLabel={true}
                            label="BU Name"
                            id={'buNameId'}
                            name={'buNameId'}
                            filedValue={'buId'}
                            filedLabel={'buName'}
                            url={"/apiBase/businessUnit/queryBusinessUnitCommon"}
                            handleChangeData={(val: any, option: any) => handleChange(val, option)}
                        />
                    </Col>
                </Row>
                    {/*</FormItem>*/}
                    {/*<div>
                        <Button htmlType={"button"} key="back" onClick={handleModal}>Cancel</Button>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </div>*/}
                {/*</ProForm>*/}
            </Modal>
        </PageContainer>
    )
}
export default BusinessUnitPropertyListIndex;