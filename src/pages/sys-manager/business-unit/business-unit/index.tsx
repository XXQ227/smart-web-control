import React, {useEffect, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm, ProFormDatePicker,
    ProFormSelect,
    ProFormText,
    ProTable
} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row,} from 'antd';
import {useModel} from 'umi';
import {getUserID} from '@/utils/auths';
import {history} from '@@/core/history'
import {EditOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons'
import ls from "lodash";
import {getFormErrorMsg, rowGrid} from "@/utils/units";

export type LocationState = Record<string, unknown>;
type APIBU = APIManager.BU;
type APISearchBUParams = APIManager.SearchBUParams;


// TODO: 获取BU列表的请求参数
const initSearchParam = {
    name: '',
    createTimeStart: null,
    createTimeEnd: null,
    taxNum: '',
    mdmCode: '',
    currentPage: 1,
    pageSize: 20,
};

const initPagination = {
    current: 1,
    pageSize: 20,
    total: 0,
}

const BusinessUnitListIndex: React.FC<RouteChildrenProps> = (props) => {
    const {location: {state}} = props;
    const [form] = Form.useForm();
    const searchQueryBranch = ls.cloneDeep(initSearchParam)
    const searchLocation = state ? (state as LocationState)?.searchParams : '';

    const {
        queryBusinessUnit,
    } = useModel('manager.business-unit', (res: any)=> ({
        queryBusinessUnit: res.queryBusinessUnit,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [BUListVO, setBUListVO] = useState<APIBU[]>([]);
    const [searchParams, setSearchParams] = useState<APISearchBUParams>(searchLocation || searchQueryBranch);
    const [pagination, setPagination] = useState<any>(initPagination)

    // 当state有值，页面被刷新的时，重置跳传地址。为了清空原来的搜索参数
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (state) {
                history.push({pathname: '/manager/business-unit/list'});
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state]);

    /**
     * @Description: TODO 获取 业务单位 集合
     * @author LLS
     * @date 2023/7/28
     * @param params    参数
     * @returns
     */
    async function handleQueryBU (params: APISearchBUParams){
        setLoading(true);
        const result: API.Result = await queryBusinessUnit(params);
        if (result.success) {
            setBUListVO(result.data);
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
     * @Description: TODO: 编辑 BU 信息
     * @author LLS
     * @date 2023/7/28
     * @param record    操作当前 行
     * @returns
     */
    const handleEditBU = (record: APIBU) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        history.push({
            pathname: `/manager/business-unit/form/${btoa(record.id)}`,
            state: {
                searchParams: searchParams,
            },
        });
    }

    const onFinish = async (val: APISearchBUParams) => {
        console.log(searchParams);
        console.log(val);
        const params: APISearchBUParams = {...searchParams, ...val, bupType: val.bupType};
        console.log(params);
        setSearchParams(params);
        await handleQueryBU(params);
    }

    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    const columns: ProColumns<APIBU>[] = [
        {
            title: 'BU Identity',
            dataIndex: 'taxNum',
            width: '16%',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'BU Name',
            dataIndex: 'nameFullEn',
            ellipsis: true,
        },
        {
            title: 'MDM Number',
            dataIndex: 'mdmCode',
            width: '15%',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'Create Time',
            dataIndex: 'createTime',
            width: '10%',
            valueType: 'date',
            ellipsis: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 70,
            align: 'center',
            render: (text, record) =>
                <EditOutlined color={'#1765AE'} onClick={() => handleEditBU(record)}/>,
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
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                            <Row gutter={rowGrid}>
                                <Col xs={24} sm={24} md={20} lg={16} xl={10} xxl={12}>
                                    <ProFormText
                                        name='name'
                                        placeholder=''
                                        label='BU Name'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={16} xl={10} xxl={12}>
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
                                <Col xs={24} sm={24} md={12} lg={8} xl={7} xxl={7}>
                                    <ProFormText
                                        name='taxNum'
                                        placeholder=''
                                        label='BU Identity'
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={5} xxl={7}>
                                    <ProFormText
                                        name='mdmCode'
                                        placeholder=''
                                        label='MDM Number'
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
                            <Button key={'add'} onClick={()=> handleEditBU({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
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
        >
            {/*<ProCard className={'ant-card ant-card-pro-table'}>*/}
                {renderSearch()}

                <ProTable<APIBU>
                    rowKey={'id'}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={BUListVO}
                    search={false}
                    /*toolbar={{
                        actions: [
                            <Button key={'add'} onClick={()=> handleEditBU({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                                Add
                            </Button>
                        ]
                    }}*/
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
                    request={handleQueryBU}
                />
            {/*</ProCard>*/}
            {/*<FooterToolbar extra={<Button onClick={()=> handleEditCT({id: '0'})} style={{border: "none"}}><PlusCircleOutlined />Add</Button>}/>*/}
        </PageContainer>
    )
}
export default BusinessUnitListIndex;