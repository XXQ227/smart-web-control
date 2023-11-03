import React, {useState, Fragment, useEffect} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-table';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import {Button, Form, Input, message, Popconfirm} from 'antd'
import DividerCustomize from "@/components/Divider";
import {IconFont, getFormErrorMsg, ID_STRING} from "@/utils/units";
import ls from "lodash";
import FormItemInput from "@/components/FormItemComponents/FormItemInput";
import FormItemRadio from "@/components/FormItemComponents/FormItemRadio";
import {BRANCH_ID} from "@/utils/auths";

const {Search} = Input;

type APIInvoiceType = APISystem.InvoiceType;
type APISearchInvoiceType = APISystem.SearchInvoiceTypeParams;

// TODO: 获取发票类型列表的请求参数
const initSearchParam = {
    branchId: BRANCH_ID(),
    name: '',
    currentPage: 1,
    pageSize: 20
};

const InvoiceTypeListIndex: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const {
        InvoiceTypeList, queryInvoiceType, addInvoiceType, editInvoiceType, deleteInvoiceType, operateInvoiceType
    } = useModel('system.invoiceType', (res: any) => ({
        InvoiceTypeList: res.InvoiceTypeList,
        queryInvoiceType: res.queryInvoiceType,
        addInvoiceType: res.addInvoiceType,
        editInvoiceType: res.editInvoiceType,
        deleteInvoiceType: res.deleteInvoiceType,
        operateInvoiceType: res.operateInvoiceType,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [InvoiceTypeListVO, setInvoiceTypeListVO] = useState<APIInvoiceType[]>(InvoiceTypeList || []);
    const [searchParams, setSearchParams] = useState<APISearchInvoiceType>(initSearchParam);

    useEffect(()=> {
        if (searchParams?.name) {
            searchParams.name = ''
        }
    }, [form])

    /**
     * @Description: TODO: 删除 / 冻结发票类型
     * @author LLS
     * @date 2023/6/30
     * @param index     编辑行的序号
     * @param record    当前行的数据
     * @param state     状态
     * @returns
     */
    const handleOperateInvoiceType = async (index: number, record: APIInvoiceType, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const params: any = {id: record.id};
        const newData: APIInvoiceType[] = ls.cloneDeep(InvoiceTypeListVO);
        if (state === 'freeze') {
            // TODO: 冻结取反上传数据
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateInvoiceType(params);
            // TODO: 并更新当前数据
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        } else {
            if (record.id.indexOf('ID_') > -1) {
                result.success = true;
            } else {
                result = await deleteInvoiceType(params);
            }
            // TODO: 删除当前行，更新本地数据
            newData.splice(index, 1);
        }
        if (result.success) {
            message.success('Success');
            setInvoiceTypeListVO(newData);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO 获取发票类型集合
     * @author LLS
     * @date 2023/6/30
     * @param params    参数
     * @returns
     */
    async function handleQueryInvoiceType(params: APISearchInvoiceType) {
        setLoading(true);
        const result: API.Result = await queryInvoiceType(params);
        setInvoiceTypeListVO(result.data || []);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 编辑发票类型信息
     * @author LLS
     * @date 2023/6/30
     * @param index         TODO: 编辑行的序列号
     * @param record        TODO: 编辑行 id
     * @param filedName     TODO: 编辑字段
     * @param val           TODO: 值
     * @returns
     */
    const handleRowChange = (index: number, record: APIInvoiceType, filedName: string, val: any) => {
        const newData: APIInvoiceType[] = ls.cloneDeep(InvoiceTypeListVO) || [];
        record[filedName] = val?.target ? val.target.value : val;
        record.isChange = !['enableFlag', 'deleteFlag'].includes(filedName);
        newData.splice(index, 1, record);
        setInvoiceTypeListVO(newData);
    }

    const handleAddInvoiceType = () => {
        const addDataObj: APIInvoiceType = {
            id: ID_STRING(), isChange: true, name: '', taxFlag: 0, subSonCode: '', subCategoryCode: '', taxRate: 0
        };
        const newData: APIInvoiceType[] = ls.cloneDeep(InvoiceTypeListVO);
        newData.splice(0, 0, addDataObj);
        setInvoiceTypeListVO(newData);
    }

    const handleSaveInvoiceType = async (index: number, record: APIInvoiceType, state?: string) => {
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const newData: APIInvoiceType[] = ls.cloneDeep(InvoiceTypeListVO);
                // TODO: 保存、添加 公共参数
                const params: any = {
                    branchId: "1665596906844135426",
                    name: record.name,
                    taxFlag: record.taxFlag,
                    subSonCode: record.subSonCode,
                    subCategoryCode: record.subCategoryCode,
                    type: record.type,
                    taxRate: record.taxRate,
                };
                // TODO: 添加
                if (state === 'add') {
                    result = await addInvoiceType(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editInvoiceType(params);
                }
                record.isChange = false;
                newData.splice(index, 1, record);
                if (result.success) {
                    message.success('Success');
                    setInvoiceTypeListVO(newData);
                } else {
                    message.error(result.message);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    const columns: ProColumns<APIInvoiceType>[] = [
        {
            title: 'Name', dataIndex: 'name', tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    disabled={record.enableFlag}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    rules={[{required: true, message: 'Name'}]}
                    onChange={(val: any) => handleRowChange(index, record, 'name', val)}
                />
        },
        {
            title: 'Category Code', dataIndex: 'subCategoryCode', width: '15%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    disabled={record.enableFlag}
                    name={`subCategoryCode${record.id}`}
                    initialValue={record.subCategoryCode}
                    onChange={(val: any) => handleRowChange(index, record, 'subCategoryCode', val)}
                />
        },
        {
            title: 'Son Code', dataIndex: 'subSonCode', width: '15%',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    disabled={record.enableFlag}
                    name={`subSonCode${record.id}`}
                    initialValue={record.subSonCode}
                    onChange={(val: any) => handleRowChange(index, record, 'subSonCode', val)}
                />
        },
        {
            title: 'Type', dataIndex: 'type', width: '15%', align: 'center',
            tooltip: 'Type is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemRadio
                    required
                    options={[
                        {value: 1, label: 'AR'},
                        {value: 2, label: 'AP'},
                    ]}
                    disabled={record.enableFlag}
                    name={`type${record.id}`}
                    initialValue={record.type}
                    rules={[{required: true, message: 'Type'}]}
                    onChange={(val: any) => handleRowChange(index, record, 'type', val)}
                />
        },
        {
            title: 'Tax Rate', dataIndex: 'taxRate', width: '15%',
            tooltip: 'Tax Rate is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required
                    disabled={record.enableFlag}
                    name={`taxRate${record.id}`}
                    initialValue={record.taxRate}
                    className={'isNumber-inp'}
                    rules={[{ pattern: /^([0-9]\d*|0)(\.\d{0,2})?$/, message: "Must be 0.00 in numeric format" }]}
                    onChange={(val: any) => handleRowChange(index, record, 'taxRate', val)}
                />
        },
        {
            title: 'Action', width: 100, align: 'center', className: 'cursorStyle',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveInvoiceType(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <DividerCustomize hidden={!record.isChange}/>
                        <Popconfirm
                            onConfirm={() => handleOperateInvoiceType(index, record, 'freeze')}
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <IconFont hidden={record.isChange} type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateInvoiceType(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize hidden={record.isChange}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                    </Fragment>
                )
            },
        }
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <Form form={form}>
                <ProCard className={'ant-card-pro-table'}>
                    <ProTable<APIInvoiceType>
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        params={searchParams}
                        dataSource={InvoiceTypeListVO}
                        locale={{ emptyText: 'No Data' }}
                        className={'ant-pro-table-edit'}
                        rowClassName={(record)=> record.enableFlag ? 'ant-table-row-disabled' : ''}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async (val: any) => {
                                    searchParams.name = val;
                                    await handleQueryInvoiceType(searchParams);
                                }}
                            />
                        }
                        toolbar={{
                            actions: [
                                <Button key={'add'} onClick={handleAddInvoiceType} type={'primary'} icon={<PlusOutlined/>}>
                                    Add Invoice Type
                                </Button>
                            ]
                        }}
                        pagination={{
                            showSizeChanger: true,
                            pageSizeOptions: [20, 30, 50, 100],
                            onChange: (page, pageSize) => {
                                searchParams.currentPage = page;
                                searchParams.pageSize = pageSize;
                                setSearchParams(searchParams);
                            },
                        }}
                        request={handleQueryInvoiceType}
                    />
                </ProCard>
            </Form>
        </PageContainer>
    )
}
export default InvoiceTypeListIndex;