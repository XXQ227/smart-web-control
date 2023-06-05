import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProFormText, ProTable} from '@ant-design/pro-components'
import {useModel, useParams} from 'umi';
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import {Popconfirm, Input, Button, message, Form} from 'antd'
import {CustomizeIcon, getFormErrorMsg, ID_STRING} from '@/utils/units'
import ls from 'lodash'
import DividerCustomize from '@/components/Divider'

const {Search} = Input;

type APIDictDetail = APIManager.DictDetail;
type APISearchDictDetail = APIManager.SearchDictDetailParams;

interface Props {
    DictDetailList: APIDictDetail[]
}

// TODO: 获取单票集的请求参数
const searchParams: APISearchDictDetail = {
    dictId: 0,
    dictLabel: '',
    currentPage: 1,            // TODO: 当前页数
    pageSize: 15,               // TODO: 每页数
};

const DictDetailDetailIndex: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);    // TODO: 字典类型 id
    const {
        queryDictDetail, addDictDetail, editDictDetail, deleteDictDetail, operateDictDetail,
    } = useModel('manager.dict', (res: any) => ({
        queryDictDetail: res.queryDictDetail,
        addDictDetail: res.addDictDetail,
        editDictDetail: res.editDictDetail,
        deleteDictDetail: res.deleteDictDetail,
        operateDictDetail: res.operateDictDetail,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [DictDetailListVO, setDictDetailListVO] = useState<APIDictDetail[]>(props.DictDetailList || []);

    /**
     * @Description: TODO: 获取字典类型类型详情
     * @author XXQ
     * @date 2023/6/2
     * @param params
     * @returns
     */
    async function handleGetDictDetailList(params: APISearchDictDetail) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.currentPage = params.current || 1;
        // params.pageSize = params.PageSize || 15;
        const result: API.Result = await queryDictDetail(params);
        setDictDetailListVO(result.data || []);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 添加详情
     * @author XXQ
     * @date 2023/6/2
     * @returns
     */
    const handleAddDictDetail = () => {
        const addDataDetailObj: APIDictDetail = {
            dictCode: '',
            dictId: '',
            dictLabel: '',
            dictValue: '',
            id: ID_STRING(),
            remark: '',
            isChange: true
        };
        const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO) || [];
        newData.splice(0, 0, addDataDetailObj);
        setDictDetailListVO(newData);
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
    const handleOperateDictDetail = async (index: number, record: APIDictDetail, filedName: string, val: any) => {
        const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setDictDetailListVO(newData);
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
    const handleSaveDictDetail = (index: number, record: APIDictDetail, state: string) => {
        form.validateFields()
            .then(async ()=> {
                let result: API.Result;
                const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO);
                // TODO: 保存、添加 公共参数
                const param: any = {
                    dictLabel: record.dictLabel, dictCode: record.dictCode,
                    dictValue: record.dictValue, remark: record.remark, sort: record.sort,
                };
                // TODO: 添加
                if (state === 'add') {
                    param.dictId = id;
                    result = await addDictDetail(param);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    param.id = record.id;
                    result = await editDictDetail(param);
                }
                record.isChange = false;
                newData.splice(index, 1, record);
                if (result.success) {
                    message.success('success');
                    setDictDetailListVO(newData);
                } else {
                    message.error(result.exceptionTip);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    /**
     * @Description: TODO:  删除、冻结操作
     * @author XXQ
     * @date 2023/6/2
     * @param index     当前行序号
     * @param record    当前行数据
     * @param state     操作状态：delete：删除；freezen：冻结
     * @returns
     */
    const handleDelFreezenDictDetail = async (index: number, record: APIDictDetail, state: string) => {
        let result: API.Result;
        const newData: APIDictDetail[] = ls.cloneDeep(DictDetailListVO);
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        // TODO: 删除
        if (state === 'delete') {
            if (!(record.id.indexOf('ID_') > -1)) result = await deleteDictDetail(params);
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateDictDetail(params);
            // TODO: 冻结成功后，把当前行冻结状态调整
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('success');
            setDictDetailListVO(newData);
        } else {
            message.error(result.exceptionTip);
        }
    }

    const columns: ProColumns<APIDictDetail>[] = [
        {
            title: 'Name',
            dataIndex: 'dictLabel',
            width: 200,
            align: 'left',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`dictLabel${record.id}`}
                    name={`dictLabel${record.id}`}
                    initialValue={record.dictLabel}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDictDetail(index, record, 'dictLabel', val)
                    }}
                />
        },
        {
            title: 'Short Name',
            dataIndex: 'dictName',
            width: 200,
            align: 'center',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`dictName${record.id}`}
                    name={`dictName${record.id}`}
                    initialValue={record.remark}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDictDetail(index, record, 'dictName', val)
                    }}
                />
        },
        {
            title: 'Code',
            dataIndex: 'dictCode',
            width: 200,
            align: 'center',
            tooltip: 'Code is required',
            className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`dictName${record.id}`}
                    name={`dictName${record.id}`}
                    initialValue={record.remark}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDictDetail(index, record, 'dictName', val)
                    }}
                />
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    placeholder=''
                    disabled={record.enableFlag}
                    id={`remark${record.id}`}
                    name={`remark${record.id}`}
                    initialValue={record.remark}
                    fieldProps={{
                        onChange: (val: any) => handleOperateDictDetail(index, record, 'remark', val)
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
                            onClick={() => handleSaveDictDetail(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <Popconfirm
                            onConfirm={() => handleDelFreezenDictDetail(index, record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                        >
                            <DividerCustomize hidden={!record.isChange}/>
                            <DeleteOutlined color={'red'}/>
                        </Popconfirm>
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'} placement={'topRight'}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                            onConfirm={() => handleDelFreezenDictDetail(index, record, 'freezen')}
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

    return (
        <ProTable<APIDictDetail>
            rowKey={'ID'}
            search={false}
            options={false}
            bordered={true}
            loading={loading}
            columns={columns}
            params={searchParams}
            dataSource={DictDetailListVO}
            locale={{ emptyText: 'No Data' }}
            className={'ant-pro-table-edit'}
            headerTitle={
                <Search
                    placeholder='' enterButton="Search" loading={loading}
                    onSearch={async (val: any) => {
                        searchParams.dictLabel = val;
                        await handleGetDictDetailList(searchParams);
                    }}/>
            }
            toolbar={{
                actions: [
                    <Button key={'add'} onClick={handleAddDictDetail} type={'primary'} icon={<PlusOutlined/>}>
                        Add DictDetail
                    </Button>
                ]
            }}
            pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
            // @ts-ignore
            request={(params: APISearchDictDetail) => handleGetDictDetailList(params)}
        />
    )
}
export default DictDetailDetailIndex;