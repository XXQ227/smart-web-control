import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProFormText, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Divider, Form, Input, message, Popconfirm} from 'antd'
import {IconFont, getFormErrorMsg, ID_STRING} from '@/utils/units'
import DividerCustomize from '@/components/Divider'
import ls from 'lodash'
import {BRANCH_ID} from "@/utils/auths";

const {Search} = Input;

type APIStandardCGItem = APIManager.StandardCGItem;
type APISearchStandardCGItem = APIManager.SearchStandardCGItemParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchStandardCGItem = {
    branchId: BRANCH_ID(),
    name: '',
    code: '',
    currentPage: 1,
    pageSize: 15,
};

interface Props {}

const SubjectIndex: React.FC<Props> = () => {
    const [form] = Form.useForm();
    const {
        queryChargeStandard, addChargeStandard, editChargeStandard, deleteChargeStandard, operateChargeStandard
    } = useModel('manager.charge', (res: any) => ({
        StandardCGItemList: res.StandardCGItemList,
        queryChargeStandard: res.queryChargeStandard,
        addChargeStandard: res.addChargeStandard,
        editChargeStandard: res.editChargeStandard,
        deleteChargeStandard: res.deleteChargeStandard,
        operateChargeStandard: res.operateChargeStandard,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [StandardCGItemListVO, setStandardCGItemListVO] = useState<APIStandardCGItem[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetStandardCGItemList(params: APISearchStandardCGItem) {
        setLoading(true);
        const result: API.Result = await queryChargeStandard(params);
        setStandardCGItemListVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 添加费目
     * @author XXQ
     * @date 2023/5/12
     * @returns
     */
    const handleAddStandardCGItem = () => {
        const newData: APIStandardCGItem[] = StandardCGItemListVO?.map((item: APIStandardCGItem) => ({...item})) || [];
        const rowKey = ID_STRING();
        newData.splice(0, 0, {id: rowKey,});
        setStandardCGItemListVO(newData);
    }

    /**
     * @Description: TODO: 编辑费目信息
     * @author XXQ
     * @date 2023/5/11
     * @param index         TODO: 编辑行的序列号
     * @param record        TODO: 编辑行 id
     * @param filedName     TODO: 编辑字段
     * @param val           TODO: 值
     * @returns
     */
    const handleRowChange = (index: number, record: APIStandardCGItem, filedName: string, val: any) => {
        const newData: APIStandardCGItem[] = ls.cloneDeep(StandardCGItemListVO);
        if (filedName === 'deleteFlag') {
            newData.splice(index, 1);
        } else {
            record[filedName] = val?.target ? val.target.value : val;
            record.isChange = !['enableFlag', 'deleteFlag'].includes(filedName);
            newData.splice(index, 1, record);
        }
        setStandardCGItemListVO(newData);
    }

    /**
     * @Description: TODO: 保存费目
     * @author XXQ
     * @date 2023/5/12
     * @param record    费用行
     * @param index     编辑行的序列号
     * @returns
     */
    const handleSave = (record: any, index: number) => {
        setLoading(true);
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const params: any = {
                    name: record.name, code: record.code, branchId: 0, subjectCodeAr: record.subjectCodeAr,
                    subjectCodeAp: record.subjectCodeAp, subjectCodeAd: record.subjectCodeAd
                };
                // TODO: 添加
                if (record.id.indexOf('ID_') > -1) {
                    result = await addChargeStandard(params);
                    record.id = result.data;
                }
                // TODO: 修改
                else {
                    params.id = record.id;
                    result = await editChargeStandard(params);
                }
                if (result.success) {
                    delete record.isChange;
                    const newData: APIStandardCGItem[] = ls.cloneDeep(StandardCGItemListVO);
                    newData.splice(index, 1, record);
                    setStandardCGItemListVO(newData);
                    message.success('Success');
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
    const handleOperateCG = async (index: number, record: APIStandardCGItem, state: string) => {
        setLoading(true);
        const params: any = {id: record.id};
        let result: API.Result;
        let operate: number;
        // TODO: 删除
        if (state === 'deleteFlag') {
            if (record.id.indexOf('ID_') > -1) {
                result = {success: true};
            } else {
                result = await deleteChargeStandard(params);
            }
            operate = record.deleteFlag ? 0 : 1;
        }
        // TODO: 冻结
        else {
            params.operate = operate = record.enableFlag ? 0 : 1;
            result = await operateChargeStandard(params)
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

    const columns: ProColumns<APIStandardCGItem>[] = [
        {
            title: 'Name',
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
            title: 'Code',
            dataIndex: 'code',
            align: 'center',
            tooltip: 'Code is required',
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
            title: 'AR Code',
            dataIndex: 'subjectCodeAr',
            width: 180,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`subjectCodeAr${record.id}`}
                    name={`subjectCodeAr${record.id}`}
                    initialValue={record.subjectCodeAr}
                    fieldProps={{
                        onChange: (val: any) => handleRowChange(index, record, 'subjectCodeAr', val)
                    }}
                />
        },
        {
            title: 'AP Code',
            dataIndex: 'subjectCodeAp',
            width: 180,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`subjectCodeAp${record.id}`}
                    name={`subjectCodeAp${record.id}`}
                    initialValue={record.subjectCodeAp}
                    fieldProps={{
                        onChange: (val: any) => handleRowChange(index, record, 'subjectCodeAp', val)
                    }}
                />
        },
        {
            title: 'Reimbursement Code ',
            dataIndex: 'subjectCodeAd',
            width: 180,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`subjectCodeAd${record.id}`}
                    name={`subjectCodeAd${record.id}`}
                    initialValue={record.subjectCodeAd}
                    fieldProps={{
                        onChange: (val: any) => handleRowChange(index, record, 'subjectCodeAd', val)
                    }}
                />
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            className: 'cursorStyle',
            render: (text, record, index) =>
                <Fragment>
                    <IconFont
                        type={'icon-save'} hidden={!record.isChange}
                        onClick={() => handleSave(record, index)}
                    />
                    <Popconfirm
                        okText={'Yes'} cancelText={'No'}
                        onConfirm={() => handleOperateCG(index, record, 'enableFlag')}
                        title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                    >
                        <DividerCustomize hidden={!record.isChange || record.id?.indexOf('ID_') > -1}/>
                        <IconFont
                            hidden={record.id?.indexOf('ID_') > -1}
                            type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}
                        />
                    </Popconfirm>
                    <Popconfirm
                        onConfirm={() => handleOperateCG(index, record, 'deleteFlag')}
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
            <Form form={form}>
                <ProCard className={'ant-card-pro-table'}>
                    <ProTable<APIStandardCGItem>
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        params={searchParams}
                        dataSource={StandardCGItemListVO}
                        className={'ant-pro-table-edit'}
                        rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                        pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async (val: any) => {
                                    searchParams.name = searchParams.code = val;
                                    await handleGetStandardCGItemList(searchParams);
                                }}/>
                        }
                        toolbar={{
                            actions: [
                                <Button key={'add'} onClick={handleAddStandardCGItem} type={'primary'} icon={<PlusOutlined/>}>
                                    Add Standard Charge Item
                                </Button>
                            ]
                        }}
                        // @ts-ignore
                        request={async (params: APISearchStandardCGItem) => await handleGetStandardCGItemList(params)}
                    />
                </ProCard>
            </Form>
        </PageContainer>
    )
}
export default SubjectIndex;