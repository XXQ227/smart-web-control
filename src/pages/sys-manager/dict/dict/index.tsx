import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProFormText, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import {Button, Form, Input, message, Popconfirm} from 'antd'
import {getUserID} from '@/utils/auths'
import ls from 'lodash'
import {CustomizeIcon, getFormErrorMsg, ID_STRING} from '@/utils/units'
import DividerCustomize from '@/components/Divider'

const {Search} = Input;

type APIDict = APIManager.Dict;
type APISearchDict = APIManager.SearchDictParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchDict = {
    UserID: getUserID(),
    dictName: '',
    dictCode: '',
};

const DictTypeIndex: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();

    const {
        DictList, queryDict, addDict, editDict, deleteDict, operateDict
    } = useModel('manager.dict', (res: any) => ({
        DictList: res.DictList,
        queryDict: res.queryDict,
        addDict: res.addDict,
        editDict: res.editDict,
        deleteDict: res.deleteDict,
        operateDict: res.operateDict,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [DictListVO, setDictListVO] = useState<APIDict[]>(DictList || []);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleQueryDict(params: APISearchDict) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryDict(params);
        setDictListVO(result.data || []);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 添加字典类型
     * @author XXQ
     * @date 2023/5/31
     * @returns
     */
    const handleAddDict = () => {
        const addDataObj: APIDict = {
            createUserId: getUserID(),
            deleteFlag: 0,
            dictCode: '',
            dictName: '',
            enableFlag: 0,
            id: ID_STRING(),
            remark: '',
            updateUserId: getUserID(),
            isChange: true,
        };
        const newData: APIDict[] = ls.cloneDeep(DictListVO) || [];
        newData.splice(0, 0, addDataObj);
        setDictListVO(newData);
    }
    /**
     * @Description: TODO: 修改字典类型
     * @author XXQ
     * @date 2023/5/31
     * @param index     当前行序号
     * @param record    操作行数据
     * @param filedName 编辑字段
     * @param val       编辑值
     * @returns
     */
    const handleOperateDict = async (index: number, record: APIDict, filedName: string, val: any) => {
        const newData: APIDict[] = ls.cloneDeep(DictListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        console.log(newData);
        setDictListVO(newData);
    }
    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/5/31
     * @param index     操作行的序列
     * @param record    操作行的数据
     * @param state     操作动作：TODO: {add: 添加, edit: 编辑}
     * @returns
     */
    const handleSaveDict = async (index: number, record: APIDict, state?: string) => {
        form.validateFields()
            .then(async ()=> {
                let result: API.Result;
                const newData: APIDict[] = ls.cloneDeep(DictListVO);
                // TODO: 保存、添加 公共参数
                const params: any = {dictName: record.dictName, dictCode: record.dictCode, remark: record.remark};
                // TODO: 添加
                if (state === 'add') {
                    result = await addDict(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editDict(params);
                }
                record.isChange = false;
                newData.splice(index, 1, record);
                if (result.success) {
                    message.success('success');
                    setDictListVO(newData);
                } else {
                    message.error(result.data);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }
    /**
     * @Description: TODO: 删除 / 冻结
     * @author XXQ
     * @date 2023/5/31
     * @param index     操作行的序列
     * @param record    操作行的数据
     * @param state     操作动作：TODO: {delete: 删除, freezen: 冻结}
     * @returns
     */
    const handleDelFreezenDict = async (index: number, record: APIDict, state: string) => {
        let result: API.Result;
        const newData: APIDict[] = ls.cloneDeep(DictListVO);
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        // TODO: 删除
        if (state === 'delete') {
            result = await deleteDict(params);
            newData.splice(index, 1);
        } else {
            params.operate = !record.enableFlag;
            result = await operateDict(params);
            // TODO: 冻结成功后，把当前行冻结状态调整
            record.enableFlag = !record.enableFlag;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('success');
            setDictListVO(newData);
        } else {
            message.error(result.data);
        }
    }

    // TODO: 列表
    const columns: ProColumns<APIDict>[] = [
        {
            title: 'Name',
            dataIndex: 'dictName',
            align: 'left',
            width: 300,
            tooltip: 'Name is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`dictName${record.id}`}
                    name={`dictName${record.id}`}
                    initialValue={record.dictName}
                    rules={[{required: true, message: 'Name'}]}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDict(index, record, 'dictName', val)
                    }}
                />
        },
        {
            title: 'Code',
            dataIndex: 'dictCode',
            align: 'left',
            width: 300,
            // TODO: 如果是必填字段，回下下面两个
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`dictCode${record.id}`}
                    name={`dictCode${record.id}`}
                    initialValue={record.dictCode}
                    rules={[{required: true, message: 'Code'}]}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDict(index, record, 'dictCode', val)
                    }}
                />
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            align: 'left',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`remark${record.id}`}
                    name={`remark${record.id}`}
                    initialValue={record.remark}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDict(index, record, 'remark', val)
                    }}
                />
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveDict(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <Popconfirm
                            onConfirm={() => handleDelFreezenDict(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize hidden={!record.isChange}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleDelFreezenDict(index, record, 'freezen')}
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <DividerCustomize hidden={isAdd} />
                            <CustomizeIcon
                                hidden={isAdd}
                                type={record.enableFlag ? 'icon-unlock-2' : 'icon-lock-2'}
                            />
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    console.log(DictListVO);
    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-pro-table'}>
                <Form form={form}>
                    <ProTable<APIDict>
                        rowKey={'ID'}
                        search={false}
                        options={false}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        params={searchParams}
                        dataSource={DictListVO}
                        locale={{emptyText: 'No Data'}}
                        className={'ant-pro-table-edit'}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async (val: any) => {
                                    searchParams.dictName = val;
                                    searchParams.dictCode = val;
                                    await handleQueryDict(searchParams);
                                }}/>
                        }
                        toolbar={{
                            actions: [
                                <Button key={'add'} onClick={handleAddDict} type={'primary'} icon={<PlusOutlined/>}>
                                    Add Dict
                                </Button>
                            ]
                        }}
                        pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                        // @ts-ignore
                        request={(params: APISearchDict) => handleQueryDict(params)}
                    />
                </Form>
            </ProCard>
        </PageContainer>
    )
}
export default DictTypeIndex;