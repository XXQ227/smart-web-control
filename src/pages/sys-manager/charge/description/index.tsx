import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProFormText, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Form, Input, message, Popconfirm} from 'antd'
import {CustomizeIcon, getFormErrorMsg, ID_STRING} from '@/utils/units'
import DividerCustomize from '@/components/Divider'
import ls from 'lodash'

const {Search} = Input;


type APICGItem = APIManager.CGItem;
type APISearchCGItem = APIManager.SearchCGItemParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchCGItem = {
    name: '',
    code: '',
    currentPage: 1,
    pageSize: 15,
};

const CGItemListIndex: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const {
        queryChargeItem, addChargeItem, editChargeItem, deleteChargeItem, OperateChargeItem
    } = useModel('manager.charge', (res: any) => ({
        CGItemList: res.CGItemList,
        queryChargeItem: res.queryChargeItem,
        addChargeItem: res.addChargeItem,
        editChargeItem: res.editChargeItem,
        deleteChargeItem: res.deleteChargeItem,
        OperateChargeItem: res.OperateChargeItem,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [CGItemListVO, setCGItemListVO] = useState<APICGItem[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetCGItemList(params: APISearchCGItem) {
        setLoading(true);
        const result: API.Result = await queryChargeItem(params);
        setCGItemListVO(result.data);
        setLoading(false);
        console.log(result);
        return result;
    }

    /**
     * @Description: TODO: 添加费目
     * @author XXQ
     * @date 2023/5/12
     * @returns
     */
    const handleAddCGItem = () => {
        const newData: APICGItem[] = CGItemListVO?.map((item: APICGItem) => ({...item})) || [];
        const rowKey = ID_STRING();
        newData.splice(0, 0, {id: rowKey});
        setCGItemListVO(newData);
    }

    /**
     * @Description: TODO: 编辑费目信息
     * @author XXQ
     * @date 2023/5/11
     * @param index         TODO: 编辑行的序列号
     * @param record        TODO: 编辑行 id
     * @param filedName     TODO: 编辑字段
     * @param val           TODO: 值
     * @param option        TODO: 其他结果值
     * @returns
     */
    const handleRowChange = (index: number, record: APICGItem, filedName: string, val: any, option?: any) => {
        const newData: APICGItem[] = ls.cloneDeep(CGItemListVO) || [];
        if (filedName === 'deleteFlag') {
            newData.splice(index, 1);
        } else {
            record[filedName] = val?.target ? val.target.value : val;
            if (filedName === 'chargeItemId') {
                record.chargeStandardName = option.label;
                form.setFieldsValue({[filedName + record.id]: val});
            }
            record.isChange = !['enableFlag', 'deleteFlag'].includes(filedName);
            newData.splice(index, 1, record);
        }
        setCGItemListVO(newData);
    }

    /**
     * @Description: TODO: 保存费目
     * @author XXQ
     * @date 2023/5/12
     * @param record    费用行
     * @param index     编辑行的序列号
     * @returns
     */
    const handleSave = async (record: any, index: number) => {
        setLoading(true);
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const params: any = {
                    name: record.name, code: record.code, branchId: 0, subjectCodeAr: record.subjectCodeAr,
                    subjectCodeAp: record.subjectCodeAp, subjectCodeAd: record.subjectCodeAd
                };
                // TODO: 添加
                if (!(record.id.indexOf('ID_') > -1)) {
                    result = await addChargeItem(params);
                    record.id = result.data;
                }
                // TODO: 修改
                else {
                    params.id = record.id;
                    result = await editChargeItem(params);
                }
                if (result.success) {
                    delete record.isChange;
                    const newData: APICGItem[] = ls.cloneDeep(CGItemListVO);
                    newData.splice(index, 1, record);
                    setCGItemListVO(newData);
                    message.success('success');
                }
                setLoading(false);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
                setLoading(false);
            });
    }

    /**
     * @Description: TODO: 删除 / 冻结费目
     * @author XXQ
     * @date 2023/5/15
     * @param index     编辑行序列
     * @param record    编辑行数据
     * @param state     操作状态：delete：删除；lock：冻结
     * @returns
     */
    const handleOperateCGItem = async (index: number, record: APICGItem, state: string) => {
        setLoading(true);
        const params: any = {id: record.id};
        let result: API.Result = {success: false};
        let operate: number;
        // TODO: 删除
        if (state === 'deleteFlag') {
            if (record.id.indexOf('ID_') > -1) result = await deleteChargeItem(params);
            operate = record.deleteFlag ? 0 : 1;
        }
        // TODO: 冻结
        else {
            params.operate = operate = record.enableFlag ? 0 : 1;
            result = await OperateChargeItem(params)
        }
        if (result.success) {
            message.success('Success!');
            setLoading(false);
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            handleRowChange(index, record, state, operate);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }

    const columns: ProColumns<APICGItem>[] = [
        {
            title: 'Description',
            dataIndex: 'name',
            align: 'center',
            tooltip: 'Name is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`name${record.id}`}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    rules={[{required: true, message: 'Name'}]}
                    fieldProps={{
                        onChange: (val: any) => handleRowChange(index, record, 'name', val)
                    }}
                />
        },
        {
            title: 'Short Name',
            dataIndex: 'code',
            align: 'center',
            tooltip: 'Name is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    id={`code${record.id}`}
                    name={`code${record.id}`}
                    initialValue={record.code}
                    disabled={record.enableFlag}
                    rules={[{required: true, message: 'Code'}]}
                    fieldProps={{
                        onChange: (val: any) => handleRowChange(index, record, 'code', val)
                    }}
                />
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
                <Fragment>
                    <CustomizeIcon
                        type={'icon-save'} hidden={!record.isChange}
                        onClick={() => handleSave(record, index)}
                    />
                    <Popconfirm
                        okText={'Yes'} cancelText={'No'}
                        onConfirm={() => handleOperateCGItem(index, record, 'enableFlag')}
                        title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                    >
                        <DividerCustomize hidden={!record.isChange}/>
                        <CustomizeIcon
                            hidden={record.id?.indexOf('ID_') > -1}
                            type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}
                        />
                    </Popconfirm>
                    <Popconfirm
                        onConfirm={() => handleOperateCGItem(index, record, 'deleteFlag')}
                        title={'Are you sure to delete?'} okText={'Yes'} cancelText={'No'}
                    >
                        <Divider type='vertical'/>
                        <DeleteOutlined color={'red'}/>
                    </Popconfirm>
                </Fragment>,
        },
    ];

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <Form
                form={form}
            >
                <ProCard className={'ant-card-pro-table'}>
                    <ProTable<APICGItem>
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        params={searchParams}
                        dataSource={CGItemListVO}
                        className={'ant-pro-table-edit'}
                        rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                        pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async (val: any) => {
                                    searchParams.name = searchParams.code = val;
                                    await handleGetCGItemList(searchParams);
                                }}/>
                        }
                        toolbar={{
                            actions: [
                                <Button key={'add'} onClick={handleAddCGItem} type={'primary'} icon={<PlusOutlined/>}>
                                    Add CGItem
                                </Button>
                            ]
                        }}
                        // @ts-ignore
                        request={async (params: APISearchCGItem) => await handleGetCGItemList(params)}
                    />
                </ProCard>
            </Form>
        </PageContainer>
    )
}
export default CGItemListIndex;